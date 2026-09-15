import React from 'react';
import type { QRConfig } from '../../../lib/types';

interface FormProps {
  config: QRConfig;
  onChange: (updated: Partial<QRConfig>) => void;
}

export const WiFiForm: React.FC<FormProps> = ({ config, onChange }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="space-y-1.5 sm:col-span-2">
        <label className="text-xs font-semibold text-text-main">Network SSID (Name)</label>
        <input
          type="text"
          value={config.wifiData.ssid}
          onChange={(e) =>
            onChange({
              wifiData: { ...config.wifiData, ssid: e.target.value },
            })
          }
          placeholder="e.g. Studio-WiFi-5G"
          className="w-full neu-input rounded-control px-3.5 py-2 text-sm"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-text-main">Password</label>
        <input
          type="text"
          value={config.wifiData.password}
          onChange={(e) =>
            onChange({
              wifiData: { ...config.wifiData, password: e.target.value },
            })
          }
          placeholder="Network password"
          className="w-full neu-input rounded-control px-3.5 py-2 text-sm"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-text-main">Encryption</label>
        <select
          value={config.wifiData.encryption}
          onChange={(e) =>
            onChange({
              wifiData: {
                ...config.wifiData,
                encryption: e.target.value as 'WPA' | 'WEP' | 'nopass',
              },
            })
          }
          className="w-full neu-input rounded-control px-3 py-2 text-sm bg-surface"
        >
          <option value="WPA">WPA / WPA2 / WPA3</option>
          <option value="WEP">WEP</option>
          <option value="nopass">None (Open Network)</option>
        </select>
      </div>

      <div className="sm:col-span-2 pt-1">
        <label className="flex items-center gap-2.5 text-xs font-medium text-text-main cursor-pointer">
          <input
            type="checkbox"
            checked={config.wifiData.hidden}
            onChange={(e) =>
              onChange({
                wifiData: { ...config.wifiData, hidden: e.target.checked },
              })
            }
            className="rounded accent-primary h-4 w-4"
          />
          <span>Hidden SSID (Invisible network broadcast)</span>
        </label>
      </div>
    </div>
  );
};
