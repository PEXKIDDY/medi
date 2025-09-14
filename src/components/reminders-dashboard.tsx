"use client";

import { useState, useEffect, useRef } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Pill, Calendar, GlassWater, PlusCircle, Trash2, BellRing, BellOff } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Switch } from '@/components/ui/switch';


// Schemas for form validation
const medicationSchema = z.object({
  name: z.string().min(1, "Medication name is required."),
  dosage: z.string().min(1, "Dosage is required."),
  time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:MM).")
});

const appointmentSchema = z.object({
  doctor: z.string().min(1, "Doctor name is required."),
  specialization: z.string().min(1, "Specialization is required."),
  location: z.string().min(1, "Location is required."),
  dateTime: z.string().min(1, "Date and time are required.")
});

const hydrationSchema = z.object({
  amount: z.string().min(1, "Amount is required (e.g., 250ml)."),
  time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:MM).")
});

type Medication = z.infer<typeof medicationSchema> & { id: number; taken: boolean };
type Appointment = z.infer<typeof appointmentSchema> & { id: number };
type Hydration = z.infer<typeof hydrationSchema> & { id: number; taken: boolean };
type ActiveAlarm = { type: 'med' | 'hydro', id: number, name: string } | null;


export default function RemindersDashboard() {
  const [medications, setMedications] = useState<Medication[]>([
    { id: 1, name: 'Lisinopril', dosage: '10mg', time: '08:00', taken: true },
    { id: 2, name: 'Metformin', dosage: '500mg', time: '20:00', taken: false },
  ]);
  const [appointments, setAppointments] = useState<Appointment[]>([
    { id: 1, doctor: 'Dr. Evelyn Reed', specialization: 'Cardiology', location: 'Heartbeat Clinic', dateTime: '2024-08-15T10:30' },
  ]);
  const [hydration, setHydration] = useState<Hydration[]>([
     { id: 1, amount: '250ml', time: '09:00', taken: true },
     { id: 2, amount: '250ml', time: '11:00', taken: false },
     { id: 3, amount: '250ml', time: '13:00', taken: false },
  ]);

  const { register: medRegister, handleSubmit: handleMedSubmit, reset: medReset, formState: { errors: medErrors } } = useForm({ resolver: zodResolver(medicationSchema) });
  const { register: apptRegister, handleSubmit: handleApptSubmit, reset: apptReset, formState: { errors: apptErrors } } = useForm({ resolver: zodResolver(appointmentSchema) });
  const { register: hydroRegister, handleSubmit: handleHydroSubmit, reset: hydroReset, formState: { errors: hydroErrors } } = useForm({ resolver: zodResolver(hydrationSchema) });
  
  const [isMedDialogOpen, setMedDialogOpen] = useState(false);
  const [isApptDialogOpen, setApptDialogOpen] = useState(false);
  const [isHydroDialogOpen, setHydroDialogOpen] = useState(false);
  const [activeAlarm, setActiveAlarm] = useState<ActiveAlarm>(null);
  const [alarmsEnabled, setAlarmsEnabled] = useState(true);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize Audio on client
    if (typeof window !== 'undefined') {
        audioRef.current = new Audio('https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg');
        audioRef.current.loop = true;
    }

    const checkReminders = () => {
        if (!alarmsEnabled || activeAlarm) return; // Don't check for new alarms if disabled or one is already active

        const now = new Date();
        const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        
        const dueMedication = medications.find(m => m.time === currentTime && !m.taken);
        if (dueMedication) {
            setActiveAlarm({ type: 'med', id: dueMedication.id, name: `${dueMedication.name} (${dueMedication.dosage})` });
            return;
        }

        const dueHydration = hydration.find(h => h.time === currentTime && !h.taken);
        if (dueHydration) {
            setActiveAlarm({ type: 'hydro', id: dueHydration.id, name: `${dueHydration.amount} of water` });
            return;
        }
    };
    
    // Check every minute
    const intervalId = setInterval(checkReminders, 60000);

    return () => clearInterval(intervalId);
  }, [medications, hydration, activeAlarm, alarmsEnabled]);
  
  useEffect(() => {
    const audio = audioRef.current;
    if (activeAlarm && audio) {
        audio.play().catch(e => console.error("Audio playback failed:", e));
    } else if (audio) {
        audio.pause();
        audio.currentTime = 0;
    }
    
    return () => {
        if (audio) {
            audio.pause();
            audio.currentTime = 0;
        }
    }
  }, [activeAlarm]);


  const addMedication = (data: z.infer<typeof medicationSchema>) => {
    setMedications([...medications, { ...data, id: Date.now(), taken: false }]);
    medReset();
    setMedDialogOpen(false);
  };

  const addAppointment = (data: z.infer<typeof appointmentSchema>) => {
    setAppointments([...appointments, { ...data, id: Date.now() }]);
    apptReset();
    setApptDialogOpen(false);
  };
  
  const addHydration = (data: z.infer<typeof hydrationSchema>) => {
    setHydration([...hydration, { ...data, id: Date.now(), taken: false }]);
    hydroReset();
    setHydroDialogOpen(false);
  };
  
  const toggleTaken = (id: number, type: 'med' | 'hydro') => {
    if (type === 'med') {
      setMedications(medications.map(m => m.id === id ? { ...m, taken: !m.taken } : m));
    } else {
      setHydration(hydration.map(h => h.id === id ? { ...h, taken: !h.taken } : h));
    }
  };
  
  const deleteReminder = (id: number, type: 'med' | 'appt' | 'hydro') => {
    if (type === 'med') setMedications(medications.filter(m => m.id !== id));
    if (type === 'appt') setAppointments(appointments.filter(a => a.id !== id));
    if (type === 'hydro') setHydration(hydration.filter(h => h.id !== id));
  }
  
  const handleAlarmAction = (markAsTaken: boolean) => {
    if (activeAlarm) {
        if (markAsTaken) {
            toggleTaken(activeAlarm.id, activeAlarm.type);
        }
        setActiveAlarm(null);
    }
  }


  return (
    <div className="space-y-6">
      <div className="text-center relative">
        <h1 className="text-4xl font-bold tracking-tight">Your Reminders</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Stay organized and on top of your health schedule.
        </p>
        <div className="absolute top-0 right-0 flex items-center space-x-2">
            {alarmsEnabled ? <BellRing className="text-primary"/> : <BellOff className="text-muted-foreground"/>}
            <Label htmlFor="alarm-switch">Enable Alarms</Label>
            <Switch
                id="alarm-switch"
                checked={alarmsEnabled}
                onCheckedChange={setAlarmsEnabled}
            />
        </div>
      </div>
       {activeAlarm && (
            <AlertDialog open={!!activeAlarm} onOpenChange={() => {}}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2"><BellRing className="text-primary animate-bounce"/>Reminder: It's Time!</AlertDialogTitle>
                        <AlertDialogDescription className="text-lg pt-4">
                            It's time for your reminder: <strong>{activeAlarm.name}</strong>.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => handleAlarmAction(false)}>Dismiss</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleAlarmAction(true)}>Mark as Taken</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        )}
      <Tabs defaultValue="medication" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="medication"><Pill className="mr-2"/>Medication</TabsTrigger>
          <TabsTrigger value="appointments"><Calendar className="mr-2"/>Appointments</TabsTrigger>
          <TabsTrigger value="hydration"><GlassWater className="mr-2"/>Hydration</TabsTrigger>
        </TabsList>
        
        {/* Medication Tab */}
        <TabsContent value="medication">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Medication Schedule</CardTitle>
                  <CardDescription>Don&apos;t miss a dose. Add your medications here.</CardDescription>
                </div>
                <Dialog open={isMedDialogOpen} onOpenChange={setMedDialogOpen}>
                    <DialogTrigger asChild>
                      <Button><PlusCircle className="mr-2"/>Add Medication</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader><DialogTitle>Add New Medication</DialogTitle></DialogHeader>
                        <form onSubmit={handleMedSubmit(addMedication)} className="space-y-4">
                            <div>
                                <Label htmlFor="name">Medication Name</Label>
                                <Input id="name" {...medRegister('name')} />
                                {medErrors.name && <p className="text-destructive text-sm mt-1">{medErrors.name.message}</p>}
                            </div>
                            <div>
                                <Label htmlFor="dosage">Dosage</Label>
                                <Input id="dosage" {...medRegister('dosage')} placeholder="e.g., 1 tablet, 10mg"/>
                                {medErrors.dosage && <p className="text-destructive text-sm mt-1">{medErrors.dosage.message}</p>}
                            </div>
                            <div>
                                <Label htmlFor="time">Time</Label>
                                <Input id="time" type="time" {...medRegister('time')} />
                                {medErrors.time && <p className="text-destructive text-sm mt-1">{medErrors.time.message}</p>}
                            </div>
                            <DialogFooter>
                                <DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose>
                                <Button type="submit">Add Reminder</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {medications.map(med => (
                <div key={med.id} className="flex items-center justify-between p-4 rounded-lg border bg-card">
                  <div className="flex items-center gap-4">
                    <Checkbox id={`med-${med.id}`} checked={med.taken} onCheckedChange={() => toggleTaken(med.id, 'med')} />
                    <Label htmlFor={`med-${med.id}`} className={`text-lg ${med.taken ? 'line-through text-muted-foreground' : ''}`}>
                      <span className="font-semibold">{med.name}</span> ({med.dosage}) - {med.time}
                    </Label>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => deleteReminder(med.id, 'med')}><Trash2 className="text-destructive"/></Button>
                </div>
              ))}
              {medications.length === 0 && <p className="text-muted-foreground text-center">No medication reminders set.</p>}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Appointments Tab */}
        <TabsContent value="appointments">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Upcoming Appointments</CardTitle>
                    <CardDescription>Keep track of your doctor visits.</CardDescription>
                  </div>
                  <Dialog open={isApptDialogOpen} onOpenChange={setApptDialogOpen}>
                      <DialogTrigger asChild>
                        <Button><PlusCircle className="mr-2"/>Add Appointment</Button>
                      </DialogTrigger>
                      <DialogContent>
                          <DialogHeader><DialogTitle>Add New Appointment</DialogTitle></DialogHeader>
                          <form onSubmit={handleApptSubmit(addAppointment)} className="space-y-4">
                              <div>
                                  <Label htmlFor="doctor">Doctor Name</Label>
                                  <Input id="doctor" {...apptRegister('doctor')} />
                                  {apptErrors.doctor && <p className="text-destructive text-sm mt-1">{apptErrors.doctor.message}</p>}
                              </div>
                              <div>
                                  <Label htmlFor="specialization">Specialization</Label>
                                  <Input id="specialization" {...apptRegister('specialization')} />
                                  {apptErrors.specialization && <p className="text-destructive text-sm mt-1">{apptErrors.specialization.message}</p>}
                              </div>
                              <div>
                                  <Label htmlFor="location">Clinic Location</Label>
                                  <Input id="location" {...apptRegister('location')} />
                                  {apptErrors.location && <p className="text-destructive text-sm mt-1">{apptErrors.location.message}</p>}
                              </div>
                              <div>
                                  <Label htmlFor="dateTime">Date & Time</Label>
                                  <Input id="dateTime" type="datetime-local" {...apptRegister('dateTime')} />
                                  {apptErrors.dateTime && <p className="text-destructive text-sm mt-1">{apptErrors.dateTime.message}</p>}
                              </div>
                              <DialogFooter>
                                  <DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose>
                                  <Button type="submit">Add Reminder</Button>
                              </DialogFooter>
                          </form>
                      </DialogContent>
                  </Dialog>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {appointments.map(appt => (
                 <div key={appt.id} className="flex items-center justify-between p-4 rounded-lg border bg-card">
                  <div className="flex items-start gap-4">
                    <Calendar className="mt-1"/>
                    <div>
                      <p className="font-semibold text-lg">{appt.doctor} <span className="text-sm font-medium text-muted-foreground">({appt.specialization})</span></p>
                      <p className="text-muted-foreground">{appt.location}</p>
                      <p className="text-primary font-medium">{new Date(appt.dateTime).toLocaleString()}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => deleteReminder(appt.id, 'appt')}><Trash2 className="text-destructive"/></Button>
                </div>
              ))}
               {appointments.length === 0 && <p className="text-muted-foreground text-center">No appointments scheduled.</p>}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Hydration Tab */}
        <TabsContent value="hydration">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Hydration Tracker</CardTitle>
                    <CardDescription>Remember to drink water throughout the day.</CardDescription>
                  </div>
                  <Dialog open={isHydroDialogOpen} onOpenChange={setHydroDialogOpen}>
                      <DialogTrigger asChild>
                        <Button><PlusCircle className="mr-2"/>Add Water Reminder</Button>
                      </DialogTrigger>
                      <DialogContent>
                          <DialogHeader><DialogTitle>Add Water Reminder</DialogTitle></DialogHeader>
                          <form onSubmit={handleHydroSubmit(addHydration)} className="space-y-4">
                              <div>
                                  <Label htmlFor="amount">Amount</Label>
                                  <Input id="amount" {...hydroRegister('amount')} placeholder="e.g., 250ml, 1 glass" />
                                  {hydroErrors.amount && <p className="text-destructive text-sm mt-1">{hydroErrors.amount.message}</p>}
                              </div>
                              <div>
                                  <Label htmlFor="time-hydro">Time</Label>
                                  <Input id="time-hydro" type="time" {...hydroRegister('time')} />
                                  {hydroErrors.time && <p className="text-destructive text-sm mt-1">{hydroErrors.time.message}</p>}
                              </div>
                              <DialogFooter>
                                  <DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose>
                                  <Button type="submit">Add Reminder</Button>
                              </DialogFooter>
                          </form>
                      </DialogContent>
                  </Dialog>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {hydration.map(hydro => (
                 <div key={hydro.id} className="flex items-center justify-between p-4 rounded-lg border bg-card">
                    <div className="flex items-center gap-4">
                      <Checkbox id={`hydro-${hydro.id}`} checked={hydro.taken} onCheckedChange={() => toggleTaken(hydro.id, 'hydro')} />
                      <Label htmlFor={`hydro-${hydro.id}`} className={`text-lg ${hydro.taken ? 'line-through text-muted-foreground' : ''}`}>
                        <span className="font-semibold">{hydro.amount}</span> of water at {hydro.time}
                      </Label>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => deleteReminder(hydro.id, 'hydro')}><Trash2 className="text-destructive"/></Button>
                </div>
              ))}
               {hydration.length === 0 && <p className="text-muted-foreground text-center">No hydration reminders set.</p>}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
