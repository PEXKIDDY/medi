"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, FileText, AlertCircle, Pill } from 'lucide-react';
import { getMedicationInfo, GetMedicationInfoOutput } from '@/app/ai/flows/get-medication-info-flow';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

export default function MediInfoPage() {
    const [medicationName, setMedicationName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<GetMedicationInfoOutput | null>(null);
    const [error, setError] = useState<string | null>(null);

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
            setResult(info);
        } catch (e: any) {
            setError(`An error occurred: ${e.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-[calc(100vh-68px)] flex-col items-center bg-background py-8">
            <div className="w-full max-w-2xl p-4 md:p-8 space-y-8">
                <div className="text-center">
                    <h1 className="text-4xl font-bold tracking-tight">Medication Information</h1>
                    <p className="text-muted-foreground mt-2 text-lg">
                        Search for any medication to get detailed information.
                    </p>
                </div>

                <div className="flex w-full items-center space-x-2">
                    <Input
                        type="text"
                        placeholder="e.g., Lisinopril"
                        value={medicationName}
                        onChange={(e) => setMedicationName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        disabled={isLoading}
                    />
                    <Button onClick={handleSearch} disabled={isLoading}>
                        {isLoading ? <Loader2 className="animate-spin" /> : 'Search'}
                    </Button>
                </div>

                {error && (
                     <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {isLoading && !result && (
                    <div className="flex items-center justify-center pt-8">
                        <Loader2 className="h-12 w-12 animate-spin text-primary" />
                        <p className="ml-4 text-muted-foreground">Fetching information...</p>
                    </div>
                )}

                {result && (
                    <Card>
                        <CardHeader>
                             <div className="flex items-center gap-4">
                                <div className="bg-primary text-primary-foreground p-3 rounded-full">
                                    <FileText className="h-6 w-6" />
                                </div>
                                <div>
                                    <CardTitle>{medicationName}</CardTitle>
                                    <CardDescription>Information about this medication.</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h3 className="font-semibold text-lg mb-2">Primary Use</h3>
                                <p className="text-sm text-muted-foreground">{result.primaryUse}</p>
                            </div>
                             <div>
                                <h3 className="font-semibold text-lg mb-2">How It Works</h3>
                                <p className="text-sm text-muted-foreground">{result.howItWorks}</p>
                            </div>
                             <div>
                                <h3 className="font-semibold text-lg mb-2 flex items-center gap-2"><Pill/> Common Side Effects</h3>
                                <div className="text-sm text-muted-foreground whitespace-pre-wrap">{result.commonSideEffects}</div>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
