"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { suggestRemedy } from '@/app/actions';
import type { RemedySuggestion } from '@/ai/remedy-flow';
import { Header } from '@/components/header';

const formSchema = z.object({
  symptoms: z.string().min(3, 'Please describe your symptoms.'),
});

type FormValues = z.infer<typeof formSchema>;

export default function SymptomCheckerPage() {
  const [suggestion, setSuggestion] = useState<RemedySuggestion | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      symptoms: '',
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    setSuggestion(null);
    try {
      const result = await suggestRemedy(values);
      setSuggestion(result);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 md:px-6 lg:py-12">
        <div className="max-w-xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Symptom Checker</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="symptoms"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Describe your symptoms</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., I have a headache and a runny nose." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Thinking...' : 'Get Suggestion'}
                  </Button>
                </form>
              </Form>

              {suggestion && (
                <div className="mt-8">
                  <h3 className="text-lg font-semibold">Suggested Remedy</h3>
                  <p className="mt-2">{suggestion.remedy}</p>

                  {suggestion.products && suggestion.products.length > 0 && (
                     <div className="mt-4">
                        <h4 className="font-semibold">Suggested Products:</h4>
                        <ul className="list-disc pl-5 mt-2">
                           {suggestion.products.map((product, index) => (
                              <li key={index}>{product}</li>
                           ))}
                        </ul>
                     </div>
                  )}

                  <p className="mt-4 text-sm text-muted-foreground">
                    {suggestion.disclaimer}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <footer className="py-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Medi-OSINT. For informational purposes only. Not a substitute for professional medical advice.
      </footer>
    </div>
  );
}
