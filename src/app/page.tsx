"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DoctorFlowchart from '@/components/doctor-flowchart';
import { Button } from '@/components/ui/button';
import { Phone, Siren } from 'lucide-react';
import {
  AlertDialog,
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

const WhatsAppIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.894 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
    </svg>
);


export default function Home() {
  const [isCalling, setIsCalling] = useState(false);
  const [emergencyContact, setEmergencyContact] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    // Ensure this runs only on the client
    const profileData = localStorage.getItem('userProfile');
    if (profileData) {
      const profile = JSON.parse(profileData);
      setEmergencyContact(profile.emergencyContact);
    }
  }, []);

  const handleCall = (type: 'tel' | 'whatsapp') => {
    setIsCalling(true);

    if (!emergencyContact) {
      toast({
        title: "Emergency Contact Not Set",
        description: "Please set an emergency contact in your profile first.",
        variant: "destructive",
      });
      setIsCalling(false);
      return;
    }

    let url = '';
    if (type === 'tel') {
        url = `tel:${emergencyContact}`;
    } else {
        // Basic cleanup for WhatsApp: remove spaces, parentheses, and hyphens. 
        // Assumes number is stored with country code.
        const whatsappNumber = emergencyContact.replace(/[\s()-]/g, '');
        url = `https://wa.me/${whatsappNumber}`;
    }
    
    window.location.href = url;

    toast({
      title: "Connecting to Emergency Contact",
      description: "Please complete the call on your device.",
      variant: "destructive",
    });
    
    // Simulate connecting to the call, then navigate
    setTimeout(() => {
      setIsCalling(false);
      router.push('/emergency/status');
    }, 3000); // 3 second delay to allow call initiation
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
                How would you like to contact your emergency number? 
                <br/>
                {emergencyContact ? <strong>{emergencyContact}</strong> : <span>(Please set a contact in your profile)</span>}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="sm:justify-center gap-4">
                <Button onClick={() => handleCall('tel')} disabled={isCalling || !emergencyContact} className="w-full sm:w-auto">
                    <Phone className="mr-2"/> Normal Call
                </Button>
                <Button onClick={() => handleCall('whatsapp')} disabled={isCalling || !emergencyContact} className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white">
                    <WhatsAppIcon /> WhatsApp Call
                </Button>
            </AlertDialogFooter>
            <AlertDialogCancel disabled={isCalling} className="w-full mt-2">Cancel</AlertDialogCancel>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <Toaster />
    </>
  );
}
