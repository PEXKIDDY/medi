import { Bell } from 'lucide-react';

export default function RemindersPage() {
  return (
    <div className="flex min-h-[calc(100vh-68px)] flex-col items-center justify-center bg-background py-8">
      <div className="w-full max-w-4xl p-4 md:p-8 text-center space-y-6">
        <div className="inline-block bg-primary text-primary-foreground rounded-full p-4">
            <Bell className="h-12 w-12" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight">Medication Reminders</h1>
        <p className="text-muted-foreground text-lg">
          Stay on top of your schedule. This feature is coming soon!
        </p>
      </div>
    </div>
  );
}
