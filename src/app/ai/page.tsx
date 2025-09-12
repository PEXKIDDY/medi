import FileUpload from '@/components/file-upload';

export default function AIPage() {
  return (
    <div className="flex min-h-[calc(100vh-68px)] flex-col items-center justify-center bg-background">
      <div className="w-full max-w-2xl p-4 md:p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight">AI Analysis</h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Upload a medical document for analysis.
          </p>
        </div>
        <FileUpload />
      </div>
    </div>
  );
}
