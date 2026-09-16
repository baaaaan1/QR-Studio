import React from 'react';
import type { QRConfig, QRDotType, QRCornerSquareType } from '../../../lib/types';

interface Props {
  config: QRConfig;
  onChange: (updated: Partial<QRConfig>) => void;
}

const DOT_PATTERNS: { id: QRDotType; label: string }[] = [
  { id: 'rounded', label: 'Rounded' },
  { id: 'dots', label: 'Dots' },
  { id: 'extra-rounded', label: 'Super Round' },
  { id: 'classy', label: 'Classy' },
  { id: 'classy-rounded', label: 'Elegant' },
  { id: 'square', label: 'Square' },
];

const CORNER_PATTERNS: { id: QRCornerSquareType; label: string }[] = [
  { id: 'extra-rounded', label: 'Smooth' },
  { id: 'dot', label: 'Circle' },
  { id: 'square', label: 'Square' },
];

export const PatternSelector: React.FC<Props> = ({ config, onChange }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Dot Shape */}
      <div className="space-y-2">
        <span className="text-xs font-semibold text-text-main">Dot Pattern</span>
        <div className="grid grid-cols-3 gap-1.5">
          {DOT_PATTERNS.map((p) => {
            const active = config.dotType === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => onChange({ dotType: p.id })}
                className={`rounded-control px-2.5 py-2 text-xs font-medium transition-all ${
                  active
                    ? 'bg-primary text-on-primary shadow-glow-emerald font-semibold'
                    : 'neu-button text-text-muted hover:text-text-main'
                }`}
              >
                {p.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Corner Shape */}
      <div className="space-y-2">
        <span className="text-xs font-semibold text-text-main">Corner Markers</span>
        <div className="grid grid-cols-3 gap-1.5">
          {CORNER_PATTERNS.map((c) => {
            const active = config.cornerSquareType === c.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() =>
                  onChange({
                    cornerSquareType: c.id,
                    cornerDotType: c.id === 'square' ? 'square' : 'dot',
                  })
                }
                className={`rounded-control px-2.5 py-2 text-xs font-medium transition-all ${
                  active
                    ? 'bg-primary text-on-primary shadow-glow-emerald font-semibold'
                    : 'neu-button text-text-muted hover:text-text-main'
                }`}
              >
                {c.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
