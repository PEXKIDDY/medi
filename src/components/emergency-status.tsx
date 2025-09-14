
'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { getEmergencyUpdates, GetEmergencyUpdatesOutput } from '@/app/ai/flows/get-emergency-updates-flow';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Ambulance, Hospital, Timer, MapPin, Loader2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const INITIAL_DISTANCE_KM = 15; // Starting distance
const AVG_SPEED_KM_PER_MIN = 0.8; // Average speed of an ambulance

const getStatusForDistance = (distance: number) => {
  if (distance > 10) return "Ambulance Dispatched";
  if (distance > 2) return "Ambulance En Route";
  if (distance > 0.5) return "Approaching Destination";
  if (distance > 0) return "Arriving at Hospital";
  return "Arrived";
};


export default function EmergencyStatus() {
  const [updates, setUpdates] = useState<GetEmergencyUpdatesOutput[]>([]);
  const [isFetchingUpdate, setIsFetchingUpdate] = useState(true);
  const [currentDistance, setCurrentDistance] = useState<number>(INITIAL_DISTANCE_KM);
  const lastStatusRef = useRef<string | null>(null);

  useEffect(() => {
    const fetchUpdate = async (distance: number) => {
      // Don't fetch if we are already fetching
      if (isFetchingUpdate) return;
      
      setIsFetchingUpdate(true);
      try {
        const time = distance / AVG_SPEED_KM_PER_MIN;
        const newUpdate = await getEmergencyUpdates({ distance, time });
        setUpdates(prev => [newUpdate, ...prev.slice(0, 4)]);
        lastStatusRef.current = newUpdate.status;
      } catch (e) {
        console.error("Failed to get emergency update:", e);
        // Add a fallback update in case of API error
        const timeToArrival = Math.round(distance / AVG_SPEED_KM_PER_MIN);
        const fallbackUpdate: GetEmergencyUpdatesOutput = {
          status: getStatusForDistance(distance),
          updateMessage: "The team is on their way. Please remain as calm as possible.",
          eta: `${timeToArrival} minutes`,
        };
        setUpdates(prev => [fallbackUpdate, ...prev.slice(0, 4)]);
        lastStatusRef.current = fallbackUpdate.status;
      } finally {
        setIsFetchingUpdate(false);
      }
    };
    
    // Fetch initial update
    if (updates.length === 0) {
        fetchUpdate(INITIAL_DISTANCE_KM);
    }

    // Set up interval to simulate ambulance movement
    const intervalId = setInterval(() => {
      setCurrentDistance(prevDistance => {
        if (prevDistance <= 0) {
          clearInterval(intervalId);
          return 0;
        }
        
        // Simulate movement every 10 seconds
        const newDistance = Math.max(0, prevDistance - (AVG_SPEED_KM_PER_MIN * (10 / 60))); 
        
        const currentStatus = getStatusForDistance(prevDistance);
        const newStatus = getStatusForDistance(newDistance);
        
        // Only fetch a new update from the AI if the status has changed
        if (newStatus !== currentStatus && newStatus !== lastStatusRef.current) {
          fetchUpdate(newDistance);
        } else if(newDistance <= 0 && lastStatusRef.current !== "Arrived"){
           // Final update when arrived
           const finalUpdate: GetEmergencyUpdatesOutput = {
            status: "Arrived",
            updateMessage: "You have arrived at the hospital. Medical staff are waiting.",
            eta: "0 minutes",
           };
           setUpdates(prev => [finalUpdate, ...prev.slice(0, 4)]);
           lastStatusRef.current = "Arrived";
        }
        
        return newDistance;
      });
    }, 10000); // 10-second interval

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const progressPercentage = Math.max(0, Math.min(100, ((INITIAL_DISTANCE_KM - currentDistance) / INITIAL_DISTANCE_KM) * 100));
  const latestUpdate = updates[0];

  return (
    <div className="w-full max-w-4xl p-4 md:p-8 space-y-6">
      <Card>
        <CardHeader>
           <div className="flex items-center justify-center gap-2 text-2xl text-destructive">
             <Ambulance className="h-8 w-8 animate-pulse" />
           </div>
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
          
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm font-medium">
                <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> Your Location</span>
                <span className="flex items-center gap-1"><Hospital className="h-4 w-4" /> Nearest Hospital</span>
            </div>
            <Progress value={progressPercentage} className="h-4" />
            <div className="flex justify-between items-center text-xs text-muted-foreground">
                <span>{currentDistance.toFixed(1)} km to destination</span>
                <span>ETA: {latestUpdate?.eta ?? 'Calculating...'}</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
          <CardHeader>
              <div className="flex items-center gap-2 font-semibold text-lg">
                <Timer />
                Live Updates
              </div>
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
