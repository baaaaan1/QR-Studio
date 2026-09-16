import React, { useEffect, useRef, useState } from 'react';
import { Icon } from '@iconify/react';
import type { QRConfig } from '../../lib/types';
import { createQRCodeInstance, compositeQRWithFrame } from '../../lib/qr-engine';

interface Props {
  config: QRConfig;
  onOpenExport: () => void;
  onQuickCopy: () => void;
  copied: boolean;
}

export const QRPreviewCanvas: React.FC<Props> = ({ config, onOpenExport, onQuickCopy, copied }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const compositeCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    async function updateQR() {
      setIsGenerating(true);
      try {
        // Base QR code instance (420px for crisp retina preview)
        const qr = createQRCodeInstance(config, 420);
        const rawBlob = await qr.getRawData('png');
        if (!rawBlob || isCancelled) return;

        const img = new Image();
        const url = URL.createObjectURL(rawBlob as Blob);

        img.onload = async () => {
          if (isCancelled) {
            URL.revokeObjectURL(url);
            return;
          }
          const rawCanvas = document.createElement('canvas');
          rawCanvas.width = img.width;
          rawCanvas.height = img.height;
          const ctx = rawCanvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0);
            if (compositeCanvasRef.current) {
              await compositeQRWithFrame(rawCanvas, config, compositeCanvasRef.current);
            }
          }
          URL.revokeObjectURL(url);
          setIsGenerating(false);
        };
        img.src = url;
      } catch (err) {
        console.error('Failed to update QR preview:', err);
        setIsGenerating(false);
      }
    }

    updateQR();
    return () => {
      isCancelled = true;
    };
  }, [config]);

  return (
    <div className="flex flex-col items-center gap-5">
      {/* Neumorphic Stage Card for QR Canvas */}
      <div className="neu-card rounded-major p-6 sm:p-8 flex flex-col items-center justify-center max-w-full relative overflow-hidden transition-all">
        {/* Soft corner badge */}
        <div className="absolute top-3.5 left-4 flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider">
            Live Preview
          </span>
        </div>

        {/* Format Badge */}
        <div className="absolute top-3.5 right-4 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
          ECC: {config.logoUrl ? 'H (30%)' : config.errorCorrectionLevel}
        </div>

        {/* The Composite Canvas Element */}
        <div
          ref={containerRef}
          className="mt-4 flex items-center justify-center min-h-[300px] w-full"
        >
          <canvas
            ref={compositeCanvasRef}
            className="max-h-[360px] max-w-[320px] sm:max-w-[360px] w-auto h-auto rounded-xl shadow-lg transition-transform duration-200"
          />
        </div>

        {isGenerating && (
          <div className="absolute inset-0 bg-surface/60 backdrop-blur-[2px] flex items-center justify-center">
            <div className="flex items-center gap-2 text-xs font-semibold text-primary">
              <Icon icon="solar:refresh-outline" className="h-4 w-4 animate-spin" />
              <span>Rendering...</span>
            </div>
          </div>
        )}
      </div>

      {/* Main Action Buttons */}
      <div className="w-full flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={onOpenExport}
          className="flex-1 flex items-center justify-center gap-2 rounded-control bg-primary text-on-primary px-5 py-3 text-sm font-semibold shadow-glow-emerald hover:opacity-95 active:scale-[0.98] transition-all"
        >
          <Icon icon="solar:download-minimalistic-outline" className="h-5 w-5" />
          <span>Export (PNG, SVG, PDF)</span>
        </button>

        <button
          type="button"
          onClick={onQuickCopy}
          className="neu-button flex items-center justify-center gap-2 rounded-control px-4 py-3 text-sm font-medium text-text-main hover:text-primary transition-all"
          title="Copy image to clipboard"
        >
          <Icon
            icon={copied ? 'solar:check-circle-outline' : 'solar:copy-outline'}
            className={`h-4 w-4 ${copied ? 'text-primary' : 'text-text-muted'}`}
          />
          <span>{copied ? 'Copied!' : 'Copy Image'}</span>
        </button>
      </div>
    </div>
  );
};
