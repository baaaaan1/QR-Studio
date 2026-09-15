import React from 'react';
import { Icon } from '@iconify/react';
import type { QRConfig } from '../../../lib/types';
import { COLOR_PRESETS } from '../../../lib/presets';

interface Props {
  config: QRConfig;
  onChange: (updated: Partial<QRConfig>) => void;
}

function gradientCss(preset: (typeof COLOR_PRESETS)[number]): string {
  if (!preset.useGradient || !preset.gradient) return preset.dotColor;

  const stops = preset.gradient.colorStops.map((stop) => `${stop.color} ${stop.offset * 100}%`).join(', ');
  return preset.gradient.type === 'radial'
    ? `radial-gradient(circle, ${stops})`
    : `linear-gradient(${preset.gradient.rotation}deg, ${stops})`;
}

export const ColorPresetPicker: React.FC<Props> = ({ config, onChange }) => {
  const applyPreset = (preset: typeof COLOR_PRESETS[0]) => {
    onChange({
      dotColor: preset.dotColor,
      bgColor: preset.bgColor,
      useGradient: preset.useGradient,
      gradient: preset.gradient || config.gradient,
      cornerSquareColor: preset.cornerSquareColor,
      cornerDotColor: preset.cornerDotColor,
      transparentBg: false,
    });
  };

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-text-main flex items-center gap-1.5">
          <Icon icon="solar:pallete-2-outline" className="h-4 w-4 text-primary" />
          <span>Curated Color Themes</span>
        </label>
      </div>
      <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
        {COLOR_PRESETS.map((preset) => (
          <button
            key={preset.id}
            type="button"
            onClick={() => applyPreset(preset)}
            className="group flex flex-col items-center gap-1.5 p-2 rounded-control neu-button hover:border-primary/50 transition-all text-left"
          >
            <div
              className="w-full h-7 rounded-md border border-border shadow-inner"
              style={{
                background: gradientCss(preset),
              }}
            />
            <span className="text-[10px] font-medium text-text-muted group-hover:text-text-main truncate w-full text-center">
              {preset.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
