"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DoctorFlowchart from '@/components/doctor-flowchart';
import { Button } from '@/components/ui/button';
import { Siren } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';
import { Toaster } from "@/components/ui/toaster";

export default function Home() {
  const [isCalling, setIsCalling] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleEmergencyCall = () => {
    setIsCalling(true);
    toast({
      title: "Connecting to Emergency Services",
      description: "You are being connected to the nearest emergency service. Please stay on the line.",
      variant: "destructive",
    });
    
    // Simulate connecting to the call, then navigate
    setTimeout(() => {
      setIsCalling(false);
      router.push('/emergency/status');
    }, 2000); // 2 second delay to simulate connection
  };

  return (
    <>
      <div className="relative flex min-h-[calc(100vh-68px)] flex-col items-center justify-center bg-background">
        <DoctorFlowchart />
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="destructive"
              size="icon"
              className="fixed bottom-8 right-8 h-16 w-16 rounded-full shadow-lg animate-pulse"
              aria-label="Emergency"
            >
              <Siren className="h-8 w-8" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Emergency</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to call emergency services? This should only be used in a genuine emergency.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isCalling}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleEmergencyCall} disabled={isCalling}>
                {isCalling ? 'Connecting...' : 'Call Now'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <Toaster />
    </>
  );
}
