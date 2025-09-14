"use client";
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Stethoscope, Heart, Brain, Bone, Baby, LocateFixed, WifiOff, AlertCircle, MapPin, Scan, Scissors, Eye, Search } from 'lucide-react';
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
      { name: 'Dr. Priya Sharma', degree: 'MD, Cardiology', avatar: 'PS', clinic: 'Apollo Hospitals, Bangalore', lat: 12.9716, lon: 77.5946, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Apollo+Hospitals+Bangalore' }, 
      { name: 'Dr. Rohan Mehra', degree: 'DM, Cardiology', avatar: 'RM', clinic: 'Fortis Malar, Chennai', lat: 13.0827, lon: 80.2707, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Fortis+Malar+Hospital+Chennai' },
      { name: 'Dr. Srinivas Kumar', degree: 'MD, DM (Cardio)', avatar: 'SK', clinic: 'SVIMS, Tirupati', lat: 13.6288, lon: 79.4192, locationUrl: 'https://www.google.com/maps/search/?api=1&query=SVIMS+Tirupati' },
      { name: 'Dr. Ashok Reddy', degree: 'DM, Cardiology', avatar: 'AR', clinic: 'Apollo Hospitals, Nellore', lat: 14.4426, lon: 79.9865, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Apollo+Hospitals+Nellore' },
      { name: 'Dr. Ramesh Babu', degree: 'DM (Cardio)', avatar: 'RB', clinic: 'Ramesh Hospitals, Vijayawada', lat: 16.5062, lon: 80.6480, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Ramesh+Hospitals+Vijayawada' },
      { name: 'Dr. N. K. S. Raju', degree: 'MD, DM', avatar: 'NKR', clinic: 'Care Hospitals, Visakhapatnam', lat: 17.7297, lon: 83.3102, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Care+Hospitals+Ram+Nagar+Visakhapatnam' },
      { name: 'Dr. Sridhar Kasturi', degree: 'DM (Cardio)', avatar: 'SKa', clinic: 'Sunshine Hospitals, Guntur', lat: 16.3006, lon: 80.4365, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Sunshine+Hospitals+Guntur' },
      { name: 'Dr. Madhav Rao', degree: 'DM (Cardio)', avatar: 'MRa', clinic: 'KIMS Hospital, Ananthapur', lat: 14.6819, lon: 77.6006, locationUrl: 'https://www.google.com/maps/search/?api=1&query=KIMS+Hospital+Anantapur' },
      { name: 'Dr. Gopal Krishna', degree: 'MD, DM', avatar: 'GK', clinic: 'Goutami Hospital, Rajahmundry', lat: 17.0005, lon: 81.8040, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Goutami+Hospital+Rajahmundry' },
      { name: 'Dr. Damodhar Reddy', degree: 'DM (Cardio)', avatar: 'DRe', clinic: 'Govt. General Hospital, Kadapa', lat: 14.4668, lon: 78.8222, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Government+General+Hospital+Kadapa' },
      { name: 'Dr. Sandeep Attawar', degree: 'MS, MCh', avatar: 'SA', clinic: 'KIMS Hospital, Hyderabad', lat: 17.424, lon: 78.448, locationUrl: 'https://www.google.com/maps/search/?api=1&query=KIMS+Hospital+Secunderabad' },
      { name: 'Dr. Sharath Reddy', degree: 'MD, DM (Cardio)', avatar: 'ShR', clinic: 'Medicover Hospitals, Hyderabad', lat: 17.448, lon: 78.391, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Medicover+Hospitals+Hitec+City' },
      { name: 'Dr. Sarat Chandra', degree: 'MD, DM, FACC', avatar: 'SC', clinic: 'Virinchi Hospitals, Hyderabad', lat: 17.400, lon: 78.448, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Virinchi+Hospitals+Banjara+Hills' },
      { name: 'Dr. G. S. Rao', degree: 'MD, DM', avatar: 'GSR', clinic: 'Lalitha Hospital, Guntur', lat: 16.309, lon: 80.435, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Lalitha+Super+Speciality+Hospital+Guntur' },
      { name: 'Dr. T. N. C. Padmanabhan', degree: 'MD, DM', avatar: 'TNCP', clinic: 'Govt. General Hospital, Guntur', lat: 16.306, lon: 80.43, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Government+General+Hospital+Guntur' },
      { name: 'Dr. Gopi Chand', degree: 'MD, DM', avatar: 'GC', clinic: 'Star Hospitals, Hyderabad', lat: 17.411, lon: 78.448, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Star+Hospitals+Banjara+Hills' },
      { name: 'Dr. S. M. Krishnan', degree: 'MD, DM', avatar: 'SMK', clinic: 'Billroth Hospitals, Chennai', lat: 13.06, lon: 80.25, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Billroth+Hospitals+Shenoy+Nagar' },
      { name: 'Dr. U. S. Vishal', degree: 'MD, DM', avatar: 'USV', clinic: 'Cauvery Hospital, Bangalore', lat: 12.92, lon: 77.62, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Cauvery+Hospital+HSR+Layout' },
      { name: 'Dr. K. N. Reddy', degree: 'MD, DM', avatar: 'KNR', clinic: 'KIMS Saveera, Ananthapur', lat: 14.67, lon: 77.6, locationUrl: 'https://www.google.com/maps/search/?api=1&query=KIMS+Saveera+Anantapur' },
      { name: 'Dr. Y. V. Chalam', degree: 'MD, DM', avatar: 'YVC', clinic: 'Sri Krishna Hospital, Rajahmundry', lat: 16.98, lon: 81.78, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Sri+Krishna+Multispeciality+Hospital+Rajahmundry' },
      { name: 'Dr. P. S. Rao', degree: 'MD, DM', avatar: 'PSR', clinic: 'Apollo Hospitals, Visakhapatnam', lat: 17.738, lon: 83.318, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Apollo+Hospitals+Health+City+Visakhapatnam' },
      { name: 'Dr. K. Ashok Kumar', degree: 'DM (Cardio)', avatar: 'KAK', clinic: 'Sri Venkateswara Heart Centre, Tirupati', lat: 13.6288, lon: 79.4192, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Sri+Venkateswara+Heart+Centre+Tirupati' },
      { name: 'Dr. B. C. Rao', degree: 'MD, DM', avatar: 'BCR', clinic: 'Pinnacle Hospital, Vijayawada', lat: 16.5134, lon: 80.6320, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Pinnacle+Hospitals+Vijayawada' },
      { name: 'Dr. V. Surya Prakasa Rao', degree: 'MD, DM', avatar: 'VSPR', clinic: 'King George Hospital, Visakhapatnam', lat: 17.7126, lon: 83.2984, locationUrl: 'https://www.google.com/maps/search/?api=1&query=King+George+Hospital+Visakhapatnam' },
      { name: 'Dr. A. Sarath Kumar', degree: 'DM (Cardio)', avatar: 'ASK', clinic: 'SGS Hospitals, Nellore', lat: 14.4426, lon: 79.9865, locationUrl: 'https://www.google.com/maps/search/?api=1&query=SGS+Hospitals+Nellore' },
      { name: 'Dr. Praveen Kumar', degree: 'MD, DNB (Cardio)', avatar: 'PKPra', clinic: 'Prashanth Hospital, Bhimavaram', lat: 16.5449, lon: 81.5212, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Prashanth+Hospital+Bhimavaram' },
      { name: 'Dr. S. K. Naidu', degree: 'MD, DM (Cardio)', avatar: 'SKN', clinic: 'Coastal Heart Care, Bhimavaram', lat: 16.5449, lon: 81.5212, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Coastal+Heart+Care+Bhimavaram' },
      { name: 'Dr. B. V. R. Murthy', degree: 'MD, DNB (Cardio)', avatar: 'BVRM', clinic: 'Sanjivi Hospital, Bhimavaram', lat: 16.5449, lon: 81.5212, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Sanjivi+Hospital+Bhimavaram' },
      { name: 'Dr. R. R. Ravi', degree: 'MD, DM (Cardio)', avatar: 'RRR', clinic: 'St. Ann\'s Hospital, Chittoor', lat: 13.2173, lon: 79.1005, locationUrl: 'https://www.google.com/maps/search/?api=1&query=St.+Ann\'s+Hospital+Chittoor' },
      { name: 'Dr. Murali Krishna', degree: 'MD, DM', avatar: 'MK', clinic: 'Prathima Hospital, Karimnagar', lat: 18.4386, lon: 79.1288, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Prathima+Hospital+Karimnagar' },
      { name: 'Dr. V. Sudhakar', degree: 'MD, DM', avatar: 'VSu', clinic: 'Sudha Heart Center, Kadapa', lat: 14.4668, lon: 78.8222, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Sudha+Heart+Center+Kadapa' },
      { name: 'Dr. A. B. Gopalam', degree: 'MD, DM', avatar: 'ABG', clinic: 'Apollo Hospitals, Chennai', lat: 13.047, lon: 80.24, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Apollo+Hospitals+Greams+Road+Chennai' },
      { name: 'Dr. Madan Mohan', degree: 'MD, DM', avatar: 'MMo', clinic: 'Venkataeswara Hospitals, Chittoor', lat: 13.2173, lon: 79.1005, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Venkataeswara+Hospitals+Chittoor' },
      { name: 'Dr. V. Rajasekhar', degree: 'MD, DM', avatar: 'VRaj', clinic: 'Apollo Hospitals, Chittoor', lat: 13.2173, lon: 79.1005, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Apollo+Hospitals+Chittoor' },
      { name: 'Dr. Harikrishna', degree: 'MD, DM (Cardio)', avatar: 'HK', clinic: 'Harikrishna Heart Institute, Rajahmundry', lat: 16.99, lon: 81.79, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Harikrishna+Heart+Institute+Rajahmundry' },
      { name: 'Dr. G. Sudhakar', degree: 'MD, DM', avatar: 'GSu', clinic: 'Sims Hospital, Nellore', lat: 14.43, lon: 79.98, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Sims+Hospital+Nellore' },
      { name: 'Dr. P. Ramesh', degree: 'DM (Cardio)', avatar: 'PR', clinic: 'FIMS Hospital, Kadapa', lat: 14.47, lon: 78.82, locationUrl: 'https://www.google.com/maps/search/?api=1&query=FIMS+Hospital+Kadapa' },
      { name: 'Dr. Ram Kumar', degree: 'MD, DM', avatar: 'RKumar', clinic: 'Ananthapur Medical College, Ananthapur', lat: 14.6819, lon: 77.6006, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Ananthapur+Medical+College' },
      { name: 'Dr. B. Vijay Kumar', degree: 'MD, DM', avatar: 'BVK', clinic: 'Apollo Hospitals, Tirupati', lat: 13.6288, lon: 79.4192, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Apollo+Hospitals+Tirupati' }
    ],
  },
  {
    name: 'Neurology',
    doctors: [
      { name: 'Dr. Vikram Singh', degree: 'DM, Neurology', avatar: 'VS', clinic: 'Manipal Hospital, Bangalore', lat: 12.9716, lon: 77.5946, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Manipal+Hospital+Old+Airport+Road+Bangalore' }, 
      { name: 'Dr. Sneha Patel', degree: 'MD, Neurology', avatar: 'SP', clinic: 'Global Hospitals, Chennai', lat: 13.0827, lon: 80.2707, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Global+Hospital+Perumbakkam+Chennai' },
      { name: 'Dr. Ravi Varma', degree: 'MD, DM (Neuro)', avatar: 'RV', clinic: 'Apollo Hospitals, Tirupati', lat: 13.6288, lon: 79.4192, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Apollo+Hospitals+Tirupati' },
      { name: 'Dr. Kishore Kumar', degree: 'DM (Neuro)', avatar: 'KK', clinic: 'Narayana Hospital, Nellore', lat: 14.4426, lon: 79.9865, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Narayana+Hospital+Nellore' },
      { name: 'Dr. M.V. Reddy', degree: 'DM (Neuro)', avatar: 'MVR', clinic: 'Andhra Hospitals, Vijayawada', lat: 16.518, lon: 80.622, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Andhra+Hospitals+Vijayawada' },
      { name: 'Dr. B. K. Rao', degree: 'MD, DM', avatar: 'BKR', clinic: 'Apollo Hospitals, Visakhapatnam', lat: 17.738, lon: 83.318, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Apollo+Hospitals+Health+City+Visakhapatnam' },
      { name: 'Dr. Anusha G', degree: 'DM (Neuro)', avatar: 'AG', clinic: 'Karumuri Hospitals, Guntur', lat: 16.306, lon: 80.428, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Karumuri+Hospitals+Guntur' },
      { name: 'Dr. Pavan Kumar', degree: 'DM (Neuro)', avatar: 'PK', clinic: 'Fathima Hospital, Kadapa', lat: 14.475, lon: 78.825, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Fathima+Institute+of+Medical+Sciences+Kadapa' },
      { name: 'Dr. Jagannath', degree: 'MD (Neuro)', avatar: 'Jag', clinic: 'Prashanthi Hospital, Ananthapur', lat: 14.6819, lon: 77.6006, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Prashanthi+Hospital+Anantapur' },
      { name: 'Dr. Sudhakar Babu', degree: 'DM (Neuro)', avatar: 'SBa', clinic: 'Bollineni Hospitals, Rajahmundry', lat: 17.0005, lon: 81.8040, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Bollineni+Hospitals+Rajahmundry' },
      { name: 'Dr. Sita Jayalakshmi', degree: 'DM (Neuro)', avatar: 'SJ', clinic: 'KIMS Hospital, Hyderabad', lat: 17.424, lon: 78.448, locationUrl: 'https://www.google.com/maps/search/?api=1&query=KIMS+Hospital+Secunderabad' },
      { name: 'Dr. Sudhir Kumar', degree: 'MD, DM (Neuro)', avatar: 'SKu', clinic: 'Apollo Hospitals, Hyderabad', lat: 17.437, lon: 78.448, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Apollo+Hospitals+Jubilee+Hills' },
      { name: 'Dr. Jaydip Ray Chaudhuri', degree: 'MD, DM, FRCP', avatar: 'JRC', clinic: 'AIG Hospitals, Hyderabad', lat: 17.462, lon: 78.378, locationUrl: 'https://www.google.com/maps/search/?api=1&query=AIG+Hospitals+Gachibowli' },
      { name: 'Dr. Murali K. Cherukuri', degree: 'MD, DM (Neuro)', avatar: 'MKC', clinic: 'Yashoda Hospitals, Somajiguda', lat: 17.4065, lon: 78.4772, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Yashoda+Hospitals+Somajiguda' },
      { name: 'Dr. R. C. Mishra', degree: 'MD, DM', avatar: 'RCM', clinic: 'Continental Hospitals, Hyderabad', lat: 17.458, lon: 78.36, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Continental+Hospitals+Gachibowli' },
      { name: 'Dr. K. S. Babu', degree: 'MD, DM', avatar: 'KSB', clinic: 'City Neuro Centre, Vijayawada', lat: 16.51, lon: 80.64, locationUrl: 'https://www.google.com/maps/search/?api=1&query=City+Neuro+Centre+Vijayawada' },
      { name: 'Dr. Suresh Giri', degree: 'MD, DM', avatar: 'SGi', clinic: 'New Life Hospital, Guntur', lat: 16.3, lon: 80.45, locationUrl: 'https://www.google.com/maps/search/?api=1&query=New+Life+Hospital+Guntur' },
      { name: 'Dr. B. C. M. Prasad', degree: 'MD, DM', avatar: 'BCMP', clinic: 'NIMS, Tirupati', lat: 13.62, lon: 79.41, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Narayana+Medical+College+Hospital+Tirupati' },
      { name: 'Dr. S. K. Rao', degree: 'MD, DM (Neuro)', avatar: 'SKRao', clinic: 'Govt. Hospital, Chittoor', lat: 13.2173, lon: 79.1005, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Government+Hospital+Chittoor' },
      { name: 'Dr. N. V. S. Mohan', degree: 'MD, DM (Neuro)', avatar: 'NVSM', clinic: 'Sri Krishna Neuro Hospital, Bhimavaram', lat: 16.5449, lon: 81.5212, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Sri+Krishna+Neuro+Hospital+Bhimavaram' },
      { name: 'Dr. R. V. Kumar', degree: 'MD, DM (Neuro)', avatar: 'RVK', clinic: 'Padmavathi Hospital, Bhimavaram', lat: 16.5449, lon: 81.5212, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Padmavathi+Hospital+Bhimavaram' },
      { name: 'Dr. G. Prasad', degree: 'MD, DM (Neuro)', avatar: 'GPr', clinic: 'Life Care Hospital, Bhimavaram', lat: 16.5449, lon: 81.5212, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Life+Care+Hospital+Bhimavaram' },
      { name: 'Dr. C. R. Reddy', degree: 'MD, DM (Neuro)', avatar: 'CRRe', clinic: 'Sree Neuro Clinic, Ananthapur', lat: 14.6819, lon: 77.6006, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Sree+Neuro+Clinic+Anantapur' },
      { name: 'Dr. B. Rajendra Prasad', degree: 'MD, DM', avatar: 'BRP', clinic: 'Manipal Hospitals, Vijayawada', lat: 16.518, lon: 80.622, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Manipal+Hospitals+Vijayawada' },
      { name: 'Dr. G. Satyanarayana', degree: 'MD, DM', avatar: 'GSa', clinic: 'King George Hospital, Visakhapatnam', lat: 17.7126, lon: 83.2984, locationUrl: 'https://www.google.com/maps/search/?api=1&query=King+George+Hospital+Visakhapatnam' },
      { name: 'Dr. K. Vijaya', degree: 'DM (Neuro)', avatar: 'KV', clinic: 'SevenHills Hospital, Visakhapatnam', lat: 17.74, lon: 83.31, locationUrl: 'https://www.google.com/maps/search/?api=1&query=SevenHills+Hospital+Visakhapatnam' },
      { name: 'Dr. N. Ramachandra', degree: 'MD, DM', avatar: 'NR', clinic: 'Guntur Medical College, Guntur', lat: 16.306, lon: 80.43, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Guntur+Medical+College' },
      { name: 'Dr. Pradeep Kumar', degree: 'MD, DM', avatar: 'PrKu', clinic: 'Lakshmi Neuro Centre, Chittoor', lat: 13.2173, lon: 79.1005, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Lakshmi+Neuro+Centre+Chittoor' },
      { name: 'Dr. Suresh Babu', degree: 'MD, DM', avatar: 'SuBa', clinic: 'Apollo Speciality Hospitals, Chennai', lat: 13.05, lon: 80.21, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Apollo+Speciality+Hospitals+Vanagaram+Chennai' },
      { name: 'Dr. C. U. Velmurugendran', degree: 'MD, DM', avatar: 'CUV', clinic: 'Sri Ramachandra Medical Centre, Chennai', lat: 13.02, lon: 80.14, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Sri+Ramachandra+Medical+Centre+Porur' },
      { name: 'Dr. R. Lakshmipathy', degree: 'MD, DM', avatar: 'RLak', clinic: 'Govt. Hospital, Chittoor', lat: 13.2173, lon: 79.1005, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Government+Hospital+Chittoor' },
      { name: 'Dr. Mohan Rao', degree: 'MD, DM (Neuro)', avatar: 'MRao', clinic: 'Apollo Hospitals, Rajahmundry', lat: 16.99, lon: 81.79, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Apollo+Hospitals+Rajahmundry' },
      { name: 'Dr. K. Venkatesh', degree: 'DM (Neuro)', avatar: 'KVen', clinic: 'Goutham Hospital, Rajahmundry', lat: 16.98, lon: 81.78, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Goutham+Hospital+Rajahmundry' },
      { name: 'Dr. S. K. Shankar', degree: 'DM (Neuro)', avatar: 'SKSha', clinic: 'Mediciti Hospital, Nellore', lat: 14.43, lon: 79.98, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Mediciti+Hospital+Nellore' },
      { name: 'Dr. B. S. Ram', degree: 'MD, DM (Neuro)', avatar: 'BSR', clinic: 'KIMS Hospitals, Nellore', lat: 14.44, lon: 79.99, locationUrl: 'https://www.google.com/maps/search/?api=1&query=KIMS+Hospitals+Nellore' },
      { name: 'Dr. M. S. Reddy', degree: 'DM (Neuro)', avatar: 'MSR', clinic: 'RIMS, Kadapa', lat: 14.47, lon: 78.82, locationUrl: 'https://www.google.com/maps/search/?api=1&query=RIMS+Hospital+Kadapa' },
      { name: 'Dr. A. K. Singh', degree: 'MD, DM (Neuro)', avatar: 'AKS', clinic: 'Global Hospitals, Kadapa', lat: 14.46, lon: 78.81, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Global+Hospitals+Kadapa' },
      { name: 'Dr. Mahesh Babu', degree: 'MD, DM', avatar: 'MBabu', clinic: 'Govt. General Hospital, Ananthapur', lat: 14.6819, lon: 77.6006, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Government+General+Hospital+Anantapur' },
      { name: 'Dr. G. Ashok', degree: 'MD, DM', avatar: 'GAshok', clinic: 'S.V. Medical College, Tirupati', lat: 13.6288, lon: 79.4192, locationUrl: 'https://www.google.com/maps/search/?api=1&query=S.V.+Medical+College+Tirupati' }
    ],
  },
  {
    name: 'Orthopedics',
    doctors: [
      { name: 'Dr. Divya Rao', degree: 'MS, Ortho', avatar: 'DR', clinic: 'Sakra World Hospital, Bangalore', lat: 12.9716, lon: 77.5946, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Sakra+World+Hospital+Bangalore' }, 
      { name: 'Dr. G. Jagadesh', degree: 'MS (Ortho)', avatar: 'GJ', clinic: 'BIRRD Hospital, Tirupati', lat: 13.6288, lon: 79.4192, locationUrl: 'https://www.google.com/maps/search/?api=1&query=BIRRD+Hospital+Tirupati' },
      { name: 'Dr. Pooja Desai', degree: 'MS, Ortho', avatar: 'PD', clinic: 'Sunshine Hospitals, Hyderabad', lat: 17.3850, lon: 78.4867, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Sunshine+Hospitals+Secunderabad+Hyderabad' },
      { name: 'Dr. Venkat Rao', degree: 'MS, Ortho', avatar: 'VR', clinic: 'Simhapuri Hospital, Nellore', lat: 14.4426, lon: 79.9865, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Simhapuri+Hospital+Nellore' },
      { name: 'Dr. P. V. Naidu', degree: 'MS (Ortho)', avatar: 'PVN', clinic: 'Capital Hospitals, Vijayawada', lat: 16.511, lon: 80.655, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Capital+Hospitals+Vijayawada' },
      { name: 'Dr. Anil Kumar', degree: 'MS, MCh', avatar: 'AK', clinic: 'KIMS Icon Hospital, Visakhapatnam', lat: 17.726, lon: 83.307, locationUrl: 'https://www.google.com/maps/search/?api=1&query=KIMS+Icon+Hospital+Visakhapatnam' },
      { name: 'Dr. Chalapathi Rao', degree: 'MS (Ortho)', avatar: 'CRa', clinic: 'Ramesh Sanghamitra Hospitals, Guntur', lat: 16.309, lon: 80.45, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Ramesh+Sanghamitra+Hospitals+Guntur' },
      { name: 'Dr. Ramana Reddy', degree: 'MS (Ortho)', avatar: 'RRe', clinic: 'RIMS General Hospital, Kadapa', lat: 14.475, lon: 78.825, locationUrl: 'https://www.google.com/maps/search/?api=1&query=RIMS+General+Hospital+Kadapa' },
      { name: 'Dr. Bhargava Reddy', degree: 'MS (Ortho)', avatar: 'BRRe', clinic: 'Ashok Hospital, Chittoor', lat: 13.2173, lon: 79.1005, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Ashok+Hospital+Chittoor' },
      { name: 'Dr. Subhash Chandra', degree: 'MS (Ortho)', avatar: 'SCB', clinic: 'Life Hospital, Ananthapur', lat: 14.6819, lon: 77.6006, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Life+Hospital+Anantapur' },
      { name: 'Dr. P. Prakash', degree: 'MS (Ortho)', avatar: 'PPra', clinic: 'Global Hospitals, Bhimavaram', lat: 16.5449, lon: 81.5212, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Global+Hospitals+Bhimavaram' },
      { name: 'Dr. M. Satyanarayana', degree: 'MS (Ortho)', avatar: 'MSat', clinic: 'Satya Ortho Clinic, Bhimavaram', lat: 16.5449, lon: 81.5212, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Satya+Ortho+Clinic+Bhimavaram' },
      { name: 'Dr. G. Raju', degree: 'MS, DNB (Ortho)', avatar: 'GRa', clinic: 'Govt. Hospital, Bhimavaram', lat: 16.5449, lon: 81.5212, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Government+Hospital+Bhimavaram' },
      { name: 'Dr. A. V. Gurava Reddy', degree: 'MS (Ortho)', avatar: 'AVGR', clinic: 'Sunshine Hospitals, Hyderabad', lat: 17.443, lon: 78.473, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Sunshine+Hospitals+Secunderabad' },
      { name: 'Dr. N. S. Rao', degree: 'MS (Ortho)', avatar: 'NSR', clinic: 'KIMS Hospital, Hyderabad', lat: 17.424, lon: 78.448, locationUrl: 'https://www.google.com/maps/search/?api=1&query=KIMS+Hospital+Secunderabad' },
      { name: 'Dr. Raghuveer Reddy', degree: 'MS (Ortho)', avatar: 'RR', clinic: 'Apollo Hospitals, Hyderabad', lat: 17.437, lon: 78.448, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Apollo+Hospitals+Jubilee+Hills' },
      { name: 'Dr. D. V. R. Poornanand', degree: 'MS (Ortho)', avatar: 'DVRP', clinic: 'Sree Prathima Hospitals, Guntur', lat: 16.3, lon: 80.44, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Sree+Prathima+Hospitals+Guntur' },
      { name: 'Dr. M. S. Chakravarthy', degree: 'MS (Ortho)', avatar: 'MSC', clinic: 'Prashanth Hospital, Vijayawada', lat: 16.51, lon: 80.64, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Prashanth+Hospital+Vijayawada' },
      { name: 'Dr. John Ebnezar', degree: 'MS (Ortho)', avatar: 'JE', clinic: 'Apollo Spectra Hospitals, Bangalore', lat: 12.93, lon: 77.62, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Apollo+Spectra+Hospitals+Koramangala' },
      { name: 'Dr. K. Subba Rao', degree: 'MS (Ortho)', avatar: 'KSRAo', clinic: 'Sairam Ortho Hospital, Rajahmundry', lat: 17.0005, lon: 81.8040, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Sairam+Ortho+Hospital+Rajahmundry' },
      { name: 'Dr. Mohan Kumar', degree: 'MS (Ortho)', avatar: 'MoK', clinic: 'Sree Ramachandra Hospital, Chennai', lat: 13.023, lon: 80.14, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Sri+Ramachandra+Medical+Centre+Porur' },
      { name: 'Dr. P. Kishore', degree: 'MS (Ortho)', avatar: 'PKi', clinic: 'Govt. General Hospital, Kadapa', lat: 14.4668, lon: 78.8222, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Government+General+Hospital+Kadapa' },
      { name: 'Dr. V. N. Reddy', degree: 'MS (Ortho)', avatar: 'VNR', clinic: 'Santhiram Medical College, Nandyal', lat: 15.4807, lon: 78.4862, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Santhiram+Medical+College+Nandyal' },
      { name: 'Dr. J. Naresh Babu', degree: 'MS (Ortho)', avatar: 'JNB', clinic: 'Apollo Hospitals, Visakhapatnam', lat: 17.738, lon: 83.318, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Apollo+Hospitals+Health+City+Visakhapatnam' },
      { name: 'Dr. T. S. Rao', degree: 'MS (Ortho)', avatar: 'TSRao', clinic: 'King George Hospital, Visakhapatnam', lat: 17.7126, lon: 83.2984, locationUrl: 'https://www.google.com/maps/search/?api=1&query=King+George+Hospital+Visakhapatnam' },
      { name: 'Dr. M. Sridhar', degree: 'MS (Ortho)', avatar: 'MSri', clinic: 'Govt. General Hospital, Guntur', lat: 16.306, lon: 80.43, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Government+General+Hospital+Guntur' },
      { name: 'Dr. S. Ramesh Babu', degree: 'MS (Ortho)', avatar: 'SRBa', clinic: 'PVR Hospital, Chittoor', lat: 13.2173, lon: 79.1005, locationUrl: 'https://www.google.com/maps/search/?api=1&query=PVR+Hospital+Chittoor' },
      { name: 'Dr. P. V. Chalapathi', degree: 'MS (Ortho)', avatar: 'PVCh', clinic: 'Govt. Hospital, Chittoor', lat: 13.2173, lon: 79.1005, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Government+Hospital+Chittoor' },
      { name: 'Dr. George Thomas', degree: 'MS (Ortho)', avatar: 'GT', clinic: 'Fortis Malar Hospital, Chennai', lat: 13.00, lon: 80.26, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Fortis+Malar+Hospital+Adyar+Chennai' },
      { name: 'Dr. A. K. Venkatachalam', degree: 'MS (Ortho)', avatar: 'AKV', clinic: 'Vijaya Hospital, Chennai', lat: 13.04, lon: 80.22, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Vijaya+Hospital+Chennai' },
      { name: 'Dr. Ram Mohan', degree: 'MS (Ortho)', avatar: 'RaMo', clinic: 'Care & Cure Hospital, Rajahmundry', lat: 16.99, lon: 81.79, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Care+%26+Cure+Hospital+Rajahmundry' },
      { name: 'Dr. G. Venkata Reddy', degree: 'MS (Ortho)', avatar: 'GVR', clinic: 'Bollineni Hospital, Rajahmundry', lat: 16.98, lon: 81.78, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Bollineni+Hospital+Rajahmundry' },
      { name: 'Dr. S. Khader Basha', degree: 'MS (Ortho)', avatar: 'SKB', clinic: 'Apollo Hospitals, Nellore', lat: 14.43, lon: 79.98, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Apollo+Hospitals+Nellore' },
      { name: 'Dr. A. V. Ravi Kumar', degree: 'MS (Ortho)', avatar: 'AVRK', clinic: 'Narayana Hospitals, Nellore', lat: 14.44, lon: 79.99, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Narayana+Hospitals+Nellore' },
      { name: 'Dr. C. Madhusudhan', degree: 'MS (Ortho)', avatar: 'CM', clinic: 'Sree Chakra Hospital, Kadapa', lat: 14.47, lon: 78.82, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Sree+Chakra+Hospital+Kadapa' },
      { name: 'Dr. Anil Reddy', degree: 'MS, Ortho', avatar: 'AReddy', clinic: 'Govt. General Hospital, Ananthapur', lat: 14.6819, lon: 77.6006, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Government+General+Hospital+Anantapur' },
      { name: 'Dr. Krishna Mohan', degree: 'MS, Ortho', avatar: 'KMo', clinic: 'Saveera Hospital, Ananthapur', lat: 14.67, lon: 77.6, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Saveera+Hospital+Anantapur' },
      { name: 'Dr. Ravi Shankar', degree: 'MS, D.Ortho', avatar: 'RShankar', clinic: 'Helios Hospital, Tirupati', lat: 13.6288, lon: 79.4192, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Helios+Hospital+Tirupati' },
      { name: 'Dr. S. Balaji', degree: 'MS, Ortho', avatar: 'SBalaji', clinic: 'S.V. Medical College, Tirupati', lat: 13.6288, lon: 79.4192, locationUrl: 'https://www.google.com/maps/search/?api=1&query=S.V.+Medical+College+Tirupati' }
    ],
  },
   {
    name: 'Pediatrics',
    doctors: [
        { name: 'Dr. Rajesh Nair', degree: 'MD, Pediatrics', avatar: 'RN', clinic: 'Rainbow Children\'s Hospital, Bangalore', lat: 12.9716, lon: 77.5946, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Rainbow+Childrens+Hospital+Bangalore' },
        { name: 'Dr. Meena Iyer', degree: 'DNB, Pediatrics', avatar: 'MI', clinic: 'Kanchi Kamakoti Childs Trust, Chennai', lat: 13.0827, lon: 80.2707, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Kanchi+Kamakoti+Childs+Trust+Hospital+Chennai' },
        { name: 'Dr. Sita Ram', degree: 'MD (Peds)', avatar: 'SR', clinic: 'Amara Hospital, Tirupati', lat: 13.6288, lon: 79.4192, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Amara+Hospital+Tirupati' },
        { name: 'Dr. C. S. Reddy', degree: 'MD (Peds)', avatar: 'CSR', clinic: 'Rainbow Children\'s Hospital, Vijayawada', lat: 16.495, lon: 80.648, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Rainbow+Childrens+Hospital+Vijayawada' },
        { name: 'Dr. K. S. Devi', degree: 'MD, DCH', avatar: 'KSD', clinic: 'Indus Hospitals, Visakhapatnam', lat: 17.74, lon: 83.32, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Indus+Hospitals+Visakhapatnam' },
        { name: 'Dr. S. K. Sharma', degree: 'MD (Peds)', avatar: 'SKS', clinic: 'Govt. General Hospital, Ananthapur', lat: 14.6819, lon: 77.6006, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Government+General+Hospital+Anantapur' },
        { name: 'Dr. Geetha Prakash', degree: 'DCH', avatar: 'GP', clinic: 'Geetha Nursing Home, Bhimavaram', lat: 16.5449, lon: 81.5212, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Geetha+Nursing+Home+Bhimavaram' },
        { name: 'Dr. M. Kishore', degree: 'MD, DCH', avatar: 'MKis', clinic: 'Kishore Childrens Clinic, Bhimavaram', lat: 16.5449, lon: 81.5212, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Kishore+Childrens+Clinic+Bhimavaram' },
        { name: 'Dr. S. V. Rao', degree: 'DNB (Peds)', avatar: 'SVRao', clinic: 'Life Childrens Hospital, Bhimavaram', lat: 16.5449, lon: 81.5212, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Life+Childrens+Hospital+Bhimavaram' },
        { name: 'Dr. Jagan Mohan', degree: 'MD (Peds)', avatar: 'JM', clinic: 'Mother & Child Hospital, Guntur', lat: 16.306, lon: 80.45, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Mother+and+Child+Hospital+Guntur' },
        { name: 'Dr. Lavanya', degree: 'DNB (Peds)', avatar: 'Lav', clinic: 'Sree Krishna Childrens Hospital, Nellore', lat: 14.4426, lon: 79.9865, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Sree+Krishna+Childrens+Hospital+Nellore' },
        { name: 'Dr. Prasad Babu', degree: 'MD (Peds)', avatar: 'PBa', clinic: 'Prasad Childrens Hospital, Kadapa', lat: 14.4668, lon: 78.8222, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Prasad+Childrens+Hospital+Kadapa' },
        { name: 'Dr. Ramesh Kancharla', degree: 'MD, FAAP', avatar: 'RKanch', clinic: 'Rainbow Children\'s Hospital, Hyderabad', lat: 17.408, lon: 78.45, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Rainbow+Childrens+Hospital+Banjara+Hills' },
        { name: 'Dr. Lokesh Lingappa', degree: 'MD, DNB (Peds)', avatar: 'LL', clinic: 'Rainbow Children\'s Hospital, Hyderabad', lat: 17.408, lon: 78.45, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Rainbow+Childrens+Hospital+Banjara+Hills' },
        { name: 'Dr. S. R. Sharma', degree: 'MD (Peds)', avatar: 'SRS', clinic: 'Fernandez Hospital, Hyderabad', lat: 17.391, lon: 78.472, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Fernandez+Hospital+Hyderguda' },
        { name: 'Dr. K. Hari Kumar', degree: 'MD (Peds)', avatar: 'KHK', clinic: 'KIMS Cuddles, Guntur', lat: 16.3, lon: 80.44, locationUrl: 'https://www.google.com/maps/search/?api=1&query=KIMS+Cuddles+Guntur' },
        { name: 'Dr. T. S. Rao', degree: 'MD (Peds)', avatar: 'TSR', clinic: 'Lotus Children\'s Hospital, Vijayawada', lat: 16.51, lon: 80.65, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Lotus+Childrens+Hospital+Vijayawada' },
        { name: 'Dr. V. S. N. Murthy', degree: 'MD (Peds)', avatar: 'VSNM', clinic: 'Little Stars Children\'s Hospital, Visakhapatnam', lat: 17.72, lon: 83.3, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Little+Stars+Childrens+Hospital+Visakhapatnam' },
        { name: 'Dr. Sudha Rani', degree: 'MD, DCH', avatar: 'SRani', clinic: 'Srujana Hospital, Tirupati', lat: 13.6288, lon: 79.4192, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Srujana+Hospital+Tirupati' },
        { name: 'Dr. P. S. Reddy', degree: 'MD (Peds)', avatar: 'PSRed', clinic: 'Padmavathi Childrens Hospital, Nellore', lat: 14.4426, lon: 79.9865, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Padmavathi+Childrens+Hospital+Nellore' },
        { name: 'Dr. Naveen Kumar', degree: 'DNB (Peds)', avatar: 'NKum', clinic: 'Navodaya Hospital, Chittoor', lat: 13.2173, lon: 79.1005, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Navodaya+Hospital+Chittoor' },
        { name: 'Dr. S. V. Ramana', degree: 'MD (Peds)', avatar: 'SVRa', clinic: 'SVR Childrens Hospital, Bhimavaram', lat: 16.5449, lon: 81.5212, locationUrl: 'https://www.google.com/maps/search/?api=1&query=SVR+Childrens+Hospital+Bhimavaram' },
        { name: 'Dr. K. Srinivas', degree: 'MD, DCH', avatar: 'KSri', clinic: 'Sri Childrens Hospital, Ananthapur', lat: 14.6819, lon: 77.6006, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Sri+Childrens+Hospital+Anantapur' },
        { name: 'Dr. R. Madhavi', degree: 'DNB, DCH', avatar: 'RMa', clinic: 'Aravinda Hospital, Kadapa', lat: 14.4668, lon: 78.8222, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Aravinda+Hospital+Kadapa' },
        { name: 'Dr. V. Nagabhushanam', degree: 'MD (Peds)', avatar: 'VNa', clinic: 'Nagabhushanam Childrens Hospital, Rajahmundry', lat: 17.0005, lon: 81.8040, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Nagabhushanam+Childrens+Hospital+Rajahmundry' },
        { name: 'Dr. P.V. Rama Rao', degree: 'MD, DCH', avatar: 'PVRR', clinic: 'Apollo Hospitals, Visakhapatnam', lat: 17.738, lon: 83.318, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Apollo+Hospitals+Health+City+Visakhapatnam' },
        { name: 'Dr. R. Ravi Kumar', degree: 'MD, DCH', avatar: 'RRK', clinic: 'Govt. General Hospital, Guntur', lat: 16.306, lon: 80.43, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Government+General+Hospital+Guntur' },
        { name: 'Dr. K. Ranga Raju', degree: 'MD (Peds)', avatar: 'KRR', clinic: 'Suraksha Childrens Hospital, Chittoor', lat: 13.2173, lon: 79.1005, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Suraksha+Childrens+Hospital+Chittoor' },
        { name: 'Dr. V. Ravi Kumar', degree: 'MD (Peds)', avatar: 'VRK', clinic: 'Govt. Hospital, Chittoor', lat: 13.2173, lon: 79.1005, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Government+Hospital+Chittoor' },
        { name: 'Dr. Benny Benjamin', degree: 'MD (Peds)', avatar: 'BB', clinic: 'Fortis Malar Hospital, Chennai', lat: 13.00, lon: 80.26, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Fortis+Malar+Hospital+Adyar+Chennai' },
        { name: 'Dr. S. Thangavelu', degree: 'MD (Peds)', avatar: 'ST', clinic: 'Apollo Childrens Hospital, Chennai', lat: 13.04, lon: 80.24, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Apollo+Childrens+Hospital+Chennai' },
        { name: 'Dr. Ram Kumar', degree: 'MD (Peds)', avatar: 'RKu', clinic: 'Goutami Childrens Hospital, Rajahmundry', lat: 16.99, lon: 81.79, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Goutami+Childrens+Hospital+Rajahmundry' },
        { name: 'Dr. R. K. Prasad', degree: 'DCH', avatar: 'RKP', clinic: 'Sanjeevani Hospital, Rajahmundry', lat: 16.98, lon: 81.78, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Sanjeevani+Hospital+Rajahmundry' },
        { name: 'Dr. D. V. S. Pavan Kumar', degree: 'MD, DCH', avatar: 'DVSPK', clinic: 'Simhapuri Hospitals, Nellore', lat: 14.43, lon: 79.98, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Simhapuri+Hospitals+Nellore' },
        { name: 'Dr. B. Sandeep', degree: 'DNB (Peds)', avatar: 'BSa', clinic: 'Sandeep Childrens Clinic, Kadapa', lat: 14.47, lon: 78.82, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Sandeep+Childrens+Clinic+Kadapa' },
        { name: 'Dr. V. Indira', degree: 'MD, DCH', avatar: 'VIndira', clinic: 'RDT Hospital, Ananthapur', lat: 14.6819, lon: 77.6006, locationUrl: 'https://www.google.com/maps/search/?api=1&query=RDT+Hospital+Anantapur' },
        { name: 'Dr. S. Kumar', degree: 'MD, DCH', avatar: 'SKumar', clinic: 'Lotus Childrens Hospital, Tirupati', lat: 13.6288, lon: 79.4192, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Lotus+Childrens+Hospital+Tirupati' }
    ],
  },
  {
    name: 'Gynecology',
    doctors: [
        { name: 'Dr. Lakshmi S', degree: 'MS (OBG)', avatar: 'LS', clinic: 'Lotus Hospital, Tirupati', lat: 13.6359, lon: 79.4243, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Lotus+Hospital+Tirupati' },
        { name: 'Dr. Kavitha G', degree: 'DGO, DNB', avatar: 'KG', clinic: 'Apollo Cradle, Bangalore', lat: 12.9080, lon: 77.6444, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Apollo+Cradle+Brookefield+Bangalore' },
        { name: 'Dr. Parvathy S', degree: 'MD, DGO', avatar: 'PS2', clinic: 'SIMS Hospital, Chennai', lat: 13.0069, lon: 80.2205, locationUrl: 'https://www.google.com/maps/search/?api=1&query=SIMS+Hospital+Chennai' },
        { name: 'Dr. Jyothi K', degree: 'MD (OBG)', avatar: 'JK', clinic: 'Aayush Hospitals, Vijayawada', lat: 16.51, lon: 80.64, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Aayush+Hospitals+Vijayawada' },
        { name: 'Dr. Padmasree', degree: 'MS (OBG)', avatar: 'Pad', clinic: 'Padmasree Hospitals, Visakhapatnam', lat: 17.728, lon: 83.315, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Padmasree+Hospitals+Visakhapatnam' },
        { name: 'Dr. Bharathi Reddy', degree: 'MD, DGO', avatar: 'BRa', clinic: 'Bharathi Nursing Home, Chittoor', lat: 13.2173, lon: 79.1005, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Bharathi+Nursing+Home+Chittoor' },
        { name: 'Dr. Swarna Latha', degree: 'MS (OBG)', avatar: 'SwL', clinic: 'Lalitha Hospitals, Guntur', lat: 16.309, lon: 80.435, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Lalitha+Super+Speciality+Hospital+Guntur' },
        { name: 'Dr. Indira Devi', degree: 'MS, DGO', avatar: 'ID', clinic: 'Surya Hospital, Rajahmundry', lat: 17.0005, lon: 81.8040, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Surya+Hospital+Rajahmundry' },
        { name: 'Dr. Suguna', degree: 'MS (OBG)', avatar: 'Sug', clinic: 'Suguna Nursing Home, Kadapa', lat: 14.4668, lon: 78.8222, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Suguna+Nursing+Home+Kadapa' },
        { name: 'Dr. Prameela', degree: 'MD (OBG)', avatar: 'Pram', clinic: 'Prameela Nursing Home, Ananthapur', lat: 14.6819, lon: 77.6006, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Prameela+Nursing+Home+Anantapur' },
        { name: 'Dr. Rooma Sinha', degree: 'MD, DNB, MRCOG', avatar: 'RSi', clinic: 'Apollo Hospitals, Hyderabad', lat: 17.437, lon: 78.448, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Apollo+Hospitals+Jubilee+Hills' },
        { name: 'Dr. Manjula Anagani', degree: 'MD, FICOG', avatar: 'MA', clinic: 'Maxcure Hospitals, Hyderabad', lat: 17.452, lon: 78.39, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Medicover+Hospitals+Hitec+City' },
        { name: 'Dr. Vandana Hegde', degree: 'MS (OBG)', avatar: 'VH', clinic: 'Fernandez Hospital, Hyderabad', lat: 17.391, lon: 78.472, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Fernandez+Hospital+Hyderguda' },
        { name: 'Dr. S. Vyjayanthi', degree: 'MS (OBG)', avatar: 'SV', clinic: 'Motherhood Hospital, Bangalore', lat: 12.91, lon: 77.64, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Motherhood+Hospital+Sarjapur+Road' },
        { name: 'Dr. Usha Rani', degree: 'MD, DGO', avatar: 'UR', clinic: 'Prasad Hospitals, Vijayawada', lat: 16.5, lon: 80.65, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Prasad+Hospitals+Vijayawada' },
        { name: 'Dr. K. Sandhya', degree: 'MS (OBG)', avatar: 'KSa', clinic: 'Rainbow Hospitals, Visakhapatnam', lat: 17.73, lon: 83.31, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Rainbow+Hospitals+Visakhapatnam' },
        { name: 'Dr. Sarada', degree: 'MD, DGO', avatar: 'Sar', clinic: 'Sarada Nursing Home, Nellore', lat: 14.4426, lon: 79.9865, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Sarada+Nursing+Home+Nellore' },
        { name: 'Dr. P. Jayasree', degree: 'MD, DGO', avatar: 'PJ', clinic: 'Guntur Govt Hospital, Guntur', lat: 16.306, lon: 80.43, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Government+General+Hospital+Guntur' },
        { name: 'Dr. Hemalatha', degree: 'MD (OBG)', avatar: 'Hem', clinic: 'Bollineni Hospital, Bhimavaram', lat: 16.5449, lon: 81.5212, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Bollineni+Hospital+Bhimavaram' },
        { name: 'Dr. S. Kumari', degree: 'MS, DGO', avatar: 'SKumari', clinic: 'Sri Devi Maternity Hospital, Bhimavaram', lat: 16.5449, lon: 81.5212, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Sri+Devi+Maternity+Hospital+Bhimavaram' },
        { name: 'Dr. Anjali Devi', degree: 'MD (OBG)', avatar: 'ADevi', clinic: 'Anjali Nursing Home, Bhimavaram', lat: 16.5449, lon: 81.5212, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Anjali+Nursing+Home+Bhimavaram' },
        { name: 'Dr. S. Padmavathi', degree: 'MD (OBG)', avatar: 'SPad', clinic: 'Padmavathi Nursing Home, Ananthapur', lat: 14.6819, lon: 77.6006, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Padmavathi+Nursing+Home+Anantapur' },
        { name: 'Dr. M. Sujatha', degree: 'MD, DGO', avatar: 'MSuj', clinic: 'Govt. Hospital, Rajahmundry', lat: 17.0005, lon: 81.8040, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Government+Hospital+Rajahmundry' },
        { name: 'Dr. G. Lakshmi', degree: 'MS (OBG)', avatar: 'GLak', clinic: 'Govt. Hospital, Chittoor', lat: 13.2173, lon: 79.1005, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Government+Hospital+Chittoor' },
        { name: 'Dr. N. Rajyalakshmi', degree: 'MS (OBG)', avatar: 'NRaj', clinic: 'RIMS, Kadapa', lat: 14.475, lon: 78.825, locationUrl: 'https://www.google.com/maps/search/?api=1&query=RIMS+General+Hospital+Kadapa' },
        { name: 'Dr. M. Aruna', degree: 'MD (OBG)', avatar: 'MAr', clinic: 'King George Hospital, Visakhapatnam', lat: 17.7126, lon: 83.2984, locationUrl: 'https://www.google.com/maps/search/?api=1&query=King+George+Hospital+Visakhapatnam' },
        { name: 'Dr. N. Annapurna', degree: 'MS (OBG)', avatar: 'NA', clinic: 'St. Joseph\'s Hospital, Guntur', lat: 16.306, lon: 80.44, locationUrl: 'https://www.google.com/maps/search/?api=1&query=St.+Joseph%27s+General+Hospital,+Guntur' },
        { name: 'Dr. M. N. V. Prasad', degree: 'MD (OBG)', avatar: 'MNVP', clinic: 'Amrutha Hospital, Chittoor', lat: 13.2173, lon: 79.1005, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Amrutha+Hospital+Chittoor' },
        { name: 'Dr. G. V. K. Reddy', degree: 'MD (OBG)', avatar: 'GVKR', clinic: 'Vijaya Hospital, Chennai', lat: 13.04, lon: 80.22, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Vijaya+Hospital+Chennai' },
        { name: 'Dr. Kamala Selvaraj', degree: 'MD, DGO', avatar: 'KSel', clinic: 'GG Fertility Centre, Chennai', lat: 13.05, lon: 80.25, locationUrl: 'https://www.google.com/maps/search/?api=1&query=GG+Fertility+Centre+Nungambakkam' },
        { name: 'Dr. P. Sudha', degree: 'MD, DGO', avatar: 'PSud', clinic: 'Gouthami Nursing Home, Rajahmundry', lat: 16.99, lon: 81.79, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Gouthami+Nursing+Home+Rajahmundry' },
        { name: 'Dr. V. Radhika', degree: 'MD (OBG)', avatar: 'VRa', clinic: 'Narayana Medical College, Nellore', lat: 14.44, lon: 79.99, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Narayana+Medical+College+Nellore' },
        { name: 'Dr. M. Vijaya', degree: 'MS (OBG)', avatar: 'MVij', clinic: 'Vijaya Nursing Home, Nellore', lat: 14.43, lon: 79.98, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Vijaya+Nursing+Home+Nellore' },
        { name: 'Dr. S. Anuradha', degree: 'MD (OBG)', avatar: 'SAnu', clinic: 'Anuradha Nursing Home, Kadapa', lat: 14.47, lon: 78.82, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Anuradha+Nursing+Home+Kadapa' },
        { name: 'Dr. Sunitha', degree: 'MD, DGO', avatar: 'Sunitha', clinic: 'Govt. General Hospital, Ananthapur', lat: 14.6819, lon: 77.6006, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Government+General+Hospital+Anantapur' },
        { name: 'Dr. Aruna', degree: 'MS, DGO', avatar: 'Aruna', clinic: 'SV Medical College, Tirupati', lat: 13.6288, lon: 79.4192, locationUrl: 'https://www.google.com/maps/search/?api=1&query=SV+Medical+College+Tirupati' },
        { name: 'Dr. Bhavani', degree: 'MD, DGO', avatar: 'Bhavani', clinic: 'BIRRD Hospital, Tirupati', lat: 13.6288, lon: 79.4192, locationUrl: 'https://www.google.com/maps/search/?api=1&query=BIRRD+Hospital+Tirupati' }
    ],
  },
  {
    name: 'Radiology',
    doctors: [
        { name: 'Dr. Anand M', degree: 'MD, Radiology', avatar: 'AM', clinic: 'SVIMS, Tirupati', lat: 13.6288, lon: 79.4192, locationUrl: 'https://www.google.com/maps/search/?api=1&query=SVIMS+Tirupati' },
        { name: 'Dr. Suresh Kumar', degree: 'DMRD', avatar: 'SK2', clinic: 'Vijaya Diagnostic Centre, Hyderabad', lat: 17.412, lon: 78.435, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Vijaya+Diagnostic+Centre+Hyderabad' },
        { name: 'Dr. Deepa S', degree: 'MD, Radiology', avatar: 'DS', clinic: 'Manipal Hospital, Bangalore', lat: 12.9716, lon: 77.5946, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Manipal+Hospital+Old+Airport+Road+Bangalore' },
        { name: 'Dr. T. Madhav', degree: 'MD, Radiology', avatar: 'TM', clinic: 'Matrix Diagnostics, Vijayawada', lat: 16.505, lon: 80.65, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Matrix+Diagnostics+Vijayawada' },
        { name: 'Dr. Murali Krishna', degree: 'MD, Radiology', avatar: 'MK', clinic: 'SevenHills Hospital, Visakhapatnam', lat: 17.74, lon: 83.31, locationUrl: 'https://www.google.com/maps/search/?api=1&query=SevenHills+Hospital+Visakhapatnam' },
        { name: 'Dr. Subba Rao', degree: 'MD, RD', avatar: 'SRa', clinic: 'Bollineni Scan Center, Rajahmundry', lat: 17.0005, lon: 81.8040, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Bollineni+Scan+Center+Rajahmundry' },
        { name: 'Dr. Krishna Prasad', degree: 'DMRD', avatar: 'KPr', clinic: 'Delta Diagnostics, Guntur', lat: 16.306, lon: 80.45, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Delta+Diagnostics+Guntur' },
        { name: 'Dr. Prakasham', degree: 'MD, RD', avatar: 'Pra', clinic: 'Prakasham Scan Center, Chittoor', lat: 13.2173, lon: 79.1005, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Prakasham+Scan+Center+Chittoor' },
        { name: 'Dr. Ramanjaneyulu', degree: 'MD, DMRD', avatar: 'Ram', clinic: 'RIMS, Kadapa', lat: 14.475, lon: 78.825, locationUrl: 'https://www.google.com/maps/search/?api=1&query=RIMS+General+Hospital+Kadapa' },
        { name: 'Dr. Eswar Reddy', degree: 'MD, RD', avatar: 'ERe', clinic: 'GPR Scan Centre, Ananthapur', lat: 14.6819, lon: 77.6006, locationUrl: 'https://www.google.com/maps/search/?api=1&query=GPR+Scan+Centre+Anantapur' },
        { name: 'Dr. V. N. V. S. Ramakrishna', degree: 'MD (Radiology)', avatar: 'VNVSR', clinic: 'KIMS Hospital, Hyderabad', lat: 17.424, lon: 78.448, locationUrl: 'https://www.google.com/maps/search/?api=1&query=KIMS+Hospital+Secunderabad' },
        { name: 'Dr. S. K. Gupta', degree: 'MD (Radiology)', avatar: 'SKG', clinic: 'Yashoda Hospitals, Hyderabad', lat: 17.406, lon: 78.477, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Yashoda+Hospitals+Somajiguda' },
        { name: 'Dr. K. Ravindra', degree: 'MD (Radiology)', avatar: 'KR', clinic: 'Lucid Medical Diagnostics, Hyderabad', lat: 17.42, lon: 78.45, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Lucid+Medical+Diagnostics+Banjara+Hills' },
        { name: 'Dr. P. S. S. Prasad', degree: 'MD (Radiology)', avatar: 'PSSP', clinic: 'Prasad\'s Diagnostics, Guntur', lat: 16.3, lon: 80.43, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Prasad%27s+Diagnostics+Guntur' },
        { name: 'Dr. M. Sridhar', degree: 'DMRD', avatar: 'MSr', clinic: 'Sree Ramakrishna Diagnostics, Vijayawada', lat: 16.51, lon: 80.64, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Sree+Ramakrishna+Diagnostics+Vijayawada' },
        { name: 'Dr. G. V. Mohan Prasad', degree: 'MD (Radiology)', avatar: 'GVMP', clinic: 'Queen\'s NRI Hospital, Visakhapatnam', lat: 17.72, lon: 83.31, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Queen%27s+NRI+Hospital+Visakhapatnam' },
        { name: 'Dr. S. K. Jain', degree: 'MD (Radiology)', avatar: 'SKJ', clinic: 'MGM Hospital, Chennai', lat: 13.0604, lon: 80.2495, locationUrl: 'https://www.google.com/maps/search/?api=1&query=MGM+Healthcare+Chennai' },
        { name: 'Dr. K. Raghavendra', degree: 'MD (Radiology)', avatar: 'KRa', clinic: 'SV Diagnostic Centre, Bhimavaram', lat: 16.5449, lon: 81.5212, locationUrl: 'https://www.google.com/maps/search/?api=1&query=SV+Diagnostic+Centre+Bhimavaram' },
        { name: 'Dr. Ch. Krishna', degree: 'MD (Radiology)', avatar: 'CKr', clinic: 'Krishna Diagnostics, Bhimavaram', lat: 16.5449, lon: 81.5212, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Krishna+Diagnostics+Bhimavaram' },
        { name: 'Dr. V. Sharma', degree: 'DMRD', avatar: 'VSha', clinic: 'Apollo Scan Center, Bhimavaram', lat: 16.5449, lon: 81.5212, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Apollo+Scan+Center+Bhimavaram' },
        { name: 'Dr. P. R. Kumar', degree: 'DMRD', avatar: 'PRK', clinic: 'Apollo Scan Centre, Nellore', lat: 14.4426, lon: 79.9865, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Apollo+Scan+Centre+Nellore' },
        { name: 'Dr. R. Balaji', degree: 'MD (Radiology)', avatar: 'RBal', clinic: 'Balaji Scan Centre, Chittoor', lat: 13.2173, lon: 79.1005, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Balaji+Scan+Centre+Chittoor' },
        { name: 'Dr. S. Harish', degree: 'MD (Radiology)', avatar: 'SHa', clinic: 'Harish Scan Centre, Ananthapur', lat: 14.6819, lon: 77.6006, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Harish+Scan+Centre+Anantapur' },
        { name: 'Dr. Venkat Reddy', degree: 'DMRD', avatar: 'VRe', clinic: 'Govt. Hospital, Rajahmundry', lat: 17.0005, lon: 81.8040, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Government+Hospital+Rajahmundry' },
        { name: 'Dr. K. Surendra', degree: 'MD (Radiology)', avatar: 'KSu', clinic: 'RIMS, Kadapa', lat: 14.475, lon: 78.825, locationUrl: 'https://www.google.com/maps/search/?api=1&query=RIMS+General+Hospital+Kadapa' },
        { name: 'Dr. P. Sridhar', degree: 'MD, DNB (Radio)', avatar: 'PSri', clinic: 'King George Hospital, Visakhapatnam', lat: 17.7126, lon: 83.2984, locationUrl: 'https://www.google.com/maps/search/?api=1&query=King+George+Hospital+Visakhapatnam' },
        { name: 'Dr. S.V.S.S. Murthy', degree: 'MD, RD', avatar: 'SVSM', clinic: 'Govt. General Hospital, Guntur', lat: 16.306, lon: 80.43, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Government+General+Hospital+Guntur' },
        { name: 'Dr. Surendranath', degree: 'MD (Radiology)', avatar: 'Sura', clinic: 'Sree Ramana Scan, Chittoor', lat: 13.2173, lon: 79.1005, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Sree+Ramana+Scan+Chittoor' },
        { name: 'Dr. Karthik', degree: 'MD, RD', avatar: 'Kar', clinic: 'Aarthi Scans, Chennai', lat: 13.06, lon: 80.24, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Aarthi+Scans+Vadapalani' },
        { name: 'Dr. Mathew Cherian', degree: 'MD (Radiology)', avatar: 'MCh', clinic: 'Precise Diagnostics, Chennai', lat: 13.05, lon: 80.25, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Precise+Diagnostics+Nungambakkam' },
        { name: 'Dr. Srinivasa Rao', degree: 'MD (Radiology)', avatar: 'SRao', clinic: 'Sree Diagnostics, Rajahmundry', lat: 16.99, lon: 81.79, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Sree+Diagnostics+Rajahmundry' },
        { name: 'Dr. V. Subba Rao', degree: 'DMRD', avatar: 'VSRao', clinic: 'Vijaya Lakshmi Scans, Nellore', lat: 14.43, lon: 79.98, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Vijaya+Lakshmi+Scans+Nellore' },
        { name: 'Dr. G. Krishna Mohan', degree: 'MD, DMRD', avatar: 'GKM', clinic: 'Medall, Nellore', lat: 14.44, lon: 79.99, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Medall+Nellore' },
        { name: 'Dr. K. Srinivasulu', degree: 'MD (Radiology)', avatar: 'KSrin', clinic: 'Srinivasulu Diagnostics, Kadapa', lat: 14.47, lon: 78.82, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Srinivasulu+Diagnostics+Kadapa' },
        { name: 'Dr. Mohan Kumar', degree: 'MD, RD', avatar: 'MKR', clinic: 'Govt. General Hospital, Ananthapur', lat: 14.6819, lon: 77.6006, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Government+General+Hospital+Anantapur' },
        { name: 'Dr. Ramana', degree: 'MD, DMRD', avatar: 'Ramana', clinic: 'Helios Scans, Tirupati', lat: 13.6288, lon: 79.4192, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Helios+Scans+Tirupati' },
        { name: 'Dr. S. Karthik', degree: 'MD, RD', avatar: 'SKarthik', clinic: 'Amara Scans, Tirupati', lat: 13.6288, lon: 79.4192, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Amara+Scans+Tirupati' }
    ],
  },
  {
    name: 'General Surgery',
    doctors: [
        { name: 'Dr. Bhaskar Rao', degree: 'MS, Gen Surgery', avatar: 'BR', clinic: 'Yashoda Hospitals, Hyderabad', lat: 17.4065, lon: 78.4772, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Yashoda+Hospitals+Somajiguda' },
        { name: 'Dr. Chenna Reddy', degree: 'MS, DNB', avatar: 'CR', clinic: 'Helios Hospital, Tirupati', lat: 13.627, lon: 79.420, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Helios+Hospital+Tirupati' },
        { name: 'Dr. Murali N', degree: 'MS, FRCS', avatar: 'MN', clinic: 'MIOT International, Chennai', lat: 13.0185, lon: 80.1983, locationUrl: 'https://www.google.com/maps/search/?api=1&query=MIOT+International+Chennai' },
        { name: 'Dr. G. Sivaram', degree: 'MS', avatar: 'GS', clinic: 'Kamineni Hospitals, Vijayawada', lat: 16.513, lon: 80.63, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Kamineni+Hospitals+Vijayawada' },
        { name: 'Dr. A. V. Rao', degree: 'MS, FRCS', avatar: 'AVR', clinic: 'Pinnacle Hospitals, Visakhapatnam', lat: 17.72, lon: 83.3, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Pinnacle+Hospitals+Visakhapatnam' },
        { name: 'Dr. V. Prasad', degree: 'MS (Gen Surg)', avatar: 'VPr', clinic: 'Bollineni Hospital, Rajahmundry', lat: 17.0005, lon: 81.8040, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Bollineni+Hospitals+Rajahmundry' },
        { name: 'Dr. Somasekhar', degree: 'MS (Gen Surg)', avatar: 'Som', clinic: 'Govt. General Hospital, Guntur', lat: 16.306, lon: 80.43, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Government+General+Hospital+Guntur' },
        { name: 'Dr. Imtiaz', degree: 'MS (Gen Surg)', avatar: 'Imt', clinic: 'Govt. General Hospital, Kadapa', lat: 14.475, lon: 78.825, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Government+General+Hospital+Kadapa' },
        { name: 'Dr. Nagarjuna', degree: 'MS (Gen Surg)', avatar: 'Nag', clinic: 'Govt. General Hospital, Ananthapur', lat: 14.6819, lon: 77.6006, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Government+General+Hospital+Anantapur' },
        { name: 'Dr. Anand Kumar B', degree: 'MS, Gen Surgery', avatar: 'AKB', clinic: 'CMC Hospital, Chittoor', lat: 13.2173, lon: 79.1005, locationUrl: 'https://www.google.com/maps/search/?api=1&query=CMC+Hospital+Chittoor' },
        { name: 'Dr. Satish Kumar', degree: 'MS (Gen Surg)', avatar: 'SKu2', clinic: 'Sai Hospitals, Nellore', lat: 14.4426, lon: 79.9865, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Sai+Hospital+Nellore' },
        { name: 'Dr. S. Ramesh', degree: 'MS (Gen Surg)', avatar: 'SRa2', clinic: 'Ramesh Hospitals, Bhimavaram', lat: 16.5449, lon: 81.5212, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Ramesh+Hospitals+Bhimavaram' },
        { name: 'Dr. K. Rajesh', degree: 'MS, FIAGES', avatar: 'KRaj', clinic: 'Surya Surgical Center, Bhimavaram', lat: 16.5449, lon: 81.5212, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Surya+Surgical+Center+Bhimavaram' },
        { name: 'Dr. P. V. Ramana', degree: 'MS (Gen Surg)', avatar: 'PVRa', clinic: 'SVR Surgical Hospital, Bhimavaram', lat: 16.5449, lon: 81.5212, locationUrl: 'https://www.google.com/maps/search/?api=1&query=SVR+Surgical+Hospital+Bhimavaram' },
        { name: 'Dr. C. R. K. Prasad', degree: 'MS, FRCS', avatar: 'CRKP', clinic: 'Apollo Hospitals, Hyderabad', lat: 17.437, lon: 78.448, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Apollo+Hospitals+Jubilee+Hills' },
        { name: 'Dr. B. Nageshwar Reddy', degree: 'MD, DM, FAMS', avatar: 'BNR', clinic: 'AIG Hospitals, Hyderabad', lat: 17.462, lon: 78.378, locationUrl: 'https://www.google.com/maps/search/?api=1&query=AIG+Hospitals+Gachibowli' },
        { name: 'Dr. M. Adinarayana', degree: 'MS (Gen Surg)', avatar: 'MAd', clinic: 'Katuri Medical College, Guntur', lat: 16.35, lon: 80.5, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Katuri+Medical+College+Guntur' },
        { name: 'Dr. Y. V. Mohan', degree: 'MS, FRCS', avatar: 'YVM', clinic: 'Mohan\'s Poly Clinic, Vijayawada', lat: 16.51, lon: 80.64, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Mohan%27s+Poly+Clinic+Vijayawada' },
        { name: 'Dr. K. S. S. Naik', degree: 'MS, FIAGES', avatar: 'KSSN', clinic: 'Naik Hospitals, Nellore', lat: 14.44, lon: 79.98, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Naik+Hospitals+Nellore' },
        { name: 'Dr. S. K. Rao', degree: 'MS', avatar: 'SKRa', clinic: 'Gayathri Hospital, Chittoor', lat: 13.2173, lon: 79.1005, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Gayathri+Hospital+Chittoor' },
        { name: 'Dr. B. Srinivas', degree: 'MS', avatar: 'BSri', clinic: 'Sri Balaji Hospital, Ananthapur', lat: 14.6819, lon: 77.6006, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Sri+Balaji+Hospital+Anantapur' },
        { name: 'Dr. K. V. Rao', degree: 'MS', avatar: 'KVR', clinic: 'Govt. Hospital, Bhimavaram', lat: 16.5449, lon: 81.5212, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Government+Hospital+Bhimavaram' },
        { name: 'Dr. P. Sridhar', degree: 'MS (Gen Surg)', avatar: 'PSri2', clinic: 'RIMS, Kadapa', lat: 14.475, lon: 78.825, locationUrl: 'https://www.google.com/maps/search/?api=1&query=RIMS+General+Hospital+Kadapa' },
        { name: 'Dr. N. Chandrasekhar', degree: 'MS', avatar: 'NChan', clinic: 'Govt. Hospital, Rajahmundry', lat: 17.0005, lon: 81.8040, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Government+Hospital+Rajahmundry' },
        { name: 'Dr. T. Narayana Rao', degree: 'MS, FICS', avatar: 'TNR', clinic: 'King George Hospital, Visakhapatnam', lat: 17.7126, lon: 83.2984, locationUrl: 'https://www.google.com/maps/search/?api=1&query=King+George+Hospital+Visakhapatnam' },
        { name: 'Dr. P. Raghu Ram', degree: 'MS, FRCS', avatar: 'PRR', clinic: 'KIMS-Ushalakshmi Centre, Hyderabad', lat: 17.424, lon: 78.448, locationUrl: 'https://www.google.com/maps/search/?api=1&query=KIMS-Ushalakshmi+Centre+for+Breast+Diseases' },
        { name: 'Dr. G.V. Rao', degree: 'MS (Gen Surg)', avatar: 'GVRao', clinic: 'Sai Hospitals, Guntur', lat: 16.309, lon: 80.45, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Sai+Hospitals+Guntur' },
        { name: 'Dr. J. S. Rajkumar', degree: 'MS, FRCS', avatar: 'JSR', clinic: 'Lifeline Hospitals, Chennai', lat: 13.06, lon: 80.22, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Lifeline+Hospitals+Kilpauk+Chennai' },
        { name: 'Dr. Mohan A. T.', degree: 'MS (Gen Surg)', avatar: 'MAT', clinic: 'Apollo Hospitals, Chennai', lat: 13.047, lon: 80.24, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Apollo+Hospitals+Greams+Road+Chennai' },
        { name: 'Dr. Ramesh Kumar', degree: 'MS (Gen Surg)', avatar: 'RKu', clinic: 'Ramesh Surgical Hospital, Chittoor', lat: 13.2173, lon: 79.1005, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Ramesh+Surgical+Hospital+Chittoor' },
        { name: 'Dr. C. Mallikarjuna', degree: 'MS, FIAGES', avatar: 'CMal', clinic: 'GSL Medical College, Rajahmundry', lat: 16.99, lon: 81.79, locationUrl: 'https://www.google.com/maps/search/?api=1&query=GSL+Medical+College+Rajahmundry' },
        { name: 'Dr. A. Y. Chary', degree: 'MS (Gen Surg)', avatar: 'AYC', clinic: 'ACSR Govt. Medical College, Nellore', lat: 14.43, lon: 79.98, locationUrl: 'https://www.google.com/maps/search/?api=1&query=ACSR+Govt.+Medical+College+Nellore' },
        { name: 'Dr. K. V. R. Prasad', degree: 'MS (Gen Surg)', avatar: 'KVRP', clinic: 'Prasad Surgical Clinic, Kadapa', lat: 14.47, lon: 78.82, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Prasad+Surgical+Clinic+Kadapa' },
        { name: 'Dr. Chandra Sekhar', degree: 'MS', avatar: 'CSekhar', clinic: 'KIMS Saveera, Ananthapur', lat: 14.67, lon: 77.6, locationUrl: 'https://www.google.com/maps/search/?api=1&query=KIMS+Saveera+Anantapur' },
        { name: 'Dr. Mohan Reddy', degree: 'MS', avatar: 'MReddy', clinic: 'SVIMS, Tirupati', lat: 13.6288, lon: 79.4192, locationUrl: 'https://www.google.com/maps/search/?api=1&query=SVIMS+Tirupati' },
        { name: 'Dr. S. K. Basha', degree: 'MS', avatar: 'SKBasha', clinic: 'RUYA Hospital, Tirupati', lat: 13.6288, lon: 79.4192, locationUrl: 'https://www.google.com/maps/search/?api=1&query=RUYA+Govt+General+Hospital+Tirupati' }
    ],
  },
  {
    name: 'Ophthalmology',
    doctors: [
        { name: 'Dr. Ravi Kumar', degree: 'MS, Ophthalmology', avatar: 'RK', clinic: 'L V Prasad Eye Institute, Hyderabad', lat: 17.4241, lon: 78.4526, locationUrl: 'https://www.google.com/maps/search/?api=1&query=L+V+Prasad+Eye+Institute+Hyderabad' },
        { name: 'Dr. Agarwal', degree: 'MS, FICO', avatar: 'AGar', clinic: 'Dr. Agarwals Eye Hospital, Tirupati', lat: 13.633, lon: 79.418, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Dr+Agarwals+Eye+Hospital+Tirupati' },
        { name: 'Dr. Priya S', degree: 'DO, DNB', avatar: 'PS3', clinic: 'Narayana Nethralaya, Bangalore', lat: 12.9351, lon: 77.6245, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Narayana+Nethralaya+Koramangala' },
        { name: 'Dr. V. K. Raju', degree: 'MS, FICO', avatar: 'VKR', clinic: 'Vasan Eye Care, Vijayawada', lat: 16.51, lon: 80.64, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Vasan+Eye+Care+Vijayawada' },
        { name: 'Dr. S. M. Rao', degree: 'MS', avatar: 'SMR', clinic: 'Lions Cancer Hospital, Visakhapatnam', lat: 17.73, lon: 83.31, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Lions+Cancer+Hospital+Visakhapatnam' },
        { name: 'Dr. K. Srinivas', degree: 'MS (Ophth)', avatar: 'KSr', clinic: 'Srinivasa Eye Hospital, Bhimavaram', lat: 16.5449, lon: 81.5212, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Srinivasa+Eye+Hospital+Bhimavaram' },
        { name: 'Dr. G. Ravi', degree: 'MS, DO', avatar: 'GRavi', clinic: 'Ravi Eye Clinic, Bhimavaram', lat: 16.5449, lon: 81.5212, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Ravi+Eye+Clinic+Bhimavaram' },
        { name: 'Dr. A. Sudhakar', degree: 'MS', avatar: 'ASud', clinic: 'Sudhakar Eye Hospital, Bhimavaram', lat: 16.5449, lon: 81.5212, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Sudhakar+Eye+Hospital+Bhimavaram' },
        { name: 'Dr. Mohan Raj', degree: 'MS, DO', avatar: 'MRaj', clinic: 'Sankara Eye Hospital, Guntur', lat: 16.32, lon: 80.42, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Sankara+Eye+Hospital+Guntur' },
        { name: 'Dr. S. Khan', degree: 'MS, DO', avatar: 'SKhan', clinic: 'Modern Eye Hospital, Nellore', lat: 14.4426, lon: 79.9865, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Modern+Eye+Hospital+Nellore' },
        { name: 'Dr. Venkataswamy', degree: 'MS (Ophth)', avatar: 'Ven', clinic: 'Govt. Eye Hospital, Kadapa', lat: 14.4668, lon: 78.8222, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Government+Eye+Hospital+Kadapa' },
        { name: 'Dr. Balaji', degree: 'MS (Ophth)', avatar: 'Bal', clinic: 'Balaji Eye Hospital, Ananthapur', lat: 14.6819, lon: 77.6006, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Balaji+Eye+Hospital+Anantapur' },
        { name: 'Dr. Reddy Eye Hospital', degree: 'MS, DO', avatar: 'REH', clinic: 'Dr. Reddy Eye Hospital, Chittoor', lat: 13.2173, lon: 79.1005, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Dr+Reddy+Eye+Hospital+Chittoor' },
        { name: 'Dr. Shankar Rao', degree: 'MS (Ophth)', avatar: 'ShaR', clinic: 'Shankar Eye Hospital, Rajahmundry', lat: 17.0005, lon: 81.8040, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Shankar+Eye+Hospital+Rajahmundry' },
        { name: 'Dr. Santosh G. Honavar', degree: 'MD, FACS', avatar: 'SGH', clinic: 'Centre for Sight, Hyderabad', lat: 17.406, lon: 78.463, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Centre+for+Sight+Banjara+Hills' },
        { name: 'Dr. Pravin Krishna', degree: 'MS (Ophth)', avatar: 'PKrishna', clinic: 'Maxivision Eye Hospital, Hyderabad', lat: 17.414, lon: 78.435, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Maxivision+Eye+Hospital+Somajiguda' },
        { name: 'Dr. G. N. Rao', degree: 'MS', avatar: 'GNR', clinic: 'L V Prasad Eye Institute, Visakhapatnam', lat: 17.75, lon: 83.34, locationUrl: 'https://www.google.com/maps/search/?api=1&query=L+V+Prasad+Eye+Institute+Visakhapatnam' },
        { name: 'Dr. N. S. Raju', degree: 'MS (Ophth)', avatar: 'NSRaju', clinic: 'Vasan Eye Care, Guntur', lat: 16.3, lon: 80.44, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Vasan+Eye+Care+Guntur' },
        { name: 'Dr. R. Ramamurthy', degree: 'MS (Ophth)', avatar: 'RRam', clinic: 'The Eye Foundation, Bangalore', lat: 12.92, lon: 77.6, locationUrl: 'https://www.google.com/maps/search/?api=1&query=The+Eye+Foundation+Koramangala' },
        { name: 'Dr. M. S. Reddy', degree: 'MS, DO', avatar: 'MSRed', clinic: 'Swetcha Eye Hospital, Tirupati', lat: 13.6288, lon: 79.4192, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Swetcha+Eye+Hospital+Tirupati' },
        { name: 'Dr. V. Seshaiah', degree: 'MS (Ophth)', avatar: 'VSes', clinic: 'Vasan Eye Care, Nellore', lat: 14.4426, lon: 79.9865, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Vasan+Eye+Care+Nellore' },
        { name: 'Dr. L. V. Prasad', degree: 'MS', avatar: 'LVP', clinic: 'Lions Eye Hospital, Guntur', lat: 16.306, lon: 80.45, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Lions+Eye+Hospital+Guntur' },
        { name: 'Dr. T. Venugopal', degree: 'MS', avatar: 'TVen', clinic: 'Venkateswara Nethralayam, Ananthapur', lat: 14.6819, lon: 77.6006, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Venkateswara+Nethralayam+Anantapur' },
        { name: 'Dr. P. Rajasekhar', degree: 'MS', avatar: 'PRaj', clinic: 'RIMS, Kadapa', lat: 14.475, lon: 78.825, locationUrl: 'https://www.google.com/maps/search/?api=1&query=RIMS+General+Hospital+Kadapa' },
        { name: 'Dr. S. Subba Rao', degree: 'MS', avatar: 'SSRao', clinic: 'Sankar Eye Hospital, Rajahmundry', lat: 17.0005, lon: 81.8040, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Sankar+Eye+Hospital+Rajahmundry' },
        { name: 'Dr. K. Ram Prasad', degree: 'MS', avatar: 'KRPr', clinic: 'Dr Agarwals Eye Hospital, Visakhapatnam', lat: 17.728, lon: 83.318, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Dr+Agarwals+Eye+Hospital+Visakhapatnam' },
        { name: 'Dr. P. Madhusudhan', degree: 'MS (Ophth)', avatar: 'PMad', clinic: 'Apollo Eye Clinic, Chittoor', lat: 13.2173, lon: 79.1005, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Apollo+Eye+Clinic+Chittoor' },
        { name: 'Dr. D. S. Naidu', degree: 'MS (Ophth)', avatar: 'DSN', clinic: 'Vasan Eye Care, Chittoor', lat: 13.2173, lon: 79.1005, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Vasan+Eye+Care+Chittoor' },
        { name: 'Dr. B. Ganesh', degree: 'MS (Ophth)', avatar: 'BGa', clinic: 'Dr. Agarwals Eye Hospital, Chennai', lat: 13.06, lon: 80.25, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Dr.+Agarwals+Eye+Hospital+Nungambakkam+Chennai' },
        { name: 'Dr. Amar Agarwal', degree: 'MS, FRCS', avatar: 'AA', clinic: 'Dr. Agarwals Eye Hospital, Chennai', lat: 13.08, lon: 80.26, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Dr.+Agarwals+Eye+Hospital+Cathedral+Road+Chennai' },
        { name: 'Dr. K. Ramakrishna', degree: 'MS (Ophth)', avatar: 'KRam', clinic: 'Vasan Eye Care, Rajahmundry', lat: 16.99, lon: 81.79, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Vasan+Eye+Care+Rajahmundry' },
        { name: 'Dr. C. N. Reddy', degree: 'MS, DO', avatar: 'CNR', clinic: 'Dr. C. N. Reddy Eye Hospital, Nellore', lat: 14.43, lon: 79.98, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Dr.+C.+N.+Reddy+Eye+Hospital+Nellore' },
        { name: 'Dr. P. Subramanyam', degree: 'MS (Ophth)', avatar: 'PSub', clinic: 'Global Eye Hospital, Kadapa', lat: 14.47, lon: 78.82, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Global+Eye+Hospital+Kadapa' },
        { name: 'Dr. Mohan', degree: 'MS, DO', avatar: 'Mohan', clinic: 'Govt. General Hospital, Ananthapur', lat: 14.6819, lon: 77.6006, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Government+General+Hospital+Anantapur' },
        { name: 'Dr. L. V. K. Raju', degree: 'MS', avatar: 'LVKRaju', clinic: 'L V Prasad Eye Institute, Tirupati', lat: 13.6288, lon: 79.4192, locationUrl: 'https://www.google.com/maps/search/?api=1&query=L+V+Prasad+Eye+Institute+Tirupati' }
    ],
  },
  {
    name: 'Dermatology',
    doctors: [
        { name: 'Dr. Neha Sharma', degree: 'MD, Dermatology', avatar: 'NS', clinic: 'Kaya Skin Clinic, Bangalore', lat: 12.9279, lon: 77.6271, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Kaya+Skin+Clinic+Koramangala' },
        { name: 'Dr. Sudhakar Reddy', degree: 'MD, DVL', avatar: 'SRe', clinic: 'Apollo Skin Clinic, Tirupati', lat: 13.6295, lon: 79.418, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Apollo+Clinic+Tirupati' },
        { name: 'Dr. Swetha', degree: 'MBBS, DDVL', avatar: 'SW', clinic: 'Oliva Skin & Hair Clinic, Hyderabad', lat: 17.4435, lon: 78.3804, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Oliva+Skin+%26+Hair+Clinic+Hyderabad' },
        { name: 'Dr. R. P. Gupta', degree: 'MD, DVL', avatar: 'RPG', clinic: 'VLCC Wellness, Vijayawada', lat: 16.50, lon: 80.65, locationUrl: 'https://www.google.com/maps/search/?api=1&query=VLCC+Wellness+Vijayawada' },
        { name: 'Dr. Chaitanya', degree: 'MD, DVL', avatar: 'Cha', clinic: 'KIMS-ICON Hospital, Visakhapatnam', lat: 17.726, lon: 83.307, locationUrl: 'https://www.google.com/maps/search/?api=1&query=KIMS-ICON+Hospital,Visakhapatnam' },
        { name: 'Dr. Sumanth Kumar', degree: 'MD, DVL', avatar: 'SKu', clinic: 'Apollo Clinic, Chittoor', lat: 13.2173, lon: 79.1005, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Apollo+Clinic+Chittoor' },
        { name: 'Dr. Prasad Kumar', degree: 'MD, DVL', avatar: 'PKu', clinic: 'Aura Skin Clinic, Guntur', lat: 16.30, lon: 80.43, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Aura+Skin+Clinic+Guntur' },
        { name: 'Dr. Saritha', degree: 'MD, DVL', avatar: 'Sari', clinic: 'Kosmoderma, Nellore', lat: 14.4426, lon: 79.9865, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Kosmoderma+Nellore' },
        { name: 'Dr. Obul Reddy', degree: 'MD, DVL', avatar: 'OR', clinic: 'Skin & Hair Clinic, Kadapa', lat: 14.4668, lon: 78.8222, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Skin+and+Hair+Clinic+Kadapa' },
        { name: 'Dr. Amarnath', degree: 'MD, DVL', avatar: 'Ama', clinic: 'Amaravathi Skin Clinic, Ananthapur', lat: 14.6819, lon: 77.6006, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Amaravathi+Skin+Clinic+Anantapur' },
        { name: 'Dr. P. S. Murthy', degree: 'MD, DVL', avatar: 'PSM', clinic: 'GSL Medical College, Rajahmundry', lat: 17.0005, lon: 81.8040, locationUrl: 'https://www.google.com/maps/search/?api=1&query=GSL+Medical+College+Rajahmundry' },
        { name: 'Dr. Vani Skin Clinic', degree: 'MBBS, DD', avatar: 'VSC', clinic: 'Vani Skin Clinic, Bhimavaram', lat: 16.5449, lon: 81.5212, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Vani+Skin+Clinic+Bhimavaram' },
        { name: 'Dr. Srikanth', degree: 'MD, DVL', avatar: 'Srika', clinic: 'Srikanth Skin Clinic, Bhimavaram', lat: 16.5449, lon: 81.5212, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Srikanth+Skin+Clinic+Bhimavaram' },
        { name: 'Dr. N. Kumar', degree: 'MBBS, DDVL', avatar: 'NKumD', clinic: 'Kumar Skin Care, Bhimavaram', lat: 16.5449, lon: 81.5212, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Kumar+Skin+Care+Bhimavaram' },
        { name: 'Dr. Radha Shah', degree: 'MD, DNB', avatar: 'RShah', clinic: 'Apollo Hospitals, Hyderabad', lat: 17.437, lon: 78.448, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Apollo+Hospitals+Jubilee+Hills' },
        { name: 'Dr. Inshad', degree: 'MBBS, MD', avatar: 'Inshad', clinic: 'Kaya Skin Clinic, Hyderabad', lat: 17.411, lon: 78.46, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Kaya+Skin+Clinic+Banjara+Hills' },
        { name: 'Dr. Rashmi Sharma', degree: 'MD, DNB', avatar: 'RSha', clinic: 'Continental Hospitals, Hyderabad', lat: 17.458, lon: 78.36, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Continental+Hospitals+Gachibowli' },
        { name: 'Dr. C. R. Reddy', degree: 'MD, DVL', avatar: 'CRR', clinic: 'Skinova Clinic, Vijayawada', lat: 16.51, lon: 80.64, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Skinova+Clinic+Vijayawada' },
        { name: 'Dr. S. K. Reddy', degree: 'MD, DVL', avatar: 'SKR', clinic: 'Dr. S.K. Skin Clinic, Visakhapatnam', lat: 17.72, lon: 83.3, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Dr.+S.K.+Skin+Clinic+Visakhapatnam' },
        { name: 'Dr. S. Prasanth', degree: 'MBBS, DDVL', avatar: 'SPra', clinic: 'Prasanth Skin Clinic, Tirupati', lat: 13.6288, lon: 79.4192, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Prasanth+Skin+Clinic+Tirupati' },
        { name: 'Dr. G. V. Rao', degree: 'MD, DVL', avatar: 'GVRao', clinic: 'V-Care Skin Clinic, Nellore', lat: 14.4426, lon: 79.9865, locationUrl: 'https://www.google.com/maps/search/?api=1&query=V-Care+Skin+Clinic+Nellore' },
        { name: 'Dr. K. Swaroop', degree: 'MD, DVL', avatar: 'KSwa', clinic: 'Swaroop Skin Clinic, Chittoor', lat: 13.2173, lon: 79.1005, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Swaroop+Skin+Clinic+Chittoor' },
        { name: 'Dr. N. S. Rao', degree: 'MD, DVL', avatar: 'NSRao', clinic: 'Sri Sai Skin Clinic, Ananthapur', lat: 14.6819, lon: 77.6006, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Sri+Sai+Skin+Clinic+Anantapur' },
        { name: 'Dr. V. Nagesh', degree: 'MD, DVL', avatar: 'VNagesh', clinic: 'Dr. Nagesh Skin Clinic, Bhimavaram', lat: 16.5449, lon: 81.5212, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Dr.+Nagesh+Skin+Clinic+Bhimavaram' },
        { name: 'Dr. L. S. Rao', degree: 'MD, DVL', avatar: 'LSRao', clinic: 'RIMS, Kadapa', lat: 14.475, lon: 78.825, locationUrl: 'https://www.google.com/maps/search/?api=1&query=RIMS+General+Hospital+Kadapa' },
        { name: 'Dr. M. Sailaja', degree: 'MD, DVL', avatar: 'MSai', clinic: 'Sailaja Skin Clinic, Rajahmundry', lat: 17.0005, lon: 81.8040, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Sailaja+Skin+Clinic+Rajahmundry' },
        { name: 'Dr. K. Padmaja', degree: 'MD, DVL', avatar: 'KPad', clinic: 'Padmaja Skin Clinic, Visakhapatnam', lat: 17.735, lon: 83.325, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Padmaja+Skin+Clinic+Visakhapatnam' },
        { name: 'Dr. V. Lakshmi', degree: 'MBBS, DD', avatar: 'VL', clinic: 'Lakshmi Skin Clinic, Guntur', lat: 16.306, lon: 80.44, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Lakshmi+Skin+Clinic+Guntur' },
        { name: 'Dr. P. Sivakumar', degree: 'MD, DVL', avatar: 'PSiva', clinic: 'Siva Skin Clinic, Guntur', lat: 16.309, lon: 80.45, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Siva+Skin+Clinic+Guntur' },
        { name: 'Dr. G.V. Reddy', degree: 'MD, DVL', avatar: 'GVR', clinic: 'Ramachandra Skin Clinic, Chittoor', lat: 13.2173, lon: 79.1005, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Ramachandra+Skin+Clinic+Chittoor' },
        { name: 'Dr. Maya Vedamurthy', degree: 'MD, DVL', avatar: 'MV', clinic: 'Apollo Hospitals, Chennai', lat: 13.047, lon: 80.24, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Apollo+Hospitals+Greams+Road+Chennai' },
        { name: 'Dr. Murugusundram', degree: 'MD, DVL', avatar: 'Muru', clinic: 'Chennai Skin Foundation, Chennai', lat: 13.04, lon: 80.25, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Chennai+Skin+Foundation+T+Nagar' },
        { name: 'Dr. Sasikala', degree: 'MD, DVL', avatar: 'Sasi', clinic: 'Apollo Clinic, Rajahmundry', lat: 16.99, lon: 81.79, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Apollo+Clinic+Rajahmundry' },
        { name: 'Dr. V. Anand', degree: 'MD, DVL', avatar: 'VAn', clinic: 'Anand Skin Clinic, Nellore', lat: 14.43, lon: 79.98, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Anand+Skin+Clinic+Nellore' },
        { name: 'Dr. K. Rajendra', degree: 'MD, DVL', avatar: 'K Raj', clinic: 'Rajendra Skin Clinic, Kadapa', lat: 14.47, lon: 78.82, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Rajendra+Skin+Clinic+Kadapa' },
        { name: 'Dr. Ravindranath', degree: 'MD, DVL', avatar: 'Ravindranath', clinic: 'KIMS Saveera, Ananthapur', lat: 14.67, lon: 77.6, locationUrl: 'https://www.google.com/maps/search/?api=1&query=KIMS+Saveera+Anantapur' },
        { name: 'Dr. Harini', degree: 'MD, DVL', avatar: 'Harini', clinic: 'Sree Skin Clinic, Tirupati', lat: 13.6288, lon: 79.4192, locationUrl: 'https://www.google.com/maps/search/?api=1&query=Sree+Skin+Clinic+Tirupati' }
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
    setManualCityInput('');
    setManualLocation(null);
    setSearchError(null);
    if (checked) {
      clearError();
      getLocation();
    } else {
      setCityName(null);
      // If toggled off, reset to the initial full list
      let newSpecs = JSON.parse(JSON.stringify(initialSpecializations));
      newSpecs.forEach((spec: any) => {
        // Remove distance property if it exists
        spec.doctors.forEach((doc: any) => delete doc.distance);
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
    setNearbyEnabled(false); // Disable nearby toggle on manual search
    clearError(); // Clear any previous geolocation errors
    setManualLocation(null); // Reset manual location

    fetch(`https://geocode.maps.co/search?q=${encodeURIComponent(manualCityInput)}`)
      .then(res => {
        if (!res.ok) throw new Error('Geocoding API failed');
        return res.json();
      })
      .then(data => {
        if (data && data.length > 0) {
          const result = data[0];
          const displayName = result.display_name || '';
          setManualLocation({ latitude: parseFloat(result.lat), longitude: parseFloat(result.lon), city: displayName });
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
    const processLocation = () => {
        let newSpecs = JSON.parse(JSON.stringify(initialSpecializations));
        const activeLocation = nearbyEnabled ? location : manualLocation;
        
        let displayCity = "";
        if (manualLocation) {
            displayCity = manualLocation.city;
        } else if (nearbyEnabled && location) {
            // Placeholder, will be updated by reverse geocoding if possible
            displayCity = "your location";
        }
        setCityName(displayCity);
        
        if (activeLocation) {
             const searchCityTerm = (manualLocation?.city.split(',')[0] || manualCityInput || '').trim().toLowerCase();

            newSpecs.forEach((spec: any) => {
                const originalDoctors = spec.doctors;
                spec.doctors = originalDoctors
                    .filter((doc: any) => {
                        const clinicCity = doc.clinic.toLowerCase();
                        return clinicCity.includes(searchCityTerm);
                    })
                    .map((doc: any) => ({
                        ...doc,
                        distance: getDistance(activeLocation.latitude, activeLocation.longitude, doc.lat, doc.lon),
                    }));
                
                spec.doctors.sort((a: any, b: any) => a.distance - b.distance);
            });
        }
        setSpecializations(newSpecs);
        setLoadingCity(false);
    };

    if ((nearbyEnabled && location) || manualLocation) {
      setLoadingCity(true);
      processLocation();
    } else if (!nearbyEnabled && !manualLocation) {
        let newSpecs = JSON.parse(JSON.stringify(initialSpecializations));
        newSpecs.forEach((spec: any) => {
          spec.doctors.forEach((doc: any) => delete doc.distance);
        });
        setSpecializations(newSpecs);
        setCityName(null);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nearbyEnabled, location, manualLocation]);


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
                    <Button type="button" onClick={handleManualSearch} disabled={!manualCityInput.trim() || nearbyEnabled}>
                        <Search className="h-4 w-4"/>
                    </Button>
                </div>
            </div>
             {(nearbyEnabled || manualLocation) && (
                <div className="text-xs text-muted-foreground flex items-center justify-center gap-1 h-4">
                    {loadingLocation || loadingCity ? (
                        <>
                            <MapPin className="h-3 w-3 animate-pulse" />
                            <span>Finding doctors...</span>
                        </>
                    ) : cityName ? (
                        <>
                            <MapPin className="h-3 w-3 text-primary" />
                            <span>Showing doctors for {cityName.split(',')[0]}</span>
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
                  const imageWidth = avatarData ? avatarData.width : 150;
                  const imageHeight = avatarData ? avatarData.height : 150;
                  return (
                    <div key={doc.name} className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <Image
                          src={avatarSrc}
                          alt={`Portrait of ${doc.name}`}
                          width={imageWidth}
                          height={imageHeight}
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
