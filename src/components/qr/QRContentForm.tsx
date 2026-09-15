import React from 'react';
import { Icon } from '@iconify/react';
import type { QRConfig, QRContentType } from '../../lib/types';
import { URLForm } from './forms/URLForm';
import { WiFiForm } from './forms/WiFiForm';
import { VCardForm } from './forms/VCardForm';
import { TextForm, EmailForm, PhoneForm, SMSForm } from './forms/TextEmailForms';
import { WhatsAppForm, CryptoForm, EventForm } from './forms/SpecializedForms';

interface QRContentFormProps {
  config: QRConfig;
  onChange: (updated: Partial<QRConfig>) => void;
}

const CONTENT_TYPES: { id: QRContentType; label: string; icon: string }[] = [
  { id: 'url', label: 'URL', icon: 'solar:link-circle-outline' },
  { id: 'wifi', label: 'Wi-Fi', icon: 'solar:wi-fi-router-minimalistic-outline' },
  { id: 'vcard', label: 'Contact', icon: 'solar:user-id-outline' },
  { id: 'whatsapp', label: 'WhatsApp', icon: 'logos:whatsapp-icon' },
  { id: 'text', label: 'Text', icon: 'solar:text-outline' },
  { id: 'email', label: 'Email', icon: 'solar:letter-outline' },
  { id: 'phone', label: 'Phone', icon: 'solar:phone-calling-outline' },
  { id: 'sms', label: 'SMS', icon: 'solar:chat-round-line-outline' },
  { id: 'crypto', label: 'Crypto', icon: 'solar:dollar-minimalistic-outline' },
  { id: 'event', label: 'Event', icon: 'solar:calendar-outline' },
];

export const QRContentForm: React.FC<QRContentFormProps> = ({ config, onChange }) => {
  return (
    <div className="space-y-4">
      {/* 2-row vertical button grid */}
      <div className="grid grid-cols-5 gap-2 sm:gap-2.5">
        {CONTENT_TYPES.map((t) => {
          const isActive = config.type === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onChange({ type: t.id })}
              className={`flex flex-col items-center justify-center gap-1.5 rounded-control px-2 py-2.5 text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-primary text-white shadow-glow-indigo'
                  : 'neu-button text-text-muted hover:text-text-main'
              }`}
              aria-label={`Select ${t.label} QR type`}
              title={t.label}
            >
              <Icon icon={t.icon} className="h-4 w-4" />
              <span className="truncate w-full text-center text-[11px]">{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Dynamic Content Panel */}
      <div className="rounded-card neu-card p-4 sm:p-5">
        {config.type === 'url' && <URLForm config={config} onChange={onChange} />}
        {config.type === 'wifi' && <WiFiForm config={config} onChange={onChange} />}
        {config.type === 'vcard' && <VCardForm config={config} onChange={onChange} />}
        {config.type === 'whatsapp' && <WhatsAppForm config={config} onChange={onChange} />}
        {config.type === 'text' && <TextForm config={config} onChange={onChange} />}
        {config.type === 'email' && <EmailForm config={config} onChange={onChange} />}
        {config.type === 'phone' && <PhoneForm config={config} onChange={onChange} />}
        {config.type === 'sms' && <SMSForm config={config} onChange={onChange} />}
        {config.type === 'crypto' && <CryptoForm config={config} onChange={onChange} />}
        {config.type === 'event' && <EventForm config={config} onChange={onChange} />}
      </div>
    </div>
  );
};
