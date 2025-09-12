'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useGeolocation } from '@/hooks/use-geolocation';
import { getEmergencyUpdates, GetEmergencyUpdatesOutput } from '@/app/ai/flows/get-emergency-updates-flow';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Ambulance, Hospital, Timer, MapPin, AlertCircle, Loader2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

// Helper function to calculate distance (Haversine formula)
const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371; // Radius of the earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};

// Simulated hospital location (e.g., Cedars-Sinai Medical Center in LA)
const HOSPITAL_LOCATION = { latitude: 34.075, longitude: -118.3842 };
const AVG_SPEED_KM_PER_MIN = 0.8; // Average speed of an ambulance in city traffic

export default function EmergencyStatus() {
  const { location, error, getLocation } = useGeolocation();
  const [updates, setUpdates] = useState<GetEmergencyUpdatesOutput[]>([]);
  const [isFetchingUpdate, setIsFetchingUpdate] = useState(true);
  const [initialDistance, setInitialDistance] = useState<number | null>(null);
  const [currentDistance, setCurrentDistance] = useState<number | null>(null);

  useEffect(() => {
    // Start tracking location immediately on component mount
    getLocation();

    // Set up an interval to continuously get location and fetch updates
    const intervalId = setInterval(() => {
      getLocation();
    }, 10000); // Update location every 10 seconds

    return () => clearInterval(intervalId);
  }, [getLocation]);

  useEffect(() => {
    if (location) {
      const distance = getDistance(location.latitude, location.longitude, HOSPITAL_LOCATION.latitude, HOSPITAL_LOCATION.longitude);
      if (initialDistance === null) {
        setInitialDistance(distance);
      }
      setCurrentDistance(distance);

      const fetchUpdate = async () => {
        setIsFetchingUpdate(true);
        try {
          const time = distance / AVG_SPEED_KM_PER_MIN;
          const newUpdate = await getEmergencyUpdates({ distance, time });
          setUpdates(prev => [newUpdate, ...prev.slice(0, 4)]); // Keep last 5 updates
        } catch (e) {
          console.error("Failed to get emergency update:", e);
        } finally {
          setIsFetchingUpdate(false);
        }
      };
      
      fetchUpdate();
    }
  }, [location, initialDistance]);
  
  const progressPercentage = initialDistance && currentDistance !== null
    ? Math.max(0, Math.min(100, ((initialDistance - currentDistance) / initialDistance) * 100))
    : 0;

  return (
    <div className="w-full max-w-4xl p-4 md:p-8 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl text-destructive">
            <Ambulance className="h-8 w-8 animate-pulse" />
            Emergency Response In Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="relative h-64 w-full rounded-lg overflow-hidden border">
              <Image 
                src="https://picsum.photos/seed/map/1200/400" 
                alt="Map showing route to hospital" 
                fill
                style={{ objectFit: 'cover' }}
                data-ai-hint="route map"
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <p className="text-white text-lg font-semibold">Live Map Simulation</p>
              </div>
          </div>
          
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Location Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm font-medium">
                <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> Your Location</span>
                <span className="flex items-center gap-1"><Hospital className="h-4 w-4" /> Nearest Hospital</span>
            </div>
            <Progress value={progressPercentage} className="h-4" />
            <div className="flex justify-between items-center text-xs text-muted-foreground">
                <span>{currentDistance?.toFixed(1) ?? '...'} km to destination</span>
                <span>ETA: {updates[0]?.eta ?? 'Calculating...'}</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
          <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Timer />
                Live Updates
              </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
              {isFetchingUpdate && updates.length === 0 && (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="ml-4 text-muted-foreground">Connecting to emergency services...</p>
                </div>
              )}
              {updates.map((update, index) => (
                  <div key={index} className={`p-4 rounded-lg border ${index === 0 ? 'bg-secondary' : 'bg-background'}`}>
                      <p className={`font-semibold ${index === 0 ? 'text-primary' : ''}`}>{update.status}</p>
                      <p className="text-muted-foreground">{update.updateMessage}</p>
                  </div>
              ))}
          </CardContent>
      </Card>

    </div>
  );
}
