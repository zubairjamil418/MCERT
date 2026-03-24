/**
 * Image Editor Utilities
 * Helper functions for basic image processing operations
 * Note: Advanced editing is now handled by TUI Image Editor
 */

/**
 * Loads an image from a source URL
 * @param {string} src - Image source URL or data URL
 * @returns {Promise<HTMLImageElement>} - Loaded image element
 */
const loadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = (error) => reject(error);
    img.src = src;
  });
};

/**
 * Converts degrees to radians
 * @param {number} degrees - Angle in degrees
 * @returns {number} - Angle in radians
 */
const degToRad = (degrees) => {
  return (degrees * Math.PI) / 180;
};

/**
 * Creates a cropped and rotated image from the original
 * @param {string} imageSrc - Source image URL or data URL
 * @param {Object} croppedAreaPixels - Crop area in pixels {x, y, width, height}
 * @param {number} rotation - Rotation angle in degrees (default: 0)
 * @param {number} flip - Flip options {horizontal: boolean, vertical: boolean}
 * @returns {Promise<Blob>} - Cropped image as blob
 */
export const createCroppedImage = async (
  imageSrc,
  croppedAreaPixels,
  rotation = 0,
  flip = { horizontal: false, vertical: false }
) => {
  const image = await loadImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Failed to get canvas context");
  }

  // Set canvas to final crop size
  canvas.width = croppedAreaPixels.width;
  canvas.height = croppedAreaPixels.height;

  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Save context state
  ctx.save();

  // Apply rotation if needed
  if (rotation !== 0) {
    // Move to center of canvas
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(degToRad(rotation));
    ctx.translate(-canvas.width / 2, -canvas.height / 2);
  }

  // Apply flip if needed
  if (flip.horizontal || flip.vertical) {
    ctx.translate(canvas.width / 2, canvas.height / 2);

    if (flip.horizontal && flip.vertical) {
      ctx.scale(-1, -1);
    } else if (flip.horizontal) {
      ctx.scale(-1, 1);
    } else if (flip.vertical) {
      ctx.scale(1, -1);
    }

    ctx.translate(-canvas.width / 2, -canvas.height / 2);
  }

  // Draw the cropped portion of the image
  ctx.drawImage(
    image,
    croppedAreaPixels.x,
    croppedAreaPixels.y,
    croppedAreaPixels.width,
    croppedAreaPixels.height,
    0,
    0,
    croppedAreaPixels.width,
    croppedAreaPixels.height
  );

  // Restore context state
  ctx.restore();

  // Convert canvas to blob with error handling
  return new Promise((resolve, reject) => {
    try {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(
              new Error(
                "Failed to create blob from canvas - canvas may be empty"
              )
            );
            return;
          }
          resolve(blob);
        },
        "image/jpeg",
        0.95
      );
    } catch (error) {
      reject(new Error(`Canvas toBlob error: ${error.message}`));
    }
  });
};

/**
 * Converts a File object to a data URL
 * @param {File} file - File object to convert
 * @returns {Promise<string>} - Data URL string
 */
export const fileToDataURL = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Converts a blob to a File object
 * @param {Blob} blob - Blob to convert
 * @param {string} fileName - Name for the file
 * @param {string} fileType - MIME type of the file
 * @returns {File} - File object
 */
export const blobToFile = (blob, fileName, fileType) => {
  return new File([blob], fileName, {
    type: fileType,
    lastModified: Date.now(),
  });
};

/**
 * Gets the orientation of an image from EXIF data
 * @param {File} file - Image file
 * @returns {Promise<number>} - Orientation value (1-8)
 */
export const getImageOrientation = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const view = new DataView(e.target.result);
      if (view.getUint16(0, false) !== 0xffd8) {
        resolve(1); // Not a JPEG
        return;
      }

      const length = view.byteLength;
      let offset = 2;

      while (offset < length) {
        const marker = view.getUint16(offset, false);
        offset += 2;

        if (marker === 0xffe1) {
          // EXIF marker
          offset += 2;
          if (view.getUint32(offset, false) !== 0x45786966) {
            resolve(1);
            return;
          }

          const little = view.getUint16((offset += 6), false) === 0x4949;
          offset += view.getUint32(offset + 4, little);
          const tags = view.getUint16(offset, little);
          offset += 2;

          for (let i = 0; i < tags; i++) {
            if (view.getUint16(offset + i * 12, little) === 0x0112) {
              resolve(view.getUint16(offset + i * 12 + 8, little));
              return;
            }
          }
        } else if ((marker & 0xff00) !== 0xff00) {
          break;
        } else {
          offset += view.getUint16(offset, false);
        }
      }
      resolve(1);
    };
    reader.readAsArrayBuffer(file.slice(0, 64 * 1024));
  });
};

/**
 * Rotates an image based on EXIF orientation
 * @param {string} src - Image source URL
 * @param {number} orientation - EXIF orientation value
 * @returns {Promise<string>} - Rotated image as data URL
 */
export const rotateImageByOrientation = async (src, orientation) => {
  const image = await loadImage(src);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Failed to get canvas context");
  }

  // Set proper canvas dimensions based on orientation
  if (orientation > 4 && orientation < 9) {
    canvas.width = image.height;
    canvas.height = image.width;
  } else {
    canvas.width = image.width;
    canvas.height = image.height;
  }

  // Transform context based on orientation
  switch (orientation) {
    case 2:
      ctx.transform(-1, 0, 0, 1, canvas.width, 0);
      break;
    case 3:
      ctx.transform(-1, 0, 0, -1, canvas.width, canvas.height);
      break;
    case 4:
      ctx.transform(1, 0, 0, -1, 0, canvas.height);
      break;
    case 5:
      ctx.transform(0, 1, 1, 0, 0, 0);
      break;
    case 6:
      ctx.transform(0, 1, -1, 0, canvas.width, 0);
      break;
    case 7:
      ctx.transform(0, -1, -1, 0, canvas.width, canvas.height);
      break;
    case 8:
      ctx.transform(0, -1, 1, 0, 0, canvas.height);
      break;
    default:
      break;
  }

  ctx.drawImage(image, 0, 0);
  return canvas.toDataURL("image/jpeg", 0.95);
};

const imageEditorUtils = {
  createCroppedImage,
  fileToDataURL,
  blobToFile,
  getImageOrientation,
  rotateImageByOrientation,
};

export default imageEditorUtils;
