import { Stethoscope, Heart, Brain, Bone, Baby, Hand } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const specializations = [
  {
    name: 'Cardiology',
    icon: <Heart className="h-8 w-8 text-red-500" />,
    doctors: [
      { name: 'Dr. Evelyn Reed', avatar: 'ER', clinic: 'Heartbeat Clinic' },
      { name: 'Dr. Samuel Cruz', avatar: 'SC', clinic: 'Vascular Center' },
    ],
  },
  {
    name: 'Neurology',
    icon: <Brain className="h-8 w-8 text-purple-500" />,
    doctors: [
      { name: 'Dr. Eleanor Vance', avatar: 'EV', clinic: 'Mind & Matter' },
      { name: 'Dr. Marcus Thorne', avatar: 'MT', clinic: 'Nerve Center' },
    ],
  },
  {
    name: 'Orthopedics',
    icon: <Bone className="h-8 w-8 text-gray-500" />,
    doctors: [
      { name: 'Dr. Clara Oswald', avatar: 'CO', clinic: 'Joint & Spine' },
      { name: 'Dr. Julian Bashir', avatar: 'JB', clinic: 'Bone Health' },
    ],
  },
  {
    name: 'Dermatology',
    icon: <Hand className="h-8 w-8 text-pink-500" />,
    doctors: [
      { name: 'Dr. Iris West', avatar: 'IW', clinic: 'The Skin Center' },
      { name: 'Dr. Barry Allen', avatar: 'BA', clinic: 'Clear Skin Clinic' },
    ],
  },
  {
    name: 'Pediatrics',
    icon: <Baby className="h-8 w-8 text-blue-500" />,
    doctors: [
      { name: 'Dr. Leslie Thompkins', avatar: 'LT', clinic: 'KidsCare' },
      { name: 'Dr. Alistair Gordon', avatar: 'AG', clinic: 'Small Wonders' },
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
      { name: 'Dr. John Smith', avatar: 'JS', clinic: 'Smile Bright' },
      { name: 'Dr. Jane Doe', avatar: 'JD', clinic: 'Dental Wellness' },
    ],
  },
];

export default function DoctorFlowchart() {
  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-8">
      <div className="text-center mb-12">
        <div className="inline-block bg-primary text-primary-foreground rounded-full p-4 mb-4">
          <Stethoscope className="h-12 w-12" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight">Our Medical Specialists</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Find the right expert for your healthcare needs from our team of dedicated professionals.
        </p>
      </div>

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
                {spec.doctors.map((doc) => (
                  <div key={doc.name} className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={`https://i.pravatar.cc/150?u=${doc.avatar}`} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {doc.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-grow">
                      <p className="font-semibold text-lg">{doc.name}</p>
                      <p className="text-sm text-muted-foreground">{doc.clinic}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}