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
        <label htmlFor="vcard-first-name" className="text-xs font-medium text-text-muted">First Name</label>
        <input
          id="vcard-first-name"
          type="text"
          value={config.vcardData.firstName}
          onChange={(e) => update('firstName', e.target.value)}
          placeholder="Alex"
          className="w-full neu-input rounded-control px-3 py-1.5 text-sm"
        />
      </div>

      <div>
        <label htmlFor="vcard-last-name" className="text-xs font-medium text-text-muted">Last Name</label>
        <input
          id="vcard-last-name"
          type="text"
          value={config.vcardData.lastName}
          onChange={(e) => update('lastName', e.target.value)}
          placeholder="Morgan"
          className="w-full neu-input rounded-control px-3 py-1.5 text-sm"
        />
      </div>

      <div>
        <label htmlFor="vcard-phone" className="text-xs font-medium text-text-muted">Phone</label>
        <input
          id="vcard-phone"
          type="tel"
          value={config.vcardData.phone}
          onChange={(e) => update('phone', e.target.value)}
          placeholder="+1 555-0199"
          className="w-full neu-input rounded-control px-3 py-1.5 text-sm"
        />
      </div>

      <div>
        <label htmlFor="vcard-email" className="text-xs font-medium text-text-muted">Email</label>
        <input
          id="vcard-email"
          type="email"
          value={config.vcardData.email}
          onChange={(e) => update('email', e.target.value)}
          placeholder="alex@company.com"
          className="w-full neu-input rounded-control px-3 py-1.5 text-sm"
        />
      </div>

      <div>
        <label htmlFor="vcard-organization" className="text-xs font-medium text-text-muted">Organization</label>
        <input
          id="vcard-organization"
          type="text"
          value={config.vcardData.organization}
          onChange={(e) => update('organization', e.target.value)}
          placeholder="Acme Studio"
          className="w-full neu-input rounded-control px-3 py-1.5 text-sm"
        />
      </div>

      <div>
        <label htmlFor="vcard-title" className="text-xs font-medium text-text-muted">Job Title</label>
        <input
          id="vcard-title"
          type="text"
          value={config.vcardData.title}
          onChange={(e) => update('title', e.target.value)}
          placeholder="Product Designer"
          className="w-full neu-input rounded-control px-3 py-1.5 text-sm"
        />
      </div>

      <div className="sm:col-span-2">
        <label htmlFor="vcard-url" className="text-xs font-medium text-text-muted">Website</label>
        <input
          id="vcard-url"
          type="url"
          value={config.vcardData.url}
          onChange={(e) => update('url', e.target.value)}
          placeholder="https://portfolio.me"
          className="w-full neu-input rounded-control px-3 py-1.5 text-sm"
        />
      </div>

      <div className="sm:col-span-2">
        <label htmlFor="vcard-address" className="text-xs font-medium text-text-muted">Address / City</label>
        <input
          id="vcard-address"
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
