import { useState, useEffect } from "react";

// Event emitter for location changes
type LocationChangeListener = (locationId: number) => void;
const locationChangeListeners: LocationChangeListener[] = [];

export const emitLocationChange = (locationId: number) => {
  locationChangeListeners.forEach((listener) => listener(locationId));
};

export const onLocationChange = (listener: LocationChangeListener) => {
  locationChangeListeners.push(listener);
  // Return cleanup function
  return () => {
    const index = locationChangeListeners.indexOf(listener);
    if (index > -1) {
      locationChangeListeners.splice(index, 1);
    }
  };
};

export const useSelectedLocation = () => {
  const [selectedLocationId, setSelectedLocationId] = useState<number>(1);

  useEffect(() => {
    const savedLocationId = localStorage.getItem("selectedLocationId");
    if (savedLocationId) {
      setSelectedLocationId(parseInt(savedLocationId, 10));
    }

    const cleanup = onLocationChange((locationId: number) => {
      setSelectedLocationId(locationId);
    });

    return cleanup;
  }, []);

  const setLocation = (locationId: number) => {
    setSelectedLocationId(locationId);
    localStorage.setItem("selectedLocationId", locationId.toString());
    emitLocationChange(locationId);
  };

  return {
    selectedLocationId,
    setLocation,
  };
};
