import React, { useState, useEffect } from "react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import { useAuth } from "../../../../contexts/AuthContext.jsx";
import Card from "components/card";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const containerStyle = {
  width: "100%",
  height: "80vh",
};

const defaultCenter = {
  lat: 37.7749, // Example: San Francisco latitude
  lng: -122.4194, // Example: San Francisco longitude
};

const LandingMap = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const { authFetch } = useAuth();

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ["maps"],
  });

  useEffect(() => {
    const geocodeLocation = async (locationName) => {
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
            locationName
          )}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&region=GB`
        );

        const data = await response.json();

        if (data.results && data.results.length > 0) {
          const { lat, lng } = data.results[0].geometry.location;
          return { lat, lng };
        }
        return null;
      } catch (error) {
        console.error("Geocoding error:", error);
        return null;
      }
    };

    const fetchAndGeocodeLocations = async () => {
      try {
        const response = await authFetch(
          `${import.meta.env.VITE_BACKEND_URL}sites`
        );
        const data = await response.json();

        // Process each location
        const processedLocations = await Promise.all(
          data.map(async (site) => {
            const coordinates = await geocodeLocation(site.location);
            return {
              ...site,
              coordinates: coordinates || defaultCenter, // fallback to default if geocoding fails
            };
          })
        );

        setLocations(processedLocations);

        // Set map center to first location if available
        if (
          processedLocations.length > 0 &&
          processedLocations[0].coordinates
        ) {
          setMapCenter(processedLocations[0].coordinates);
        }
      } catch (error) {
        console.error("Error fetching locations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAndGeocodeLocations();
  }, [authFetch]);

  const markerClick = (location) => {
    toast.info(
      <div>
        <div>Site Name: {location.siteName}</div>
        <div>Type: {location.type}</div>
        <div>Location: {location.location}</div>
      </div>
    );
  };

  if (!isLoaded || loading) return <div>Loading...</div>;

  return (
    <Card extra={"w-full h-full sm:overflow-auto mt-5"}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={mapCenter}
        zoom={10}
        mapTypeId="hybrid"
      >
        {locations.map((location) => (
          <Marker
            key={location.id}
            position={location.coordinates}
            onClick={() => markerClick(location)}
          />
        ))}
      </GoogleMap>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored" // Looks good with Tailwind
      />
    </Card>
  );
};

export default LandingMap;
