'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { getEmergencyUpdates, GetEmergencyUpdatesOutput } from '@/app/ai/flows/get-emergency-updates-flow';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Ambulance, Hospital, Timer, MapPin, AlertCircle, Loader2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const INITIAL_DISTANCE_KM = 15; // Starting distance
const AVG_SPEED_KM_PER_MIN = 0.8; // Average speed of an ambulance

export default function EmergencyStatus() {
  const [updates, setUpdates] = useState<GetEmergencyUpdatesOutput[]>([]);
  const [isFetchingUpdate, setIsFetchingUpdate] = useState(true);
  const [currentDistance, setCurrentDistance] = useState<number>(INITIAL_DISTANCE_KM);

  useEffect(() => {
    const fetchUpdate = async (distance: number) => {
      setIsFetchingUpdate(true);
      try {
        const time = distance / AVG_SPEED_KM_PER_MIN;
        const newUpdate = await getEmergencyUpdates({ distance, time });
        setUpdates(prev => [newUpdate, ...prev.slice(0, 4)]);
      } catch (e) {
        console.error("Failed to get emergency update:", e);
      } finally {
        setIsFetchingUpdate(false);
      }
    };

    fetchUpdate(currentDistance);

    const intervalId = setInterval(() => {
      setCurrentDistance(prevDistance => {
        const newDistance = Math.max(0, prevDistance - (AVG_SPEED_KM_PER_MIN * (10 / 60)));
        if (newDistance <= 0) {
          clearInterval(intervalId);
        }
        fetchUpdate(newDistance);
        return newDistance;
      });
    }, 10000);

    return () => clearInterval(intervalId);
  }, []);

  const progressPercentage = Math.max(0, Math.min(100, ((INITIAL_DISTANCE_KM - currentDistance) / INITIAL_DISTANCE_KM) * 100));

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
