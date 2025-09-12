"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from 'lucide-react';


export default function FileUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
        if(selectedFile.size > 5 * 1024 * 1024){
            setError("File size cannot exceed 5MB.");
            setFile(null)
        } else {
            setFile(selectedFile);
            setError(null);
        }
    }
  };

  const handleUpload = () => {
    if (!file) {
      setError('Please select a file to upload.');
      return;
    }
    // TODO: Implement file upload logic here
    console.log('Uploading file:', file.name);
    setError(null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Document</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}
        <div className="flex flex-col items-center justify-center w-full p-6 border-2 border-dashed rounded-lg">
            <Upload className="w-12 h-12 text-muted-foreground" />
            <Input id="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".pdf,.png,.jpg,.jpeg,.txt" />
            <label htmlFor="file-upload" className="mt-4 text-sm font-medium text-primary underline cursor-pointer">
                Choose a file
            </label>
            <p className="mt-1 text-xs text-muted-foreground">
                {file ? file.name : 'PDF, PNG, JPG, or TXT up to 5MB'}
            </p>
        </div>
        
        <Button onClick={handleUpload} className="w-full">
          Analyze Document
        </Button>
      </CardContent>
    </Card>
  );
}
