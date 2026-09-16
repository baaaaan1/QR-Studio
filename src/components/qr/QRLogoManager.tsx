import React, { useRef, useState } from 'react';
import { Icon } from '@iconify/react';
import type { QRConfig } from '../../lib/types';
import { PresetLogoGrid } from './logo/PresetLogoGrid';
import { removeImageBackground } from '../../lib/bg-remover';

interface Props {
  config: QRConfig;
  onChange: (updated: Partial<QRConfig>) => void;
}

export const QRLogoManager: React.FC<Props> = ({ config, onChange }) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [isRemovingBg, setIsRemovingBg] = useState(false);
  const [originalImage, setOriginalImage] = useState<string | null>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const url = ev.target?.result as string;
      setOriginalImage(url);
      onChange({ logoUrl: url, removeLogoBgApplied: false });
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveBg = async (checked: boolean) => {
    if (!originalImage && !config.logoUrl) return;
    if (checked) {
      setIsRemovingBg(true);
      try {
        const source = originalImage || config.logoUrl || '';
        const cleaned = await removeImageBackground(source, 40, 14);
        onChange({ logoUrl: cleaned, removeLogoBgApplied: true });
      } catch (err) {
        console.error(err);
      } finally {
        setIsRemovingBg(false);
      }
    } else if (originalImage) {
      onChange({ logoUrl: originalImage, removeLogoBgApplied: false });
    }
  };

  const clearLogo = () => {
    setOriginalImage(null);
    onChange({ logoUrl: null, removeLogoBgApplied: false });
    if (fileRef.current) fileRef.current.value = '';
  };

  return (
    <div className="space-y-5">
      <div className="rounded-card neu-card p-4 space-y-4">
        <span className="text-xs font-semibold text-text-main block">Logo / Image</span>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" id="logo-input" />
          <label htmlFor="logo-input" className="neu-button flex flex-1 w-full items-center justify-center gap-2 rounded-control px-4 py-3 text-xs font-medium cursor-pointer">
            <Icon icon="solar:upload-track-2-outline" className="h-4 w-4 text-primary" />
            <span>Select Image File</span>
          </label>
          {config.logoUrl && (
            <button type="button" onClick={clearLogo} className="neu-button flex items-center gap-1 rounded-control px-3 py-3 text-xs font-medium text-error">
              <Icon icon="solar:trash-bin-trash-outline" className="h-4 w-4" />
              <span>Remove</span>
            </button>
          )}
        </div>

        {config.logoUrl && (
          <div className="pt-2 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg border border-border bg-white flex items-center justify-center p-1 inset-shadow-sm overflow-hidden">
                <img src={config.logoUrl} alt="Active logo" className="max-h-full max-w-full object-contain" />
              </div>
              <div className="text-xs">
                <p className="font-semibold text-text-main">Logo Active</p>
                <p className="text-[11px] text-text-muted">Auto Error Correction (High)</p>
              </div>
            </div>
            <label className="flex items-center gap-2 text-xs font-medium cursor-pointer bg-surface px-3 py-2 rounded-control border border-border">
              <input type="checkbox" disabled={isRemovingBg} checked={config.removeLogoBgApplied} onChange={(e) => handleRemoveBg(e.target.checked)} className="rounded accent-primary h-4 w-4" />
              <Icon icon="solar:eraser-outline" className="h-4 w-4 text-error" />
              <span>{isRemovingBg ? 'Removing...' : 'Auto-Remove White BG'}</span>
            </label>
          </div>
        )}
      </div>

      <PresetLogoGrid onSelect={(url) => { setOriginalImage(url); onChange({ logoUrl: url, removeLogoBgApplied: false }); }} />

      {config.logoUrl && (
        <div className="rounded-card neu-card p-4 grid grid-cols-2 gap-4">
          <div>
            <div className="flex justify-between text-xs text-text-muted mb-1.5">
              <span className="font-semibold text-text-main">Scale</span>
              <span>{Math.round(config.logoSize * 100)}%</span>
            </div>
            <input type="range" min="0.15" max="0.36" step="0.01" value={config.logoSize} onChange={(e) => onChange({ logoSize: Number(e.target.value) })} className="w-full accent-primary cursor-pointer" />
          </div>
          <div>
            <div className="flex justify-between text-xs text-text-muted mb-1.5">
              <span className="font-semibold text-text-main">Padding</span>
              <span>{config.logoMargin}px</span>
            </div>
            <input type="range" min="0" max="16" step="1" value={config.logoMargin} onChange={(e) => onChange({ logoMargin: Number(e.target.value) })} className="w-full accent-primary cursor-pointer" />
          </div>
        </div>
      )}
    </div>
  );
};
