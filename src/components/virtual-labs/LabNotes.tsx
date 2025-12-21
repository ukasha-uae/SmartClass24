'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useLabNotes } from '@/stores/lab-notes-store';
import { BookOpen, Save, Trash2, Clock, FileText, Printer, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

interface LabNotesProps {
  labId: string;
  labTitle: string;
}

export function LabNotes({ labId, labTitle }: LabNotesProps) {
  const { saveNote, getNote, deleteNote } = useLabNotes();
  const { toast } = useToast();
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const existingNote = getNote(labId);
    if (existingNote) {
      setContent(existingNote.content);
    }
  }, [labId, getNote]);

  const handleSave = () => {
    setIsSaving(true);
    saveNote(labId, content);
    
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: '📝 Notes Saved!',
        description: 'Your lab observations have been saved successfully.',
      });
    }, 500);
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete your notes for this lab?')) {
      deleteNote(labId);
      setContent('');
      toast({
        title: '🗑️ Notes Deleted',
        description: 'Your lab notes have been removed.',
        variant: 'destructive',
      });
    }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '', 'width=800,height=600');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>${labTitle} - Lab Notes</title>
            <style>
              body { 
                font-family: Arial, sans-serif; 
                padding: 40px;
                max-width: 800px;
                margin: 0 auto;
                line-height: 1.6;
              }
              h1 { 
                color: #7c3aed; 
                border-bottom: 2px solid #7c3aed;
                padding-bottom: 10px;
              }
              .date { 
                color: #666; 
                font-size: 14px;
                margin-bottom: 20px;
              }
              .content { 
                white-space: pre-wrap;
                background: #f9f9f9;
                padding: 20px;
                border-radius: 8px;
                border: 1px solid #ddd;
              }
              .footer {
                margin-top: 40px;
                padding-top: 20px;
                border-top: 1px solid #ddd;
                font-size: 12px;
                color: #666;
              }
              .handwriting-reminder {
                background: #fef3c7;
                border: 2px solid #f59e0b;
                padding: 15px;
                margin-top: 20px;
                border-radius: 8px;
              }
              @media print {
                body { padding: 20px; }
              }
            </style>
          </head>
          <body>
            <h1>📝 ${labTitle}</h1>
            <div class="date">Saved: ${lastModified || new Date().toLocaleString()}</div>
            <div class="content">${content}</div>
            <div class="handwriting-reminder">
              <strong>✍️ Exam Preparation Reminder:</strong><br/>
              Copy these notes by hand into your notebook to build muscle memory and prepare for written exams!
            </div>
            <div class="footer">
              Generated from SmartJHS Virtual Lab | Keep practicing with pen and paper!
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
      
      toast({
        title: '🖨️ Print Ready!',
        description: 'Copy these notes by hand for exam practice.',
      });
    }
  };

  if (!mounted) {
    return null;
  }

  const existingNote = getNote(labId);
  const lastModified = existingNote?.lastModified
    ? new Date(existingNote.lastModified).toLocaleString()
    : null;

  return (
    <Card className="mt-6 border-2 border-purple-200 dark:border-purple-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-purple-600" />
            <CardTitle className="text-lg">Lab Notes</CardTitle>
          </div>
          {existingNote && (
            <Badge variant="outline" className="text-xs">
              <Clock className="h-3 w-3 mr-1" />
              {lastModified}
            </Badge>
          )}
        </div>
        <CardDescription>
          Write down your observations, findings, and reflections for {labTitle}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Textarea
            placeholder="Example:&#10;&#10;Observations:&#10;- The limewater turned milky after about 20 seconds&#10;- The reaction was faster than I expected&#10;&#10;Key Learning:&#10;- CO₂ reacts with Ca(OH)₂ to form CaCO₃ precipitate&#10;- Chemical equation: Ca(OH)₂ + CO₂ → CaCO₃ + H₂O&#10;&#10;Questions:&#10;- What happens if we continue bubbling CO₂?&#10;- Can this test detect other gases?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[200px] font-mono text-sm"
          />
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <FileText className="h-3 w-3" />
            {content.length} characters
          </p>
        </div>

        <div className="flex gap-2 flex-wrap">
          <Button 
            onClick={handleSave} 
            disabled={isSaving || !content.trim()}
            className="flex-1 min-w-[120px]"
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save Notes'}
          </Button>

          {existingNote && content.trim() && (
            <Button 
              onClick={handlePrint} 
              variant="outline"
              className="flex-1 min-w-[120px] border-amber-300 text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-950"
            >
              <Printer className="h-4 w-4 mr-2" />
              Print for Practice
            </Button>
          )}
          
          {existingNote && (
            <Button 
              onClick={handleDelete} 
              variant="outline"
              className="text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          )}
        </div>

        <div className="bg-amber-50 dark:bg-amber-950/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
          <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-amber-600" />
            ✍️ Hybrid Study Method (Best of Both Worlds):
          </h4>
          <ul className="text-xs space-y-1 text-muted-foreground">
            <li>• <strong>Digital notes:</strong> Quick capture, never lost, study anywhere</li>
            <li>• <strong>Print & copy by hand:</strong> Builds exam readiness & memory</li>
            <li>• Record observations, equations, and questions here</li>
            <li>• Click "Print for Practice" to get a handwriting-ready version</li>
            <li>• Copying by hand = better retention for written exams! 📝</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
