/**
 * Image compression utility for reducing image file sizes to maximum 1MB
 */

/**
 * Compresses an image file to ensure it's under 1MB
 * @param {File} file - The image file to compress
 * @param {number} maxSizeInMB - Maximum size in MB (default: 1)
 * @param {number} quality - Initial quality (0-1, default: 0.8)
 * @returns {Promise<File>} - Compressed image file
 */
export const compressImage = async (file, maxSizeInMB = 1, quality = 0.8) => {
  return new Promise((resolve, reject) => {
    // Check if file is an image
    if (!file.type.startsWith("image/")) {
      resolve(file); // Return original file if not an image
      return;
    }

    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

    // If file is already under the limit, return it as is
    if (file.size <= maxSizeInBytes) {
      resolve(file);
      return;
    }

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      // Calculate new dimensions while maintaining aspect ratio
      let { width, height } = img;

      // Start with original dimensions and reduce if needed
      const maxDimension = 2048; // Maximum dimension to prevent extremely large images
      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = (height * maxDimension) / width;
          width = maxDimension;
        } else {
          width = (width * maxDimension) / height;
          height = maxDimension;
        }
      }

      canvas.width = width;
      canvas.height = height;

      // Draw and compress image
      ctx.drawImage(img, 0, 0, width, height);

      const tryCompress = (currentQuality) => {
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Failed to compress image"));
              return;
            }

            // If still too large and quality can be reduced further
            if (blob.size > maxSizeInBytes && currentQuality > 0.1) {
              tryCompress(currentQuality - 0.1);
              return;
            }

            // If still too large, try reducing dimensions
            if (
              blob.size > maxSizeInBytes &&
              (canvas.width > 800 || canvas.height > 800)
            ) {
              canvas.width = Math.floor(canvas.width * 0.8);
              canvas.height = Math.floor(canvas.height * 0.8);
              ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
              tryCompress(0.7);
              return;
            }

            // Create new file with compressed data
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });

            resolve(compressedFile);
          },
          file.type,
          currentQuality
        );
      };

      tryCompress(quality);
    };

    img.onerror = () => {
      reject(new Error("Failed to load image"));
    };

    img.src = URL.createObjectURL(file);
  });
};

/**
 * Compresses multiple image files
 * @param {FileList|Array} files - Array of files to compress
 * @param {number} maxSizeInMB - Maximum size in MB (default: 1)
 * @param {Function} onProgress - Progress callback (optional)
 * @returns {Promise<Array>} - Array of compressed files
 */
export const compressImages = async (
  files,
  maxSizeInMB = 1,
  onProgress = null
) => {
  const fileArray = Array.from(files);
  const compressedFiles = [];

  for (let i = 0; i < fileArray.length; i++) {
    const file = fileArray[i];

    try {
      const compressedFile = await compressImage(file, maxSizeInMB);
      compressedFiles.push(compressedFile);

      // Call progress callback if provided
      if (onProgress) {
        onProgress({
          current: i + 1,
          total: fileArray.length,
          fileName: file.name,
          originalSize: file.size,
          compressedSize: compressedFile.size,
          compressionRatio: (
            ((file.size - compressedFile.size) / file.size) *
            100
          ).toFixed(1),
        });
      }
    } catch (error) {
      console.error(`Error compressing ${file.name}:`, error);
      // Add original file if compression fails
      compressedFiles.push(file);

      if (onProgress) {
        onProgress({
          current: i + 1,
          total: fileArray.length,
          fileName: file.name,
          error: error.message,
        });
      }
    }
  }

  return compressedFiles;
};

/**
 * Formats file size for display
 * @param {number} bytes - File size in bytes
 * @returns {string} - Formatted file size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};
