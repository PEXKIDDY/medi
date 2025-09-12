"use client";
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Stethoscope, Heart, Brain, Bone, Baby, Hand, LocateFixed, WifiOff, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useGeolocation } from '@/hooks/use-geolocation';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import imageData from '@/lib/placeholder-images.json';

const doctorAvatars = imageData['doctor-avatars'] as Record<string, { seed: string, width: number, height: number }>;

// Helper function to calculate distance (Haversine formula)
const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
};

const initialSpecializations = [
  {
    name: 'Cardiology',
    icon: <Heart className="h-8 w-8 text-red-500" />,
    doctors: [
      { name: 'Dr. Priya Sharma', degree: 'MD, Cardiology', avatar: 'PS', clinic: 'Apollo Hospitals', lat: 12.9716, lon: 77.5946 }, // Bangalore
      { name: 'Dr. Rohan Mehra', degree: 'DM, Cardiology', avatar: 'RM', clinic: 'Fortis Malar', lat: 13.0827, lon: 80.2707 }, // Chennai
      { name: 'Dr. Ananya Reddy', degree: 'MD, DNB', avatar: 'AR', clinic: 'Care Hospitals', lat: 17.3850, lon: 78.4867 }, // Hyderabad
    ],
  },
  {
    name: 'Neurology',
    icon: <Brain className="h-8 w-8 text-purple-500" />,
    doctors: [
      { name: 'Dr. Vikram Singh', degree: 'DM, Neurology', avatar: 'VS', clinic: 'Manipal Hospital', lat: 12.9716, lon: 77.5946 }, // Bangalore
      { name: 'Dr. Sneha Patel', degree: 'MD, Neurology', avatar: 'SP', clinic: 'Global Hospitals', lat: 13.0827, lon: 80.2707 }, // Chennai
      { name: 'Dr. Arjun Kumar', degree: 'MBBS, DNB', avatar: 'AK', clinic: 'Yashoda Hospitals', lat: 17.3850, lon: 78.4867 }, // Hyderabad
    ],
  },
  {
    name: 'Orthopedics',
    icon: <Bone className="h-8 w-8 text-gray-500" />,
    doctors: [
      { name: 'Dr. Divya Rao', degree: 'MS, Ortho', avatar: 'DR', clinic: 'Sakra World Hospital', lat: 12.9716, lon: 77.5946 }, // Bangalore
      { name: 'Dr. Karthik Rajan', degree: 'MS, DNB', avatar: 'KR', clinic: 'MIOT International', lat: 13.0827, lon: 80.2707 }, // Chennai
      { name: 'Dr. Pooja Desai', degree: 'MS, Ortho', avatar: 'PD', clinic: 'Sunshine Hospitals', lat: 17.3850, lon: 78.4867 }, // Hyderabad
    ],
  },
  {
    name: 'Dermatology',
    icon: <Hand className="h-8 w-8 text-pink-500" />,
    doctors: [
        { name: 'Dr. Aisha Khan', degree: 'MD, Dermatology', avatar: 'AK', clinic: 'Cutis Clinic', lat: 12.9716, lon: 77.5946 }, // Bangalore
        { name: 'Dr. Mohan Kumar', degree: 'MBBS, DDVL', avatar: 'MK', clinic: 'Kaya Skin Clinic', lat: 13.0827, lon: 80.2707 }, // Chennai
        { name: 'Dr. Sunita Reddy', degree: 'MD, DVL', avatar: 'SR', clinic: 'Olivia Skin & Hair', lat: 17.3850, lon: 78.4867 }, // Hyderabad
    ],
  },
  {
    name: 'Pediatrics',
    icon: <Baby className="h-8 w-8 text-blue-500" />,
    doctors: [
        { name: 'Dr. Rajesh Nair', degree: 'MD, Pediatrics', avatar: 'RN', clinic: 'Rainbow Children\'s Hospital', lat: 12.9716, lon: 77.5946 }, // Bangalore
        { name: 'Dr. Meena Iyer', degree: 'DNB, Pediatrics', avatar: 'MI', clinic: 'Kanchi Kamakoti Childs Trust', lat: 13.0827, lon: 80.2707 }, // Chennai
        { name: 'Dr. Sameer Ahmed', degree: 'MD, Pediatrics', avatar: 'SA', clinic: 'Lotus Children\'s Hospital', lat: 17.3850, lon: 78.4867 }, // Hyderabad
    ],
  },
  {
    name: 'Dentistry',
    icon: (
      <svg
        className="h-8 w-8 text-cyan-500"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M19.34 8.62a2.1 2.1 0 0 0-2.22-2.22l-1.42.36a2.1 2.1 0 0 1-2.22-2.22V3a2 2 0 0 0-2-2h-1a2 2 0 0 0-2 2v1.76a2.1 2.1 0 0 1-2.22 2.22l-1.42-.36a2.1 2.1 0 0 0-2.22 2.22v1.16c0 .9.51 1.72 1.3 2.06l1.42.63a1.46 1.46 0 0 1 1.13 1.83l-.36 1.42a2.1 2.1 0 0 0 2.22 2.22h1.16c.9 0 1.72-.51 2.06-1.3l.63-1.42a1.46 1.46 0 0 1 1.83-1.13l1.42.36c.9.22 1.78-.34 2.06-1.21l.36-1.16c.22-.9-.34-1.78-1.21-2.06zM21 12.5" />
      </svg>
    ),
    doctors: [
        { name: 'Dr. Fatima Ali', degree: 'BDS, MDS', avatar: 'FA', clinic: 'Apollo White Dental', lat: 12.9716, lon: 77.5946 }, // Bangalore
        { name: 'Dr. Anand Kumar', degree: 'BDS', avatar: 'AK', clinic: 'Axiss Dental', lat: 13.0827, lon: 80.2707 }, // Chennai
        { name: 'Dr. Lakshmi Rao', degree: 'BDS, MDS', avatar: 'LR', clinic: 'FMS Dental', lat: 17.3850, lon: 78.4867 }, // Hyderabad
    ],
  },
];

