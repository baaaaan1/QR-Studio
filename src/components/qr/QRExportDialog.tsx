import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import type { QRConfig } from '../../lib/types';
import { exportPNG, exportSVG } from '../../lib/qr-engine';
import { exportPDF } from '../../lib/pdf-exporter';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  config: QRConfig;
}

export const QRExportDialog: React.FC<Props> = ({ isOpen, onClose, config }) => {
  const [format, setFormat] = useState<'png' | 'svg' | 'pdf'>('png');
  const [resolution, setResolution] = useState<number>(1024);
  const [fileName, setFileName] = useState<string>('qr-studio-code');
  const [isExporting, setIsExporting] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleDownload = async () => {
    setIsExporting(true);
    try {
      const cleanName = (fileName.trim() || 'qr-code').replace(/[^a-z0-9-_]/gi, '_');

      if (format === 'png') {
        const dataUrl = await exportPNG(config, resolution);
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = `${cleanName}-${resolution}px.png`;
        a.click();
      } else if (format === 'svg') {
        const svgContent = await exportSVG(config);
        const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${cleanName}.svg`;
        a.click();
        URL.revokeObjectURL(url);
      } else if (format === 'pdf') {
        await exportPDF(config, `${cleanName}.pdf`);
      }
      onClose();
    } catch (err) {
      console.error(err);
      alert('Failed to export QR code.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/70 backdrop-blur-xs animate-fade-in">
      <div className="neu-card rounded-major max-w-md w-full p-6 space-y-4 border border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-control bg-surface shadow-neu-sm flex items-center justify-center text-primary">
              <Icon icon="solar:download-minimalistic-outline" className="h-4 w-4" />
            </div>
            <h3 className="font-heading font-bold text-base text-text-main">Export QR Code</h3>
          </div>
          <button type="button" onClick={onClose} className="neu-button h-8 w-8 rounded-control flex items-center justify-center text-text-muted">
            <Icon icon="solar:close-circle-outline" className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-1.5">
          <span className="text-xs font-semibold text-text-main block">Format</span>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'png', label: 'PNG Image', desc: 'Raster' },
              { id: 'svg', label: 'SVG Vector', desc: 'Scalable' },
              { id: 'pdf', label: 'PDF Card', desc: 'Print-ready' },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFormat(f.id as any)}
                className={`p-2.5 rounded-control text-left transition-all ${
                  format === f.id ? 'bg-primary text-on-primary shadow-glow-emerald font-semibold' : 'neu-button text-text-main'
                }`}
              >
                <div className="text-xs font-bold">{f.label}</div>
                <div className={`text-[10px] ${format === f.id ? 'text-on-primary/80' : 'text-text-muted'}`}>{f.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {format === 'png' && (
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-text-main block">Resolution</span>
            <div className="grid grid-cols-4 gap-2">
              {[512, 1024, 2048, 4096].map((sz) => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => setResolution(sz)}
                  className={`p-2 rounded-control text-center text-xs font-medium transition-all ${
                    resolution === sz ? 'bg-primary text-on-primary shadow-xs font-semibold' : 'neu-button text-text-muted'
                  }`}
                >
                  {sz}px
                </button>
              ))}
            </div>
          </div>
        )}

        {format === 'svg' && config.frameType !== 'none' && (
          <p className="rounded-control border border-blue-accent/30 bg-blue-accent/10 px-3 py-2 text-[11px] leading-relaxed text-text-main">
            SVG preserves the QR code as a vector. Frame artwork and CTA text are included in PNG and PDF exports.
          </p>
        )}

        <div className="space-y-1">
          <label htmlFor="export-file-name" className="text-xs font-semibold text-text-main block">File Name</label>
          <input
            id="export-file-name"
            type="text"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            className="w-full neu-input rounded-control px-3.5 py-2 text-xs font-mono"
            placeholder="filename"
          />
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-2">
          <button type="button" onClick={onClose} className="neu-button px-4 py-2 rounded-control text-xs text-text-muted">
            Cancel
          </button>
          <button
            type="button"
            disabled={isExporting}
            onClick={handleDownload}
            className="flex items-center gap-1.5 rounded-control bg-primary px-4 py-2 text-xs font-semibold text-on-primary shadow-glow-emerald disabled:opacity-50"
          >
            {isExporting ? <Icon icon="solar:refresh-outline" className="h-4 w-4 animate-spin" /> : <Icon icon="solar:download-minimalistic-outline" className="h-4 w-4" />}
            <span>Download {format.toUpperCase()}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
