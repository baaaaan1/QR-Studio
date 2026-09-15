import React from 'react';
import type { QRConfig } from '../../lib/types';
import { ColorPresetPicker } from './style/ColorPresetPicker';
import { PatternSelector } from './style/PatternSelector';
import { ColorDetailPicker } from './style/ColorDetailPicker';

interface QRStyleCustomizerProps {
  config: QRConfig;
  onChange: (updated: Partial<QRConfig>) => void;
}

export const QRStyleCustomizer: React.FC<QRStyleCustomizerProps> = ({ config, onChange }) => {
  return (
    <div className="space-y-6">
      {/* 1. Curated Color Presets */}
      <ColorPresetPicker config={config} onChange={onChange} />

      {/* 2. Dot Patterns & Corner Styles */}
      <PatternSelector config={config} onChange={onChange} />

      {/* 3. Detailed Color & Background Picker */}
      <ColorDetailPicker config={config} onChange={onChange} />
    </div>
  );
};
