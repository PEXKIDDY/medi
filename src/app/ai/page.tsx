"use client";

import { useState } from 'react';
import FileUpload from '@/components/file-upload';
import AnalysisResult from '@/components/analysis-result';
import { AnalyzeDocumentOutput } from '@/app/ai/flows/analyze-document-flow';

export default function AIPage() {
  const [analysisResult, setAnalysisResult] = useState<AnalyzeDocumentOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="flex min-h-[calc(100vh-68px)] flex-col items-center bg-background py-8">
      <div className="w-full max-w-2xl p-4 md:p-8 space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight">AI Analysis</h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Upload a medical document for analysis.
          </p>
        </div>
        <FileUpload 
          onAnalysisComplete={setAnalysisResult}
          onLoadingStateChange={setIsLoading}
        />
        {isLoading && (
          <div className="flex items-center justify-center pt-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="ml-4 text-muted-foreground">Analyzing document...</p>
          </div>
        )}
        {analysisResult && <AnalysisResult result={analysisResult} />}
      </div>
    </div>
  );
}
