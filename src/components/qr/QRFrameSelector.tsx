import React from 'react';
import { Icon } from '@iconify/react';
import type { QRConfig, FrameType } from '../../lib/types';
import { ColorInput } from '../ui/ColorInput';

interface Props {
  config: QRConfig;
  onChange: (updated: Partial<QRConfig>) => void;
}

const FRAMES: { id: FrameType; label: string; icon: string }[] = [
  { id: 'scan-me-bottom', label: 'Scan Me Pill', icon: 'solar:cursor-square-outline' },
  { id: 'top-banner', label: 'Top Banner', icon: 'solar:bookmark-square-minimalistic-outline' },
  { id: 'polaroid', label: 'Polaroid Card', icon: 'solar:gallery-minimalistic-outline' },
  { id: 'phone', label: 'Phone Mockup', icon: 'solar:smartphone-outline' },
  { id: 'neon-badge', label: 'Neon Glow', icon: 'solar:bolt-outline' },
  { id: 'ticket', label: 'Ticket / Coupon', icon: 'solar:ticket-sale-outline' },
  { id: 'none', label: 'No Frame (Clean)', icon: 'solar:close-circle-outline' },
];

const TEXT_POSITIONS: { id: 'bottom' | 'top' | 'both'; label: string }[] = [
  { id: 'bottom', label: 'Bottom Only' },
  { id: 'top', label: 'Top Only' },
  { id: 'both', label: 'Top & Bottom' },
];

export const QRFrameSelector: React.FC<Props> = ({ config, onChange }) => {
  return (
    <div className="space-y-5">
      <div className="space-y-2.5">
        <span className="text-xs font-semibold text-text-main block">
          Select Frame Template
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {FRAMES.map((f) => {
            const active = config.frameType === f.id;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => onChange({ frameType: f.id })}
                className={`flex flex-col items-center justify-center gap-2 p-3 rounded-control text-xs font-medium transition-all ${
                  active
                    ? 'bg-primary text-on-primary shadow-glow-emerald font-semibold'
                    : 'neu-button text-text-muted hover:text-text-main'
                }`}
              >
                <Icon icon={f.icon} className="h-5 w-5" />
                <span>{f.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {config.frameType !== 'none' && (
        <div className="rounded-card neu-card p-4 space-y-4">
          {/* CTA Text Position */}
          <div>
            <span className="text-xs font-semibold text-text-main block mb-2">
              CTA Text Position
            </span>
            <p className="mb-2 text-[11px] text-text-muted">
              Place an optional call-to-action above the QR, below it, or in both positions.
            </p>
            <div className="flex gap-2">
              {TEXT_POSITIONS.map((pos) => (
                <button
                  key={pos.id}
                  type="button"
                  onClick={() => onChange({ frameTextPosition: pos.id })}
                  className={`flex-1 py-2 text-xs font-semibold rounded-control transition-all ${
                    config.frameTextPosition === pos.id
                      ? 'bg-primary text-on-primary shadow-xs'
                      : 'neu-button text-text-muted hover:text-text-main'
                  }`}
                >
                  {pos.label}
                </button>
              ))}
            </div>
          </div>

          {/* Top CTA Text */}
          {(config.frameTextPosition === 'top' || config.frameTextPosition === 'both') && (
            <div>
              <label htmlFor="frame-top-text" className="text-xs font-semibold text-text-main block mb-1">
                Top CTA Text
              </label>
              <input
                id="frame-top-text"
                type="text"
                value={config.frameTopText}
                onChange={(e) => onChange({ frameTopText: e.target.value })}
                placeholder="e.g. POINT CAMERA HERE"
                maxLength={28}
                className="w-full neu-input rounded-control px-3.5 py-2 text-sm uppercase tracking-wider font-semibold"
              />
            </div>
          )}

                    {/* Bottom CTA Text */}
          {(config.frameTextPosition === 'bottom' || config.frameTextPosition === 'both') && (
            <div>
              <label htmlFor="frame-bottom-text" className="text-xs font-semibold text-text-main block mb-1">
                Bottom CTA Text
              </label>
              <input
                id="frame-bottom-text"
                type="text"
                value={config.frameText}
                onChange={(e) => onChange({ frameText: e.target.value })}
                placeholder="e.g. SCAN ME, VIEW MENU"
                maxLength={28}
                className="w-full neu-input rounded-control px-3.5 py-2 text-sm uppercase tracking-wider font-semibold"
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <ColorInput
              label="Frame Accent Color"
              value={config.frameColor}
              onChange={(c) => onChange({ frameColor: c })}
            />
            <ColorInput
              label="CTA Text Color"
              value={config.frameTextColor}
              onChange={(c) => onChange({ frameTextColor: c })}
            />
            <ColorInput
              label="Frame Card Background"
              value={config.frameBgColor}
              onChange={(c) => onChange({ frameBgColor: c })}
            />
          </div>
        </div>
      )}
    </div>
  );
};
