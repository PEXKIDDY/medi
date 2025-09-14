"use client";

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, FileText, AlertCircle, Pill, Search, Upload, Camera } from 'lucide-react';
import { getMedicationInfo, GetMedicationInfoOutput } from '@/app/ai/flows/get-medication-info-flow';
import { identifyMedicine, IdentifyMedicineOutput } from '@/app/ai/flows/identify-medicine-flow';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';

type Result = {
    medicationName: string;
    info: GetMedicationInfoOutput;
}

export default function MediInfoPage() {
    const [medicationName, setMedicationName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<Result | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);

    const { toast } = useToast();
    const videoRef = useRef<HTMLVideoElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);


    useEffect(() => {
        const getCameraPermission = async () => {
          try {
            const stream = await navigator.mediaDevices.getUserMedia({video: true});
            setHasCameraPermission(true);
    
            if (videoRef.current) {
              videoRef.current.srcObject = stream;
            }
          } catch (error) {
            console.error('Error accessing camera:', error);
            setHasCameraPermission(false);
          }
        };
    
        getCameraPermission();

        return () => {
            if (videoRef.current && videoRef.current.srcObject) {
                const stream = videoRef.current.srcObject as MediaStream;
                stream.getTracks().forEach(track => track.stop());
            }
        }
      }, []);

    const handleSearch = async () => {
        if (!medicationName.trim()) {
            setError("Please enter a medication name.");
            return;
        }
        setIsLoading(true);
        setResult(null);
        setError(null);
        try {
            const info = await getMedicationInfo({ medicationName });
            setResult({ medicationName, info });
        } catch (e: any) {
            setError(`An error occurred: ${e.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleImageAnalysis = async (dataUri: string) => {
        setIsLoading(true);
        setResult(null);
        setError(null);
        setMedicationName('');
        try {
            const result = await identifyMedicine({ imageDataUri: dataUri });
            if (result.medicationName.toLowerCase() === 'unknown') {
                setError("Medicine not found. Please try again.");
            } else {
                setResult({
                    medicationName: result.medicationName,
                    info: {
                        primaryUse: result.primaryUse,
                        howItWorks: result.howItWorks,
                        commonSideEffects: result.commonSideEffects,
                    }
                });
            }
        } catch (e: any) {
            setError(`An analysis error occurred: ${e.message}`);
        } finally {
            setIsLoading(false);
        }
    }

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const dataUri = e.target?.result as string;
                handleImageAnalysis(dataUri);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleScan = () => {
        if (videoRef.current) {
            const canvas = document.createElement('canvas');
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            const context = canvas.getContext('2d');
            if (context) {
                context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
                const dataUri = canvas.toDataURL('image/jpeg');
                handleImageAnalysis(dataUri);
            }
        }
    };

    return (
        <>
        <Toaster />
        <div className="flex min-h-[calc(100vh-68px)] flex-col items-center bg-background py-8">
            <div className="w-full max-w-4xl p-4 md:p-8 space-y-8">
                <div className="text-center">
                    <h1 className="text-4xl font-bold tracking-tight">Medication Information</h1>
                    <p className="text-muted-foreground mt-2 text-lg">
                        Search, scan, or upload an image of any medication to get detailed information.
                    </p>
                </div>
                
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Disclaimer</AlertTitle>
                    <AlertDescription>
                        Please consult with a qualified healthcare professional before taking any medication. This information is for educational purposes only and not a substitute for professional medical advice.
                    </AlertDescription>
                </Alert>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <Card>
                             <CardHeader>
                                <CardTitle className="flex items-center gap-2"><Search/>Search Manually</CardTitle>
                             </CardHeader>
                             <CardContent>
                                <div className="flex w-full items-center space-x-2">
                                    <Input
                                        type="text"
                                        placeholder="e.g., Lisinopril"
                                        value={medicationName}
                                        onChange={(e) => setMedicationName(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                        disabled={isLoading}
                                    />
                                    <Button onClick={handleSearch} disabled={isLoading || !medicationName.trim()}>
                                        {isLoading && !result ? <Loader2 className="animate-spin" /> : 'Search'}
                                    </Button>
                                </div>
                             </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2"><Camera/>Scan or Upload</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className='relative'>
                                    <video ref={videoRef} className="w-full aspect-video rounded-md bg-muted" autoPlay muted playsInline />
                                    {hasCameraPermission === false && (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 rounded-md">
                                            <Camera className="h-12 w-12 text-muted-foreground" />
                                            <p className="text-muted-foreground mt-2">Camera access is required.</p>
                                        </div>
                                    )}
                                </div>

                                { hasCameraPermission === false && (
                                    <Alert variant="destructive">
                                        <AlertTitle>Camera Access Denied</AlertTitle>
                                        <AlertDescription>
                                            Please enable camera permissions in your browser settings to use the scanning feature.
                                        </AlertDescription>
                                    </Alert>
                                )}

                                <div className="flex gap-4">
                                    <Button onClick={handleScan} disabled={isLoading || !hasCameraPermission} className="w-full">
                                        <Camera className="mr-2"/> Scan Medicine
                                    </Button>
                                    <Button onClick={() => fileInputRef.current?.click()} disabled={isLoading} className="w-full" variant="outline">
                                        <Upload className="mr-2"/> Upload Image
                                    </Button>
                                    <Input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                     <div className="space-y-4">
                        {error && (
                             <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Error</AlertTitle>
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        {isLoading && !result && (
                            <div className="flex flex-col items-center justify-center pt-8 h-full rounded-lg border border-dashed">
                                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                                <p className="ml-4 text-muted-foreground mt-4">Fetching information...</p>
                            </div>
                        )}

                        {result && result.info && (
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center gap-4">
                                        <div className="bg-primary text-primary-foreground p-3 rounded-full">
                                            <FileText className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <CardTitle>{result.medicationName}</CardTitle>
                                            <CardDescription>Information about this medication.</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <h3 className="font-semibold text-lg mb-2">Primary Use</h3>
                                        <p className="text-sm text-muted-foreground">{result.info.primaryUse}</p>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg mb-2">How It Works</h3>
                                        <p className="text-sm text-muted-foreground">{result.info.howItWorks}</p>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg mb-2 flex items-center gap-2"><Pill/> Common Side Effects</h3>
                                        <div className="text-sm text-muted-foreground whitespace-pre-wrap">{result.info.commonSideEffects}</div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                        
                        {!isLoading && !result && !error && (
                            <div className="flex flex-col items-center justify-center h-full rounded-lg border border-dashed text-center p-8">
                                <Pill className="h-12 w-12 text-muted-foreground" />
                                <p className="mt-4 text-muted-foreground">Medication information will appear here.</p>
                            </div>
                        )}
                     </div>

                </div>
            </div>
        </div>
        </>
    );
}
