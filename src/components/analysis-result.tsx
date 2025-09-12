"use client";
import type { AnalyzeDocumentOutput } from '@/app/ai/flows/analyze-document-flow';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Stethoscope, Pill, Calendar, User } from 'lucide-react';

interface AnalysisResultProps {
  result: AnalyzeDocumentOutput;
}

export default function AnalysisResult({ result }: AnalysisResultProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center gap-4">
          <div className="bg-primary text-primary-foreground p-3 rounded-full">
            <Stethoscope className="h-6 w-6" />
          </div>
          <div>
            <CardTitle>Analysis Complete</CardTitle>
            <CardDescription>Here is the extracted information from your document.</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-semibold text-lg mb-2">Summary</h3>
          <p className="text-muted-foreground">{result.summary}</p>
        </div>

        {(result.doctor || result.date) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {result.doctor && (
                    <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <strong>Doctor:</strong>
                        <span>{result.doctor}</span>
                    </div>
                )}
                {result.date && (
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <strong>Date:</strong>
                        <span>{result.date}</span>
                    </div>
                )}
            </div>
        )}

        {result.prescriptions && result.prescriptions.length > 0 ? (
          <div>
            <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
              <Pill className="h-5 w-5" />
              Prescriptions
            </h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Medication</TableHead>
                  <TableHead>Dosage</TableHead>
                  <TableHead>Frequency</TableHead>
                  <TableHead>Instructions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {result.prescriptions.map((p, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{p.medication}</TableCell>
                    <TableCell>{p.dosage}</TableCell>
                    <TableCell>{p.frequency}</TableCell>
                    <TableCell>{p.instructions || 'N/A'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-4">
            <p>No prescription information was found in this document.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
