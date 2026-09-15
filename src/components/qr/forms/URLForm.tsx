import React from 'react';
import { Icon } from '@iconify/react';
import type { QRConfig } from '../../../lib/types';

interface FormProps {
  config: QRConfig;
  onChange: (updated: Partial<QRConfig>) => void;
}

export const URLForm: React.FC<FormProps> = ({ config, onChange }) => {
  return (
    <div className="space-y-3">
      <label className="block text-xs font-semibold text-text-main">
        Target Website URL
      </label>
      <div className="relative">
        <input
          type="url"
          value={config.urlData.url}
          onChange={(e) =>
            onChange({
              urlData: { url: e.target.value },
            })
          }
          placeholder="https://example.com"
          className="w-full neu-input rounded-control px-4 py-2.5 text-sm pl-10"
        />
        <Icon
          icon="solar:link-circle-outline"
          className="absolute left-3 top-3 h-4 w-4 text-text-muted"
        />
      </div>
      <p className="text-[11px] text-text-muted">
        Enter a complete website address. HTTP or HTTPS protocol will be automatically normalized.
      </p>
    </div>
  );
};
