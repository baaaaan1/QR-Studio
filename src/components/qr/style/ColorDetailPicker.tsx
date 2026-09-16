import React from 'react';
import type { GradientConfig, QRConfig } from '../../../lib/types';
import { GRADIENT_PRESETS } from '../../../lib/presets';
import { ColorInput } from '../../ui/ColorInput';

interface Props {
  config: QRConfig;
  onChange: (updated: Partial<QRConfig>) => void;
}

const QUICK_ANGLES = [0, 45, 90, 135];

function gradientCss(gradient: GradientConfig): string {
  const stops = gradient.colorStops.map((stop) => `${stop.color} ${stop.offset * 100}%`).join(', ');
  return gradient.type === 'radial'
    ? `radial-gradient(circle, ${stops})`
    : `linear-gradient(${gradient.rotation}deg, ${stops})`;
}

export const ColorDetailPicker: React.FC<Props> = ({ config, onChange }) => {
  const updateGradient = (gradient: GradientConfig) => {
    onChange({
      useGradient: true,
      dotColor: gradient.colorStops[0]?.color ?? config.dotColor,
      gradient,
    });
  };

  const updateStop = (index: number, color: string) => {
    const stops = [...config.gradient.colorStops];
    stops[index] = { ...stops[index], color };
    updateGradient({ ...config.gradient, colorStops: stops });
  };

  return (
    <div className="rounded-card neu-card p-4 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-semibold text-text-main">Pattern Color Mode</span>
        <div className="flex items-center gap-1.5 bg-background p-1 rounded-control">
          <button
            type="button"
            onClick={() => onChange({ useGradient: false })}
            className={`px-3 py-1 text-xs rounded-lg font-medium transition-all ${
              !config.useGradient ? 'bg-primary text-on-primary shadow-xs' : 'text-text-muted hover:text-text-main'
            }`}
          >
            Solid
          </button>
          <button
            type="button"
            onClick={() => onChange({ useGradient: true })}
            className={`px-3 py-1 text-xs rounded-lg font-medium transition-all ${
              config.useGradient ? 'bg-primary text-on-primary shadow-xs' : 'text-text-muted hover:text-text-main'
            }`}
          >
            Gradient
          </button>
        </div>
      </div>

      {!config.useGradient ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <ColorInput label="Dot Color" value={config.dotColor} onChange={(dotColor) => onChange({ dotColor })} />
          <ColorInput
            label="Corner Outer"
            value={config.cornerSquareColor}
            onChange={(cornerSquareColor) => onChange({ cornerSquareColor })}
          />
          <ColorInput
            label="Corner Dot"
            value={config.cornerDotColor}
            onChange={(cornerDotColor) => onChange({ cornerDotColor })}
          />
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <span className="mb-2 block text-xs font-semibold text-text-main">Gradient Mode</span>
            <div className="grid grid-cols-2 gap-2">
              {(['linear', 'radial'] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => updateGradient({ ...config.gradient, type })}
                  className={`rounded-control px-3 py-2 text-xs font-semibold capitalize transition-all ${
                    config.gradient.type === type
                      ? 'bg-primary text-on-primary shadow-xs'
                      : 'neu-button text-text-muted hover:text-text-main'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div>
            <span className="mb-2 block text-xs font-semibold text-text-main">Gradient Presets</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {GRADIENT_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => updateGradient(preset.gradient)}
                  title={preset.name}
                  className="group rounded-control p-2 text-left neu-button transition-all hover:border-primary/50"
                >
                  <span
                    className="mb-1.5 block h-7 w-full rounded-md border border-border inset-shadow-sm"
                    style={{ background: gradientCss(preset.gradient) }}
                  />
                  <span className="block truncate text-center text-[10px] font-medium text-text-muted group-hover:text-text-main">
                    {preset.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <ColorInput label="Start Color" value={config.gradient.colorStops[0]?.color || '#10B981'} onChange={(color) => updateStop(0, color)} />
            <ColorInput label="End Color" value={config.gradient.colorStops.at(-1)?.color || '#38BDF8'} onChange={(color) => updateStop(config.gradient.colorStops.length - 1, color)} />
          </div>

          {config.gradient.type === 'linear' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] text-text-muted">
                <span>Rotation Angle</span>
                <span className="font-mono">{config.gradient.rotation}°</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {QUICK_ANGLES.map((angle) => (
                  <button
                    key={angle}
                    type="button"
                    onClick={() => updateGradient({ ...config.gradient, rotation: angle })}
                    className={`rounded-control py-1.5 text-xs font-semibold transition-all ${
                      config.gradient.rotation === angle
                        ? 'bg-primary text-on-primary shadow-xs'
                        : 'neu-button text-text-muted hover:text-text-main'
                    }`}
                  >
                    {angle}°
                  </button>
                ))}
              </div>
              <input
                type="range"
                min="0"
                max="360"
                step="15"
                value={config.gradient.rotation}
                onChange={(event) => updateGradient({ ...config.gradient, rotation: Number(event.target.value) })}
                className="w-full accent-primary cursor-pointer"
                aria-label="Gradient rotation angle"
              />
            </div>
          )}
        </div>
      )}

      <div className="pt-3 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <label htmlFor="qr-bg-color" className="text-xs font-medium text-text-main">QR Background:</label>
          {!config.transparentBg && (
            <div className="flex items-center gap-1.5">
              <input
                id="qr-bg-color"
                type="color"
                value={config.bgColor}
                onChange={(event) => onChange({ bgColor: event.target.value })}
                className="h-7 w-8 cursor-pointer rounded border-0 bg-transparent"
              />
              <span className="text-xs font-mono text-text-muted">{config.bgColor}</span>
            </div>
          )}
        </div>
        <label className="flex items-center gap-2 text-xs font-medium text-text-main cursor-pointer">
          <input
            type="checkbox"
            checked={config.transparentBg}
            onChange={(event) => onChange({ transparentBg: event.target.checked })}
            className="rounded accent-primary h-4 w-4"
          />
          <span>Transparent Background</span>
        </label>
      </div>
    </div>
  );
};
