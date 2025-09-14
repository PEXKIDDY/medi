"use client";

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { User, Phone, Calendar, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';

const profileSchema = z.object({
    name: z.string().min(1, "Name is required."),
    phone: z.string().min(10, "A valid phone number is required.").regex(/^\+?[0-9\s-()]+$/, "Invalid phone number format."),
    age: z.coerce.number().min(1, "Age is required.").max(120, "Please enter a valid age."),
    emergencyContact: z.string().min(10, "A valid emergency contact number is required.").regex(/^\+?[0-9\s-()]+$/, "Invalid phone number format."),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
    const [isSaving, setIsSaving] = useState(false);
    const { toast } = useToast();
    const { register, handleSubmit, formState: { errors }, reset } = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: '',
            phone: '',
            age: undefined,
            emergencyContact: '',
        }
    });

    useEffect(() => {
        // Load saved data from localStorage when the component mounts
        const savedData = localStorage.getItem('userProfile');
        if (savedData) {
            reset(JSON.parse(savedData));
        }
    }, [reset]);

    const onSubmit = (data: ProfileFormValues) => {
        setIsSaving(true);
        console.log("Profile data:", data);

        // Simulate saving data
        setTimeout(() => {
            localStorage.setItem('userProfile', JSON.stringify(data));
            setIsSaving(false);
            toast({
                title: "Profile Saved",
                description: "Your information has been successfully updated.",
            });
        }, 1500);
    };

    return (
        <>
            <div className="flex min-h-[calc(100vh-68px)] flex-col items-center bg-background py-8">
                <div className="w-full max-w-2xl p-4 md:p-8 space-y-8">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold tracking-tight">Your Profile</h1>
                        <p className="text-muted-foreground mt-2 text-lg">
                            Keep your personal and emergency information up to date.
                        </p>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Personal Information</CardTitle>
                            <CardDescription>This information will be used to assist you in case of an emergency.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="flex items-center gap-2"><User /> Name</Label>
                                    <Input id="name" {...register('name')} placeholder="e.g., John Doe" />
                                    {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="phone" className="flex items-center gap-2"><Phone /> Phone Number</Label>
                                    <Input id="phone" type="tel" {...register('phone')} placeholder="e.g., (123) 456-7890" />
                                    {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="age" className="flex items-center gap-2"><Calendar /> Age</Label>
                                    <Input id="age" type="number" {...register('age')} placeholder="e.g., 35" />
                                    {errors.age && <p className="text-sm text-destructive">{errors.age.message}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="emergencyContact" className="flex items-center gap-2"><Shield /> Emergency Contact</Label>
                                    <Input id="emergencyContact" type="tel" {...register('emergencyContact')} placeholder="e.g., (098) 765-4321" />
                                    {errors.emergencyContact && <p className="text-sm text-destructive">{errors.emergencyContact.message}</p>}
                                </div>

                                <Button type="submit" className="w-full" disabled={isSaving}>
                                    {isSaving ? 'Saving...' : 'Save Information'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
            <Toaster />
        </>
    );
}
