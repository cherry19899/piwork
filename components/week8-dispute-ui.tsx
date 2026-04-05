'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AlertCircle, FileUp, X } from 'lucide-react';

export function Week8DisputeForm({ taskId, onSubmit }) {
  const [reason, setReason] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await onSubmit({ taskId, reason, files });
      setReason('');
      setFiles([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-card border-border p-6 max-w-md mx-auto">
      <div className="flex items-start gap-3 mb-4">
        <AlertCircle className="w-5 h-5 text-accent flex-shrink-0 mt-1" />
        <h2 className="text-lg font-bold text-foreground">Open Dispute</h2>
      </div>
      
      <textarea
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder="Describe the issue..."
        className="w-full bg-input text-foreground border border-border rounded-lg p-3 mb-4 text-sm"
        rows={4}
      />

      <div className="mb-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <FileUp className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Attach evidence (max 5MB each)</span>
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
        {files.map((file, idx) => (
          <div key={idx} className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
            <span>{file.name}</span>
            <button onClick={() => setFiles(files.filter((_, i) => i !== idx))}>
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>

      <Button
        onClick={handleSubmit}
        disabled={!reason.trim() || loading}
        className="w-full bg-accent text-accent-foreground"
      >
        {loading ? 'Submitting...' : 'Open Dispute'}
      </Button>
    </Card>
  );
}
