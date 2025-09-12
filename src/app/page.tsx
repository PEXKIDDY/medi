import DoctorFlowchart from '@/components/doctor-flowchart';

export default function Home() {
  return (
    <div className="flex min-h-[calc(100vh-68px)] flex-col items-center justify-center bg-background">
      <DoctorFlowchart />
    </div>
  );
}