export default function DoctorFlowchart() {
  const [nearbyEnabled, setNearbyEnabled] = useState(false);
  const { location, error, getLocation, clearError } = useGeolocation();
  const [specializations, setSpecializations] = useState(initialSpecializations);

  const handleToggle = (checked: boolean) => {
    setNearbyEnabled(checked);
    clearError();
    if (checked) {
      getLocation();
    }
  };
  
  useEffect(() => {
    if (error) {
      setNearbyEnabled(false);
    }
  }, [error]);

  useEffect(() => {
    if (nearbyEnabled && location) {
      const specializationsWithDistances = initialSpecializations.map(spec => {
        const doctorsWithDistance = spec.doctors.map(doc => ({
          ...doc,
          distance: getDistance(location.latitude, location.longitude, doc.lat, doc.lon),
        }));

        const sortedDoctors = doctorsWithDistance.sort((a, b) => a.distance - b.distance);
        
        return {
          ...spec,
          doctors: sortedDoctors.slice(0, 3),
          // Store the distance of the nearest doctor for sorting specializations
          nearestDoctorDistance: sortedDoctors.length > 0 ? sortedDoctors[0].distance : Infinity,
        };
      });

      // Sort specializations by the nearest doctor
      const sortedSpecializations = specializationsWithDistances.sort((a, b) => a.nearestDoctorDistance - b.nearestDoctorDistance);
      
      setSpecializations(sortedSpecializations);
    } else {
      // Reset to initial state, ensuring we only show 3 doctors per specialization
      setSpecializations(initialSpecializations.map(spec => ({
          ...spec,
          doctors: spec.doctors.slice(0, 3),
      })));
    }
  }, [nearbyEnabled, location]);
  
  // Initially show top 3 doctors per specialization
  useEffect(() => {
    setSpecializations(initialSpecializations.map(spec => ({...spec, doctors: spec.doctors.slice(0, 3) })));
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-8">
      <div className="flex justify-between items-start mb-6">
        <div className="text-center flex-grow">
          <div className="inline-block bg-primary text-primary-foreground rounded-full p-4 mb-4">
            <Stethoscope className="h-12 w-12" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight">Our Medical Specialists</h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Find the right expert for your healthcare needs from our team of dedicated professionals.
          </p>
        </div>
        <div className="flex items-center space-x-2 pt-4">
          <Switch id="nearby-mode" onCheckedChange={handleToggle} checked={nearbyEnabled} />
          <Label htmlFor="nearby-mode" className="flex flex-col items-center">
            {nearbyEnabled ? <LocateFixed className="text-primary"/> : <WifiOff/>}
            <span className="text-xs">Nearby</span>
          </Label>
        </div>
      </div>
       {error && (
         <Alert variant="destructive" className="mb-8">
           <AlertCircle className="h-4 w-4" />
           <AlertTitle>Location Error</AlertTitle>
           <AlertDescription>{error}</AlertDescription>
         </Alert>
       )}


      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {specializations.map((spec) => (
          <Card key={spec.name} className="flex flex-col">
            <CardHeader className="flex flex-row items-center gap-4 pb-4">
              <div className="bg-muted p-3 rounded-full">
                {spec.icon}
              </div>
              <CardTitle className="text-2xl">{spec.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="space-y-4">
                {spec.doctors.map((doc) => {
                  const avatarData = doctorAvatars[doc.name];
                  const avatarSrc = avatarData ? `https://picsum.photos/seed/${avatarData.seed}/${avatarData.width}/${avatarData.height}` : `https://i.pravatar.cc/150?u=${doc.avatar}`;
                  return (
                    <div key={doc.name} className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <Image
                          src={avatarSrc}
                          alt={`Portrait of ${doc.name}`}
                          width={60}
                          height={60}
                          className="rounded-full"
                          data-ai-hint="doctor portrait"
                        />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {doc.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-grow">
                        <p className="font-semibold text-lg">{doc.name}</p>
                        <p className="text-sm text-muted-foreground">{doc.degree}</p>
                        <p className="text-sm text-muted-foreground">{doc.clinic}</p>
                        {nearbyEnabled && location && (doc as any).distance !== undefined && (
                          <p className="text-xs text-blue-500">
                            ~{Math.round((doc as any).distance)} km away
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
                 {spec.doctors.length === 0 && (
                  <p className="text-muted-foreground">No doctors found for this specialization.</p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
