import React, { useEffect, useRef, useState } from 'react';
import { Icon } from '@iconify/react';
import { decodeQRFromImage, scanVideoFrame } from '../../lib/qr-decoder';
import type { DecodedQRResult } from '../../lib/types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onApplyDecodedText: (text: string) => void;
}

export const QRDecoderModal: React.FC<Props> = ({ isOpen, onClose, onApplyDecodedText }) => {
  const [tab, setTab] = useState<'upload' | 'camera'>('upload');
  const [result, setResult] = useState<DecodedQRResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [copied, setCopied] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      setResult(null);
      setError(null);
    }
  }, [isOpen]);

  const stopCamera = () => {
    if (animRef.current) cancelAnimationFrame(animRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setScanning(false);
  };

  const startCamera = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setScanning(true);
        scanLoop();
      }
    } catch {
      setError('Unable to access camera.');
      setScanning(false);
    }
  };

  const scanLoop = () => {
    if (videoRef.current) {
      const found = scanVideoFrame(videoRef.current);
      if (found) {
        setResult(found);
        stopCamera();
        return;
      }
    }
    animRef.current = requestAnimationFrame(scanLoop);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    try {
      const res = await decodeQRFromImage(file);
      setResult(res);
    } catch (err: any) {
      setError(err.message || 'No QR found.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/70 backdrop-blur-xs">
      <div className="neu-card rounded-major max-w-md w-full p-6 space-y-4 border border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon icon="solar:camera-minimalistic-outline" className="h-5 w-5 text-primary" />
            <h3 className="font-heading font-bold text-base text-text-main">Decode QR Code</h3>
          </div>
          <button type="button" onClick={() => { stopCamera(); onClose(); }} className="neu-button h-8 w-8 rounded-control flex items-center justify-center text-text-muted">
            <Icon icon="solar:close-circle-outline" className="h-4 w-4" />
          </button>
        </div>

        <div className="flex gap-2 bg-background p-1 rounded-control text-xs">
          <button type="button" onClick={() => { stopCamera(); setTab('upload'); }} className={`flex-1 py-1.5 font-semibold rounded-lg ${tab === 'upload' ? 'bg-primary text-on-primary' : 'text-text-muted'}`}>Upload Image</button>
          <button type="button" onClick={() => { setTab('camera'); startCamera(); }} className={`flex-1 py-1.5 font-semibold rounded-lg ${tab === 'camera' ? 'bg-primary text-on-primary' : 'text-text-muted'}`}>WebCam</button>
        </div>

        {tab === 'upload' && (
          <div>
            <input type="file" accept="image/*" onChange={handleUpload} className="hidden" id="dec-file" />
            <label htmlFor="dec-file" className="border-2 border-dashed border-border rounded-card p-6 flex flex-col items-center justify-center gap-2 cursor-pointer bg-surface">
              <Icon icon="solar:upload-track-2-outline" className="h-7 w-7 text-primary" />
              <span className="text-xs font-semibold text-text-main">Select Image File</span>
            </label>
          </div>
        )}

        {tab === 'camera' && (
          <div className="space-y-2">
            <div className="relative aspect-video w-full rounded-card overflow-hidden bg-black flex items-center justify-center">
              <video ref={videoRef} className="w-full h-full object-cover" playsInline muted />
              {scanning && <div className="absolute inset-0 border-2 border-blue-accent/50 animate-pulse flex items-center justify-center"><div className="w-40 h-40 border-2 border-blue-accent rounded-xl" /></div>}
            </div>
            {!scanning && <button type="button" onClick={startCamera} className="w-full neu-button py-2 text-xs font-semibold text-primary">Start Camera</button>}
          </div>
        )}

        {error && <div className="p-2.5 rounded-control bg-error/10 text-error text-xs">{error}</div>}

        {result && (
          <div className="rounded-card neu-card p-3.5 space-y-2.5 border-l-4 border-l-primary">
            <span className="text-xs font-bold text-text-main">Decoded ({result.detectedType})</span>
            <p className="text-xs font-mono text-text-main break-all bg-surface p-2.5 rounded-control max-h-28 overflow-y-auto">{result.text}</p>
            <div className="flex gap-2">
              <button type="button" onClick={() => { navigator.clipboard.writeText(result.text); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="flex-1 neu-button py-1.5 text-xs">{copied ? 'Copied' : 'Copy'}</button>
              <button type="button" onClick={() => { onApplyDecodedText(result.text); stopCamera(); onClose(); }} className="flex-1 bg-primary text-on-primary py-1.5 text-xs font-semibold rounded-control shadow-glow-emerald">Load in Editor</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
