import React from 'react';
import type { QRConfig } from '../../../lib/types';

interface FormProps {
  config: QRConfig;
  onChange: (updated: Partial<QRConfig>) => void;
}

export const TextForm: React.FC<FormProps> = ({ config, onChange }) => (
  <div className="space-y-3">
    <label className="block text-xs font-semibold text-text-main">Text Content</label>
    <textarea
      rows={4}
      value={config.textData.text}
      onChange={(e) => onChange({ textData: { text: e.target.value } })}
      placeholder="Type any plain text or message here..."
      className="w-full neu-input rounded-control p-3 text-sm resize-y"
    />
  </div>
);

export const EmailForm: React.FC<FormProps> = ({ config, onChange }) => (
  <div className="space-y-3">
    <div>
      <label className="text-xs font-semibold text-text-main">Recipient Email</label>
      <input
        type="email"
        value={config.emailData.email}
        onChange={(e) => onChange({ emailData: { ...config.emailData, email: e.target.value } })}
        placeholder="hello@domain.com"
        className="w-full neu-input rounded-control px-3.5 py-2 text-sm mt-1"
      />
    </div>
    <div>
      <label className="text-xs font-semibold text-text-main">Subject</label>
      <input
        type="text"
        value={config.emailData.subject}
        onChange={(e) => onChange({ emailData: { ...config.emailData, subject: e.target.value } })}
        placeholder="Project Inquiry"
        className="w-full neu-input rounded-control px-3.5 py-2 text-sm mt-1"
      />
    </div>
    <div>
      <label className="text-xs font-semibold text-text-main">Body</label>
      <textarea
        rows={3}
        value={config.emailData.body}
        onChange={(e) => onChange({ emailData: { ...config.emailData, body: e.target.value } })}
        placeholder="Draft your message..."
        className="w-full neu-input rounded-control p-3 text-sm resize-y mt-1"
      />
    </div>
  </div>
);

export const PhoneForm: React.FC<FormProps> = ({ config, onChange }) => (
  <div className="space-y-3">
    <label className="block text-xs font-semibold text-text-main">Phone Number</label>
    <input
      type="tel"
      value={config.phoneData.phone}
      onChange={(e) => onChange({ phoneData: { phone: e.target.value } })}
      placeholder="+1234567890"
      className="w-full neu-input rounded-control px-3.5 py-2.5 text-sm"
    />
    <p className="text-[11px] text-text-muted">Include country code with + for international dialing.</p>
  </div>
);

export const SMSForm: React.FC<FormProps> = ({ config, onChange }) => (
  <div className="space-y-3">
    <div>
      <label className="text-xs font-semibold text-text-main">Target Phone</label>
      <input
        type="tel"
        value={config.smsData.phone}
        onChange={(e) => onChange({ smsData: { ...config.smsData, phone: e.target.value } })}
        placeholder="+1234567890"
        className="w-full neu-input rounded-control px-3.5 py-2 text-sm mt-1"
      />
    </div>
    <div>
      <label className="text-xs font-semibold text-text-main">Pre-filled SMS Text</label>
      <textarea
        rows={3}
        value={config.smsData.message}
        onChange={(e) => onChange({ smsData: { ...config.smsData, message: e.target.value } })}
        placeholder="Type SMS message..."
        className="w-full neu-input rounded-control p-3 text-sm resize-y mt-1"
      />
    </div>
  </div>
);
