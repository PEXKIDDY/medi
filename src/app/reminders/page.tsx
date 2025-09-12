import RemindersDashboard from '@/components/reminders-dashboard';

export default function RemindersPage() {
  return (
    <div className="flex min-h-[calc(100vh-68px)] flex-col items-center bg-background py-8">
      <div className="w-full max-w-6xl p-4 md:p-8">
        <RemindersDashboard />
      </div>
    </div>
  );
}
