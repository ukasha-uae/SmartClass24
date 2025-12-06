'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFirebase } from '@/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { Upload, Link as LinkIcon, Trash2, Loader2, Image as ImageIcon, Video, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export type MediaType = 'image' | 'video' | 'youtube' | 'file';

export interface Media {
  type: MediaType;
  url: string;
  caption?: string;
  fileName?: string;
}

type MediaUploaderProps = {
  media?: Media;
  onChange: (media: Media | undefined) => void;
  allowedTypes?: MediaType[];
  label?: string;
};

export default function MediaUploader({ 
  media, 
  onChange, 
  allowedTypes = ['image', 'video', 'youtube', 'file'],
  label = 'Add Media'
}: MediaUploaderProps) {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [inputMode, setInputMode] = useState<'upload' | 'url'>('url');
  const { storage } = useFirebase();
  const { toast } = useToast();

  const handleFileUpload = async (file: File) => {
    if (!storage) {
      toast({
        title: 'Error',
        description: 'Storage not initialized',
        variant: 'destructive'
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    const fileExtension = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExtension}`;
    const storageRef = ref(storage, `course-media/${fileName}`);

    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(Math.round(progress));
      },
      (error) => {
        console.error('Upload error:', error);
        toast({
          title: 'Upload Failed',
          description: error.message,
          variant: 'destructive'
        });
        setIsUploading(false);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        
        let mediaType: MediaType = 'file';
        if (file.type.startsWith('image/')) mediaType = 'image';
        else if (file.type.startsWith('video/')) mediaType = 'video';

        onChange({
          type: mediaType,
          url: downloadURL,
          fileName: file.name
        });

        setIsUploading(false);
        setUploadProgress(0);
        toast({
          title: 'Upload Successful',
          description: 'Media uploaded successfully'
        });
      }
    );
  };

  const handleUrlSubmit = () => {
    if (!urlInput.trim()) return;

    let mediaType: MediaType = 'image';
    
    // Detect YouTube
    if (urlInput.includes('youtube.com') || urlInput.includes('youtu.be')) {
      mediaType = 'youtube';
    }
    // Detect video extensions
    else if (/\.(mp4|webm|ogg|mov)$/i.test(urlInput)) {
      mediaType = 'video';
    }
    // Detect image extensions
    else if (/\.(jpg|jpeg|png|gif|webp|svg)$/i.test(urlInput)) {
      mediaType = 'image';
    }

    onChange({
      type: mediaType,
      url: urlInput
    });

    setUrlInput('');
    toast({
      title: 'Media Added',
      description: 'Media link added successfully'
    });
  };

  const extractYouTubeId = (url: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/,
      /youtube\.com\/embed\/([^&\s]+)/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  const getMediaIcon = (type: MediaType) => {
    switch (type) {
      case 'image': return <ImageIcon className="h-4 w-4" />;
      case 'video':
      case 'youtube': return <Video className="h-4 w-4" />;
      case 'file': return <FileText className="h-4 w-4" />;
    }
  };

  if (media) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getMediaIcon(media.type)}
                <span className="text-sm font-medium capitalize">{media.type}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onChange(undefined)}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>

            {/* Preview */}
            <div className="border rounded-lg overflow-hidden bg-muted">
              {media.type === 'image' && (
                <img 
                  src={media.url} 
                  alt={media.caption || 'Preview'} 
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23ddd" width="200" height="200"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999"%3EImage%3C/text%3E%3C/svg%3E';
                  }}
                />
              )}
              {media.type === 'youtube' && extractYouTubeId(media.url) && (
                <iframe
                  width="100%"
                  height="200"
                  src={`https://www.youtube.com/embed/${extractYouTubeId(media.url)}`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )}
              {media.type === 'video' && (
                <video 
                  src={media.url} 
                  controls 
                  className="w-full h-48"
                />
              )}
              {media.type === 'file' && (
                <div className="p-8 text-center">
                  <FileText className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">{media.fileName || 'File'}</p>
                </div>
              )}
            </div>

            {/* Caption */}
            <div>
              <Label className="text-xs">Caption (optional)</Label>
              <Input
                value={media.caption || ''}
                onChange={(e) => onChange({ ...media, caption: e.target.value })}
                placeholder="Add a caption..."
                className="text-sm"
              />
            </div>

            <p className="text-xs text-muted-foreground break-all">
              URL: {media.url}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-dashed">
      <CardContent className="p-4">
        <div className="space-y-4">
          <Label>{label}</Label>
          
          {/* Toggle between upload and URL */}
          <div className="flex gap-2">
            <Button
              type="button"
              variant={inputMode === 'url' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setInputMode('url')}
              className="flex-1"
            >
              <LinkIcon className="h-4 w-4 mr-2" />
              URL/Link
            </Button>
            <Button
              type="button"
              variant={inputMode === 'upload' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setInputMode('upload')}
              className="flex-1"
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload File
            </Button>
          </div>

          {inputMode === 'url' ? (
            <div className="space-y-2">
              <Input
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="Paste image URL, YouTube link, etc..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleUrlSubmit();
                  }
                }}
              />
              <Button
                type="button"
                onClick={handleUrlSubmit}
                disabled={!urlInput.trim()}
                size="sm"
                className="w-full"
              >
                Add Link
              </Button>
              <p className="text-xs text-muted-foreground">
                Supports: Image URLs, YouTube, Video links
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-colors">
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  accept="image/*,video/*,.pdf,.doc,.docx"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(file);
                  }}
                  disabled={isUploading}
                />
                <label 
                  htmlFor="file-upload" 
                  className="cursor-pointer"
                >
                  {isUploading ? (
                    <div className="space-y-2">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                      <p className="text-sm">Uploading... {uploadProgress}%</p>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                      <p className="text-sm font-medium">Click to upload</p>
                      <p className="text-xs text-muted-foreground">
                        Images, videos, or documents
                      </p>
                    </div>
                  )}
                </label>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
