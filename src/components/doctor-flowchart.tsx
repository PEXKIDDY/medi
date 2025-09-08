import { User, Stethoscope, Heart, Brain, Bone } from 'lucide-react';

const specializations = [
  {
    name: 'Cardiology',
    icon: <Heart className="h-8 w-8 text-red-500" />,
    doctors: [
      { name: 'Dr. Evelyn Reed', avatar: 'ER' },
      { name: 'Dr. Samuel Cruz', avatar: 'SC' },
    ],
  },
  {
    name: 'Neurology',
    icon: <Brain className="h-8 w-8 text-purple-500" />,
    doctors: [
      { name: 'Dr. Eleanor Vance', avatar: 'EV' },
      { name: 'Dr. Marcus Thorne', avatar: 'MT' },
    ],
  },
  {
    name: 'Orthopedics',
    icon: <Bone className="h-8 w-8 text-gray-500" />,
    doctors: [
      { name: 'Dr. Clara Oswald', avatar: 'CO' },
      { name: 'Dr. Julian Bashir', avatar: 'JB' },
    ],
  },
];

export default function DoctorFlowchart() {
  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex items-center justify-center flex-col">
        <div className="bg-primary text-primary-foreground rounded-full p-4">
          <Stethoscope className="h-12 w-12" />
        </div>
        <h2 className="text-2xl font-bold mt-4">Medical Specialists</h2>
      </div>

      <div className="w-full flex justify-center mt-8 relative">
        <div className="absolute top-0 h-1/2 w-px bg-border -mt-8"></div>
      </div>

      <div className="flex justify-around w-full max-w-4xl mt-8">
        {specializations.map((spec, index) => (
          <div key={index} className="flex flex-col items-center relative">
            <div className="absolute -top-8 h-8 w-px bg-border"></div>
            <div className="w-1/2 absolute -top-8 h-px bg-border left-1/2"></div>
            {index !== 0 && <div className="w-full absolute -top-8 h-px bg-border right-1/2"></div>}
            
            <div className="bg-card border rounded-lg p-4 flex flex-col items-center shadow-md">
              {spec.icon}
              <h3 className="text-lg font-semibold mt-2">{spec.name}</h3>
            </div>
            
            <div className="absolute top-full h-8 w-px bg-border"></div>

            <div className="flex flex-col items-center mt-16 space-y-4">
              {spec.doctors.map((doc) => (
                <div key={doc.name} className="flex flex-col items-center relative">
                   <div className="absolute -top-8 h-8 w-px bg-border"></div>
                  <div className="bg-card border rounded-lg p-3 flex items-center gap-3 shadow-sm">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center font-bold text-muted-foreground">
                      {doc.avatar}
                    </div>
                    <span className="font-medium">{doc.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
