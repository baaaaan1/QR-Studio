import React from 'react';
import type { QRConfig } from '../../../lib/types';

interface FormProps {
  config: QRConfig;
  onChange: (updated: Partial<QRConfig>) => void;
}

export const WhatsAppForm: React.FC<FormProps> = ({ config, onChange }) => (
  <div className="space-y-3">
    <div>
      <label className="text-xs font-semibold text-text-main">
        WhatsApp Number (with country code, no + or symbols)
      </label>
      <input
        type="tel"
        value={config.whatsappData.phone}
        onChange={(e) => onChange({ whatsappData: { ...config.whatsappData, phone: e.target.value } })}
        placeholder="e.g. 628123456789"
        className="w-full neu-input rounded-control px-3.5 py-2 text-sm mt-1"
      />
    </div>
    <div>
      <label className="text-xs font-semibold text-text-main">Prefilled Message</label>
      <textarea
        rows={3}
        value={config.whatsappData.message}
        onChange={(e) => onChange({ whatsappData: { ...config.whatsappData, message: e.target.value } })}
        placeholder="Hi, I scanned your QR code!"
        className="w-full neu-input rounded-control p-3 text-sm resize-y mt-1"
      />
    </div>
  </div>
);

export const CryptoForm: React.FC<FormProps> = ({ config, onChange }) => (
  <div className="space-y-3">
    <div className="grid grid-cols-2 gap-3">
      <div>
        <label className="text-xs font-semibold text-text-main">Cryptocurrency</label>
        <select
          value={config.cryptoData.coin}
          onChange={(e) =>
            onChange({
              cryptoData: {
                ...config.cryptoData,
                coin: e.target.value as 'BTC' | 'ETH' | 'SOL' | 'USDT',
              },
            })
          }
          className="w-full neu-input rounded-control px-3 py-2 text-sm bg-surface mt-1"
        >
          <option value="BTC">Bitcoin (BTC)</option>
          <option value="ETH">Ethereum (ETH)</option>
          <option value="SOL">Solana (SOL)</option>
          <option value="USDT">Tether (USDT)</option>
        </select>
      </div>
      <div>
        <label className="text-xs font-semibold text-text-main">Amount (Optional)</label>
        <input
          type="text"
          value={config.cryptoData.amount}
          onChange={(e) => onChange({ cryptoData: { ...config.cryptoData, amount: e.target.value } })}
          placeholder="0.05"
          className="w-full neu-input rounded-control px-3 py-2 text-sm mt-1"
        />
      </div>
    </div>
    <div>
      <label className="text-xs font-semibold text-text-main">Wallet Address</label>
      <input
        type="text"
        value={config.cryptoData.address}
        onChange={(e) => onChange({ cryptoData: { ...config.cryptoData, address: e.target.value } })}
        placeholder="Paste receiver wallet address"
        className="w-full neu-input rounded-control px-3.5 py-2 text-xs font-mono mt-1"
      />
    </div>
  </div>
);

export const EventForm: React.FC<FormProps> = ({ config, onChange }) => (
  <div className="space-y-3">
    <div>
      <label className="text-xs font-semibold text-text-main">Event Title</label>
      <input
        type="text"
        value={config.eventData.title}
        onChange={(e) => onChange({ eventData: { ...config.eventData, title: e.target.value } })}
        placeholder="Tech Keynote & Workshop"
        className="w-full neu-input rounded-control px-3.5 py-2 text-sm mt-1"
      />
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div>
        <label className="text-xs font-semibold text-text-main">Start Date & Time</label>
        <input
          type="datetime-local"
          value={config.eventData.start}
          onChange={(e) => onChange({ eventData: { ...config.eventData, start: e.target.value } })}
          className="w-full neu-input rounded-control px-3 py-1.5 text-xs bg-surface mt-1"
        />
      </div>
      <div>
        <label className="text-xs font-semibold text-text-main">End Date & Time</label>
        <input
          type="datetime-local"
          value={config.eventData.end}
          onChange={(e) => onChange({ eventData: { ...config.eventData, end: e.target.value } })}
          className="w-full neu-input rounded-control px-3 py-1.5 text-xs bg-surface mt-1"
        />
      </div>
    </div>
    <div>
      <label className="text-xs font-semibold text-text-main">Location</label>
      <input
        type="text"
        value={config.eventData.location}
        onChange={(e) => onChange({ eventData: { ...config.eventData, location: e.target.value } })}
        placeholder="Main Convention Center"
        className="w-full neu-input rounded-control px-3.5 py-2 text-sm mt-1"
      />
    </div>
  </div>
);
