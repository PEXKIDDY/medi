"use client";

import { useState } from 'react';

interface Location {
  latitude: number;
  longitude: number;
}

export function useGeolocation() {
  const [location, setLocation] = useState<Location | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const getLocation = () => {
    setLoading(true);
    setError(null);
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setLoading(false);
      },
      (err) => {
        switch(err.code) {
          case err.PERMISSION_DENIED:
            setError("You denied permission to access your location. Please enable location permissions in your browser settings to use this feature.");
            break;
          case err.POSITION_UNAVAILABLE:
            setError("Your location information is currently unavailable. Please ensure your device's location service is enabled and try again.");
            break;
          case err.TIMEOUT:
            setError("The request to get your location timed out. Please check your network connection and try again.");
            break;
          default:
            setError("An unknown error occurred while trying to get your location.");
            break;
        }
        setLoading(false);
      }
    );
  };

  const clearError = () => {
    setError(null);
  }

  return { location, error, loading, getLocation, clearError };
}
