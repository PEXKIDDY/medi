"use client";
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Stethoscope, Heart, Brain, Bone, Baby, LocateFixed, WifiOff, AlertCircle, MapPin, Scan, Scissors, Eye, HelpingHand, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useGeolocation } from '@/hooks/use-geolocation';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import imageData from '@/lib/placeholder-images.json';
import { Input } from './ui/input';
import { Button } from './ui/button';

const doctorAvatars = imageData['doctor-avatars'] as Record<string, { seed: string, width: number, height: number }>;

const GynecologyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-pink-500">
        <circle cx="12" cy="12" r="4"></circle>
        <line x1="12" y1="16" x2="12" y2="22"></line>
        <line x1="9" y1="19" x2="15" y2="19"></line>
    </svg>
);

const DermatologyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z"></path>
        <path d="M20.59 22c-3.95-3.95-12.28-3.95-16.23 0"></path>
        <path d="M16 16c0-2.21-1.79-4-4-4s-4 1.79-4 4"></path>
    </svg>
);


const specializationIcons: { [key: string]: React.ReactNode } = {
  Cardiology: <Heart className="h-8 w-8 text-red-500" />,
  Neurology: <Brain className="h-8 w-8 text-purple-500" />,
  Orthopedics: <Bone className="h-8 w-8 text-gray-500" />,
  Pediatrics: <Baby className="h-8 w-8 text-blue-500" />,
  Gynecology: <GynecologyIcon />,
  Radiology: <Scan className="h-8 w-8 text-indigo-500" />,
  "General Surgery": <Scissors className="h-8 w-8 text-orange-500" />,
  Ophthalmology: <Eye className="h-8 w-8 text-teal-500" />,
  Dermatology: <DermatologyIcon />,
};

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
    doctors: [
      { name: 'Dr. Priya Sharma', degree: 'MD, Cardiology', avatar: 'PS', clinic: 'Apollo Hospitals', lat: 12.9716, lon: 77.5946, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Apollo+Hospitals+Bangalore' }, 
      { name: 'Dr. Rohan Mehra', degree: 'DM, Cardiology', avatar: 'RM', clinic: 'Fortis Malar', lat: 13.0827, lon: 80.2707, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Fortis+Malar+Hospital+Chennai' },
      { name: 'Dr. Srinivas Kumar', degree: 'MD, DM (Cardio)', avatar: 'SK', clinic: 'SVIMS, Tirupati', lat: 13.6288, lon: 79.4192, locationUrl: 'https://www.google.com/maps/search/?api=1&query=SVIMS+Tirupati' },
    ],
  },
  {
    name: 'Neurology',
    doctors: [
      { name: 'Dr. Vikram Singh', degree: 'DM, Neurology', avatar: 'VS', clinic: 'Manipal Hospital', lat: 12.9716, lon: 77.5946, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Manipal+Hospital+Old+Airport+Road+Bangalore' }, 
      { name: 'Dr. Sneha Patel', degree: 'MD, Neurology', avatar: 'SP', clinic: 'Global Hospitals', lat: 13.0827, lon: 80.2707, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Global+Hospital+Perumbakkam+Chennai' },
      { name: 'Dr. Ravi Varma', degree: 'MD, DM (Neuro)', avatar: 'RV', clinic: 'Apollo Hospitals, Tirupati', lat: 13.6288, lon: 79.4192, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Apollo+Hospitals+Tirupati' },
    ],
  },
  {
    name: 'Orthopedics',
    doctors: [
      { name: 'Dr. Divya Rao', degree: 'MS, Ortho', avatar: 'DR', clinic: 'Sakra World Hospital', lat: 12.9716, lon: 77.5946, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Sakra+World+Hospital+Bangalore' }, 
      { name: 'Dr. G. Jagadesh', degree: 'MS (Ortho)', avatar: 'GJ', clinic: 'BIRRD Hospital, Tirupati', lat: 13.6288, lon: 79.4192, locationUrl: 'https://www.google.com/maps/search/?api=1&query=BIRRD+Hospital+Tirupati' },
      { name: 'Dr. Pooja Desai', degree: 'MS, Ortho', avatar: 'PD', clinic: 'Sunshine Hospitals', lat: 17.3850, lon: 78.4867, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Sunshine+Hospitals+Secunderabad+Hyderabad' },
    ],
  },
   {
    name: 'Pediatrics',
    doctors: [
        { name: 'Dr. Rajesh Nair', degree: 'MD, Pediatrics', avatar: 'RN', clinic: 'Rainbow Children\'s Hospital', lat: 12.9716, lon: 77.5946, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Rainbow+Childrens+Hospital+Bangalore' },
        { name: 'Dr. Meena Iyer', degree: 'DNB, Pediatrics', avatar: 'MI', clinic: 'Kanchi Kamakoti Childs Trust', lat: 13.0827, lon: 80.2707, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Kanchi+Kamakoti+Childs+Trust+Hospital+Chennai' },
        { name: 'Dr. Sita Ram', degree: 'MD (Peds)', avatar: 'SR', clinic: 'Amara Hospital, Tirupati', lat: 13.6288, lon: 79.4192, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Amara+Hospital+Tirupati' },
    ],
  },
  {
    name: 'Gynecology',
    doctors: [
        { name: 'Dr. Lakshmi S', degree: 'MS (OBG)', avatar: 'LS', clinic: 'Lotus Hospital, Tirupati', lat: 13.6359, lon: 79.4243, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Lotus+Hospital+Tirupati' },
        { name: 'Dr. Kavitha G', degree: 'DGO, DNB', avatar: 'KG', clinic: 'Apollo Cradle, Bangalore', lat: 12.9080, lon: 77.6444, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Apollo+Cradle+Brookefield+Bangalore' },
        { name: 'Dr. Parvathy S', degree: 'MD, DGO', avatar: 'PS2', clinic: 'SIMS Hospital, Chennai', lat: 13.0069, lon: 80.2205, locationUrl: 'https://www.google.com/maps/search/?api=1&query=SIMS+Hospital+Chennai' },
    ],
  },
  {
    name: 'Radiology',
    doctors: [
        { name: 'Dr. Anand M', degree: 'MD, Radiology', avatar: 'AM', clinic: 'SVIMS, Tirupati', lat: 13.6288, lon: 79.4192, locationUrl: 'https://www.google.com/maps/search/?api=1&query=SVIMS+Tirupati' },
        { name: 'Dr. Suresh Kumar', degree: 'DMRD', avatar: 'SK2', clinic: 'Vijaya Diagnostic Centre, Hyderabad', lat: 17.412, lon: 78.435, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Vijaya+Diagnostic+Centre+Hyderabad' },
        { name: 'Dr. Deepa S', degree: 'MD, Radiology', avatar: 'DS', clinic: 'Manipal Hospital, Bangalore', lat: 12.9716, lon: 77.5946, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Manipal+Hospital+Old+Airport+Road+Bangalore' },
    ],
  },
  {
    name: 'General Surgery',
    doctors: [
        { name: 'Dr. Bhaskar Rao', degree: 'MS, Gen Surgery', avatar: 'BR', clinic: 'Yashoda Hospitals, Hyderabad', lat: 17.4065, lon: 78.4772, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Yashoda+Hospitals+Somajiguda' },
        { name: 'Dr. Chenna Reddy', degree: 'MS, DNB', avatar: 'CR', clinic: 'Helios Hospital, Tirupati', lat: 13.627, lon: 79.420, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Helios+Hospital+Tirupati' },
        { name: 'Dr. Murali N', degree: 'MS, FRCS', avatar: 'MN', clinic: 'MIOT International, Chennai', lat: 13.0185, lon: 80.1983, locationUrl: 'https://www.google.com/maps/search/?api=1&query=MIOT+International+Chennai' },
    ],
  },
  {
    name: 'Ophthalmology',
    doctors: [
        { name: 'Dr. Ravi Kumar', degree: 'MS, Ophthalmology', avatar: 'RK', clinic: 'L V Prasad Eye Institute, Hyderabad', lat: 17.4241, lon: 78.4526, locationUrl: 'https://www.google.com/maps/search/?api=1&query=L+V+Prasad+Eye+Institute+Hyderabad' },
        { name: 'Dr. Agarwal', degree: 'MS, FICO', avatar: 'AG', clinic: 'Dr. Agarwals Eye Hospital, Tirupati', lat: 13.633, lon: 79.418, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Dr+Agarwals+Eye+Hospital+Tirupati' },
        { name: 'Dr. Priya S', degree: 'DO, DNB', avatar: 'PS3', clinic: 'Narayana Nethralaya, Bangalore', lat: 12.9351, lon: 77.6245, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Narayana+Nethralaya+Koramangala' },
    ],
  },
  {
    name: 'Dermatology',
    doctors: [
        { name: 'Dr. Neha Sharma', degree: 'MD, Dermatology', avatar: 'NS', clinic: 'Kaya Skin Clinic, Bangalore', lat: 12.9279, lon: 77.6271, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Kaya+Skin+Clinic+Koramangala' },
        { name: 'Dr. Sudhakar Reddy', degree: 'MD, DVL', avatar: 'SRe', clinic: 'Apollo Skin Clinic, Tirupati', lat: 13.6295, lon: 79.418, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Apollo+Clinic+Tirupati' },
        { name: 'Dr. Swetha', degree: 'MBBS, DDVL', avatar: 'SW', clinic: ' Oliva Skin & Hair Clinic, Hyderabad', lat: 17.4435, lon: 78.3804, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Oliva+Skin+%26+Hair+Clinic+Hyderabad' },
    ],
  },
];


export default function DoctorFlowchart() {
  const [nearbyEnabled, setNearbyEnabled] = useState(false);
  const { location, error, loading: loadingLocation, getLocation, clearError } = useGeolocation();
  const [manualLocation, setManualLocation] = useState<{latitude: number; longitude: number; city: string} | null>(null);
  const [specializations, setSpecializations] = useState(initialSpecializations);
  const [cityName, setCityName] = useState<string | null>(null);
  const [loadingCity, setLoadingCity] = useState(false);
  const [manualCityInput, setManualCityInput] = useState('');
  const [searchError, setSearchError] = useState<string | null>(null);

  const handleToggle = (checked: boolean) => {
    setNearbyEnabled(checked);
    clearError();
    setCityName(null);
    setManualLocation(null);
    setSearchError(null);
    if (checked) {
      getLocation();
    } else {
      // If toggled off, reset to the initial full list
      let newSpecs = JSON.parse(JSON.stringify(initialSpecializations));
      newSpecs.forEach((spec: any) => {
        spec.doctors = spec.doctors.slice(0, 3);
      });
      setSpecializations(newSpecs);
    }
  };

  const handleManualSearch = () => {
    if (!manualCityInput.trim()) {
      setSearchError("Please enter a city name.");
      return;
    }
    setLoadingCity(true);
    setSearchError(null);
    setNearbyEnabled(false);
    clearError();

    fetch(`https://geocode.maps.co/search?q=${encodeURIComponent(manualCityInput)}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          const result = data[0];
          setManualLocation({ latitude: parseFloat(result.lat), longitude: parseFloat(result.lon), city: result.display_name.split(',')[0] });
          setCityName(result.display_name.split(',')[0]);
        } else {
          setSearchError(`Could not find location for "${manualCityInput}". Please try another city.`);
          setManualLocation(null);
          setCityName(null);
        }
        setLoadingCity(false);
      }).catch(() => {
        setSearchError("Failed to fetch location. Please check your connection.");
        setLoadingCity(false);
      });
  };
  
  useEffect(() => {
    if (error) {
      setNearbyEnabled(false);
      setCityName(null);
    }
  }, [error]);

  useEffect(() => {
    let newSpecs = JSON.parse(JSON.stringify(initialSpecializations));
    
    const activeLocation = nearbyEnabled ? location : manualLocation;
    
    // Automatically get city name if using geolocation
    if (nearbyEnabled && location && !manualLocation) {
        setLoadingCity(true);
        fetch(`https://geocode.maps.co/reverse?lat=${location.latitude}&lon=${location.longitude}`)
            .then(res => res.json())
            .then(data => {
                const city = data.address?.city || data.address?.town || data.address?.village;
                if (city) {
                    setCityName(city);
                } else {
                    setCityName("Unknown location");
                }
                setLoadingCity(false);
            }).catch(() => {
                setCityName("Could not fetch city");
                setLoadingCity(false);
            });
    } else if (manualLocation) {
        setCityName(manualLocation.city);
    } else if (!nearbyEnabled) {
        setCityName(null);
    }

    if (activeLocation) {
        const specsWithDistance = newSpecs.map((spec: any) => {
            const doctorsWithDistance = spec.doctors.map((doc: any) => ({
                ...doc,
                distance: getDistance(activeLocation.latitude, activeLocation.longitude, doc.lat, doc.lon),
            }));

            if (cityName?.toLowerCase() === 'tirupati') {
                spec.doctors = doctorsWithDistance.filter((doc: any) => doc.clinic.toLowerCase().includes('tirupati'));
            } else {
                spec.doctors = doctorsWithDistance.sort((a: any, b: any) => a.distance - b.distance).slice(0, 3);
            }
            return spec;
        });

        specsWithDistance.sort((a: any, b: any) => {
            const nearestADoctor = a.doctors.length > 0 ? a.doctors[0].distance : Infinity;
            const nearestBDoctor = b.doctors.length > 0 ? b.doctors[0].distance : Infinity;
            return nearestADoctor - nearestBDoctor;
        });

        newSpecs = specsWithDistance;
    } else {
      // Default state: not nearby and no manual search
      newSpecs.forEach((spec: any) => {
          spec.doctors = spec.doctors.slice(0, 3);
      });
    }

    setSpecializations(newSpecs);

  }, [nearbyEnabled, location, manualLocation, cityName]);

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
        <div className="flex flex-col items-center pt-4 space-y-4 w-64">
             <div className="flex items-center space-x-2">
                <Switch id="nearby-mode" onCheckedChange={handleToggle} checked={nearbyEnabled} />
                <Label htmlFor="nearby-mode" className="flex flex-col items-center cursor-pointer">
                    {nearbyEnabled ? <LocateFixed className="text-primary"/> : <WifiOff/>}
                    <span className="text-xs">Nearby</span>
                </Label>
            </div>
            <div className="w-full space-y-2">
                <div className="flex w-full max-w-sm items-center space-x-2">
                    <Input 
                        type="text" 
                        placeholder="Enter a city"
                        value={manualCityInput}
                        onChange={(e) => setManualCityInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleManualSearch()}
                        disabled={nearbyEnabled}
                    />
                    <Button type="button" onClick={handleManualSearch} disabled={nearbyEnabled}>
                        <Search className="h-4 w-4"/>
                    </Button>
                </div>
            </div>
             {(nearbyEnabled || manualLocation) && (
                <div className="text-xs text-muted-foreground flex items-center gap-1 h-4">
                    {loadingLocation || loadingCity ? (
                        <>
                            <MapPin className="h-3 w-3 animate-pulse" />
                            <span>Finding doctors...</span>
                        </>
                    ) : cityName ? (
                        <>
                            <MapPin className="h-3 w-3 text-primary" />
                            <span>Showing doctors for {cityName}</span>
                        </>
                    ) : null}
                </div>
            )}
        </div>
      </div>
       {(error || searchError) && (
         <Alert variant="destructive" className="mb-8">
           <AlertCircle className="h-4 w-4" />
           <AlertTitle>Location Error</AlertTitle>
           <AlertDescription>{error || searchError}</AlertDescription>
         </Alert>
       )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {specializations.map((spec) => (
          <Card key={spec.name} className="flex flex-col">
            <CardHeader className="flex flex-row items-center gap-4 pb-4">
              <div className="bg-muted p-3 rounded-full">
                {specializationIcons[spec.name]}
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
                        <Link href={doc.locationUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                          {doc.clinic}
                        </Link>
                        {(nearbyEnabled || manualLocation) && (doc as any).distance !== undefined && (
                          <p className="text-xs text-blue-500">
                            ~{Math.round((doc as any).distance)} km away
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
                 {spec.doctors.length === 0 && (
                  <p className="text-muted-foreground">No doctors found for this specialization in the selected location.</p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
