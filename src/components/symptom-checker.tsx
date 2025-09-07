'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Pill, Search, Siren, Stethoscope } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { getHealthAnalysis, type ConditionWithMedicines } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

const formSchema = z.object({
  symptoms: z.string().min(10, {
    message: 'Please describe your symptoms in at least 10 characters.',
  }),
});

export function SymptomChecker() {
    const [isLoading, setIsLoading] = useState(false);
    const [results, setResults] = useState<ConditionWithMedicines[]>([]);
    const [showInitial, setShowInitial] = useState(true);
    const { toast } = useToast();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          symptoms: '',
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        setShowInitial(false);
        setResults([]);
        const response = await getHealthAnalysis(values.symptoms);

        if ('error' in response) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: response.error,
            });
        } else if (response.length === 0) {
            toast({
                title: 'No conditions found',
                description: "We couldn't match your symptoms to any common conditions. Please try describing them differently or consult a healthcare professional.",
            });
        }
        else {
            setResults(response);
        }
        setIsLoading(false);
    }
    
    return (
      <div className="w-full max-w-4xl mx-auto">
        <Card className="shadow-lg animate-in fade-in duration-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Search className="text-primary-foreground bg-primary p-1 rounded-md" />
              Symptom Checker
            </CardTitle>
            <CardDescription>
              Describe your symptoms below, and our AI will suggest potential conditions and over-the-counter remedies. This tool is not a substitute for professional medical advice.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="symptoms"
                  render={({ field }) => (
                    <FormItem>
                      <Textarea
                        placeholder="e.g., 'I have a sore throat, a runny nose, and I've been coughing for two days...'"
                        className="min-h-[100px] resize-none text-base"
                        {...field}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading} size="lg" className="w-full sm:w-auto">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    'Check Symptoms'
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div className="mt-8">
          {isLoading && (
            <div className="space-y-4">
                <h2 className="text-2xl font-bold">
                    <Skeleton className="h-8 w-80" />
                </h2>
                <div className="border rounded-lg">
                    <div className="flex items-center justify-between p-4">
                        <Skeleton className="h-6 w-1/3" />
                        <Skeleton className="h-4 w-4" />
                    </div>
                </div>
                <div className="border rounded-lg">
                    <div className="flex items-center justify-between p-4">
                        <Skeleton className="h-6 w-1/4" />
                        <Skeleton className="h-4 w-4" />
                    </div>
                </div>
            </div>
          )}

          {!isLoading && results.length > 0 && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <h2 className="text-2xl font-bold">Potential Conditions & Remedies</h2>
              <Accordion type="single" collapsible className="w-full" defaultValue={results[0]?.condition}>
                {results.map(({ condition, medicines }) => (
                  <AccordionItem value={condition} key={condition}>
                    <AccordionTrigger className="text-xl font-semibold hover:no-underline rounded-md p-3 hover:bg-accent/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-accent/20 rounded-full">
                           <Stethoscope className="h-6 w-6 text-accent-foreground" />
                        </div>
                        {condition}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-4 pl-2">
                      {medicines.length > 0 ? (
                        <div className="space-y-4">
                          {medicines.map((med) => (
                            <Card key={med.name} className="bg-card/70">
                              <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                  <Pill className="text-primary-foreground bg-primary rounded-full p-1" />
                                  {med.name}
                                </CardTitle>
                                <CardDescription className="italic pt-1 text-foreground">
                                  {med.reasoning}
                                </CardDescription>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                <div>
                                  <h4 className="font-semibold mb-2">Dosage</h4>
                                  <p className="text-sm text-muted-foreground">{med.dosage}</p>
                                </div>
                                <Separator />
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                      <h4 className="font-semibold mb-2">Side Effects</h4>
                                      <div className="flex flex-wrap gap-2">
                                        {med.sideEffects.map((effect) => (
                                          <Badge key={effect} variant="secondary">{effect}</Badge>
                                        ))}
                                      </div>
                                    </div>
                                    <div>
                                      <h4 className="font-semibold mb-2">Available Brands</h4>
                                      <div className="flex flex-wrap gap-2">
                                        {med.brands.map((brand) => (
                                          <Badge key={brand}>{brand}</Badge>
                                        ))}
                                      </div>
                                    </div>
                                </div>
                                {med.contraindications.length > 0 && (
                                    <>
                                    <Separator />
                                    <div>
                                        <h4 className="font-semibold mb-2 flex items-center gap-2 text-destructive">
                                            <Siren className="h-4 w-4" />
                                            Contraindications
                                        </h4>
                                        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                                            {med.contraindications.map((c) => (
                                                <li key={c}>{c}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    </>
                                )}
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground text-center py-4">
                          No specific over-the-counter medicines found for this condition. Please consult a healthcare professional.
                        </p>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          )}

          {showInitial && !isLoading && results.length === 0 && (
              <div className="text-center py-16 text-muted-foreground animate-in fade-in duration-500">
                  <Stethoscope className="mx-auto h-12 w-12 mb-4" />
                  <h3 className="text-lg font-semibold">Your results will appear here.</h3>
                  <p>Enter your symptoms above to get started.</p>
              </div>
          )}
        </div>
      </div>
    );
}
