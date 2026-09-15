import React from 'react';
import type { QRConfig } from '../../../lib/types';

interface FormProps {
  config: QRConfig;
  onChange: (updated: Partial<QRConfig>) => void;
}

export const VCardForm: React.FC<FormProps> = ({ config, onChange }) => {
  const update = (field: keyof QRConfig['vcardData'], val: string) => {
    onChange({
      vcardData: {
        ...config.vcardData,
        [field]: val,
      },
    });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
      <div>
        <label className="text-xs font-medium text-text-muted">First Name</label>
        <input
          type="text"
          value={config.vcardData.firstName}
          onChange={(e) => update('firstName', e.target.value)}
          placeholder="Alex"
          className="w-full neu-input rounded-control px-3 py-1.5 text-sm"
        />
      </div>

      <div>
        <label className="text-xs font-medium text-text-muted">Last Name</label>
        <input
          type="text"
          value={config.vcardData.lastName}
          onChange={(e) => update('lastName', e.target.value)}
          placeholder="Morgan"
          className="w-full neu-input rounded-control px-3 py-1.5 text-sm"
        />
      </div>

      <div>
        <label className="text-xs font-medium text-text-muted">Phone</label>
        <input
          type="tel"
          value={config.vcardData.phone}
          onChange={(e) => update('phone', e.target.value)}
          placeholder="+1 555-0199"
          className="w-full neu-input rounded-control px-3 py-1.5 text-sm"
        />
      </div>

      <div>
        <label className="text-xs font-medium text-text-muted">Email</label>
        <input
          type="email"
          value={config.vcardData.email}
          onChange={(e) => update('email', e.target.value)}
          placeholder="alex@company.com"
          className="w-full neu-input rounded-control px-3 py-1.5 text-sm"
        />
      </div>

      <div>
        <label className="text-xs font-medium text-text-muted">Organization</label>
        <input
          type="text"
          value={config.vcardData.organization}
          onChange={(e) => update('organization', e.target.value)}
          placeholder="Acme Studio"
          className="w-full neu-input rounded-control px-3 py-1.5 text-sm"
        />
      </div>

      <div>
        <label className="text-xs font-medium text-text-muted">Job Title</label>
        <input
          type="text"
          value={config.vcardData.title}
          onChange={(e) => update('title', e.target.value)}
          placeholder="Product Designer"
          className="w-full neu-input rounded-control px-3 py-1.5 text-sm"
        />
      </div>

      <div className="sm:col-span-2">
        <label className="text-xs font-medium text-text-muted">Website</label>
        <input
          type="url"
          value={config.vcardData.url}
          onChange={(e) => update('url', e.target.value)}
          placeholder="https://portfolio.me"
          className="w-full neu-input rounded-control px-3 py-1.5 text-sm"
        />
      </div>

      <div className="sm:col-span-2">
        <label className="text-xs font-medium text-text-muted">Address / City</label>
        <input
          type="text"
          value={config.vcardData.address}
          onChange={(e) => update('address', e.target.value)}
          placeholder="100 Market St, San Francisco, CA"
          className="w-full neu-input rounded-control px-3 py-1.5 text-sm"
        />
      </div>
    </div>
  );
};
