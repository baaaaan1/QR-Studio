import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import type { QRConfig } from '../../lib/types';
import { DEFAULT_QR_CONFIG } from '../../lib/presets';
import { QRContentForm } from './QRContentForm';
import { QRStyleCustomizer } from './QRStyleCustomizer';
import { QRLogoManager } from './QRLogoManager';
import { QRFrameSelector } from './QRFrameSelector';
import { QRPreviewCanvas } from './QRPreviewCanvas';
import { QRExportDialog } from './QRExportDialog';
import { QRDecoderModal } from './QRDecoderModal';
import { exportPNG } from '../../lib/qr-engine';
import { detectQRContentType } from '../../lib/qr-decoder';

type StudioTab = 'content' | 'style' | 'logo' | 'frame';

export const QRStudio: React.FC = () => {
  const [config, setConfig] = useState<QRConfig>(DEFAULT_QR_CONFIG);
  const [activeTab, setActiveTab] = useState<StudioTab>('content');
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isDecoderOpen, setIsDecoderOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const updateConfig = (updated: Partial<QRConfig>) => {
    setConfig((prev) => ({ ...prev, ...updated }));
  };

  const resetConfig = () => {
    if (confirm('Reset all customizations to default template?')) {
      setConfig(DEFAULT_QR_CONFIG);
    }
  };

  const handleApplyDecodedText = (text: string) => {
    const detected = detectQRContentType(text);
    const trimmed = text.trim();

    setConfig((prev) => {
      const base: QRConfig = { ...prev, type: detected, content: trimmed };
      switch (detected) {
        case 'url':
          return { ...base, urlData: { url: trimmed } };
        case 'text':
          return { ...base, textData: { text: trimmed } };
        case 'wifi': {
          const get = (key: string) => {
            const m = new RegExp(`${key}:([^;]*)`, 'i').exec(trimmed);
            return m ? m[1] : '';
          };
          const enc = get('T').toUpperCase();
          return {
            ...base,
            wifiData: {
              ssid: get('S'),
              password: get('P'),
              encryption: enc === 'WEP' ? 'WEP' : enc === 'NOPASS' ? 'nopass' : 'WPA',
              hidden: /^true$/i.test(get('H')),
            },
          };
        }
        case 'email': {
          const m = /^mailto:([^?]*)(?:\?(.*))?/i.exec(trimmed);
          const params = new URLSearchParams(m?.[2] ?? '');
          return {
            ...base,
            emailData: {
              email: m?.[1] ? decodeURIComponent(m[1]) : trimmed,
              subject: params.get('subject') ?? '',
              body: params.get('body') ?? '',
            },
          };
        }
        case 'phone':
          return { ...base, phoneData: { phone: trimmed.replace(/^tel:/i, '') } };
        case 'sms': {
          const m = /^smsto:([^:]*):?([\s\S]*)$/i.exec(trimmed);
          return {
            ...base,
            smsData: { phone: m?.[1] ?? '', message: m?.[2] ?? '' },
          };
        }
        case 'whatsapp': {
          try {
            const u = new URL(trimmed);
            const phone = u.pathname.replace(/\//g, '');
            const message = u.searchParams.get('text') ?? '';
            return { ...base, whatsappData: { phone, message } };
          } catch {
            return { ...base, textData: { text: trimmed } };
          }
        }
        case 'crypto': {
          const m = /^(bitcoin|ethereum|solana|usdt):([^?]+)(?:\?(.*))?$/i.exec(trimmed);
          if (!m) return { ...base, textData: { text: trimmed } };
          const params = new URLSearchParams(m[3] ?? '');
          const coin = m[1].toUpperCase() === 'BITCOIN' ? 'BTC' : m[1].toUpperCase() === 'ETHEREUM' ? 'ETH' : m[1].toUpperCase() === 'SOLANA' ? 'SOL' : 'USDT';
          return {
            ...base,
            cryptoData: {
              coin,
              address: m[2],
              amount: params.get('amount') ?? params.get('value') ?? '',
            },
          };
        }
        case 'vcard':
        case 'event':
        default:
          // Keep raw payload accessible via Text form so preview stays accurate
          // even when structured parsing is not available.
          return { ...base, type: 'text', textData: { text: trimmed } };
      }
    });
    setActiveTab('content');
  };

  const handleQuickCopy = async () => {
    try {
      const dataUrl = await exportPNG(config, 800);
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ [blob.type]: blob }),
      ]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      alert('Could not copy image directly. You can use Export -> Download PNG.');
    }
  };

  const TABS: { id: StudioTab; label: string; icon: string }[] = [
    { id: 'content', label: '1. Content & Type', icon: 'solar:link-circle-outline' },
    { id: 'style', label: '2. Style & Colors', icon: 'solar:pallete-2-outline' },
    { id: 'logo', label: '3. Logo & Image', icon: 'solar:gallery-minimalistic-outline' },
    { id: 'frame', label: '4. Frame & CTA', icon: 'solar:cursor-square-outline' },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary">
              <Icon icon="solar:bolt-outline" className="h-3.5 w-3.5" />
              Astro Engine
            </span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-text-main">
            Custom QR Code Designer
          </h1>
          <p className="text-xs sm:text-sm text-text-muted mt-0.5">
            Create a QR code that suits your needs, complete with a call-to-action (CTA) frame, a custom logo, and vector export.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setIsDecoderOpen(true)}
            className="neu-button flex items-center gap-1.5 rounded-control px-3.5 py-2 text-xs font-semibold text-primary hover:opacity-90 active:scale-[0.98] transition-all"
            title="Decode / Scan QR from image or camera"
            aria-label="Open QR decoder"
          >
            <Icon icon="solar:camera-minimalistic-outline" className="h-4 w-4" />
            <span>Decode / Scan QR</span>
          </button>
          <button
            type="button"
            onClick={resetConfig}
            className="neu-button flex items-center gap-1.5 rounded-control px-3 py-2 text-xs font-medium text-text-muted hover:text-text-main"
            title="Reset to default template"
          >
            <Icon icon="solar:refresh-outline" className="h-3.5 w-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-6">
          <div className="grid grid-cols-2 gap-2 p-1.5 bg-surface rounded-card shadow-neu-sm border border-border sm:grid-cols-4">
            {TABS.map((t) => {
              const active = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setActiveTab(t.id)}
                  className={`flex min-w-0 items-center justify-center gap-2 px-2.5 py-2.5 rounded-control text-xs font-semibold transition-all sm:px-3 ${
                    active
                      ? 'bg-primary text-on-primary shadow-glow-emerald font-bold'
                      : 'text-text-muted hover:text-text-main hover:bg-surface-elevated'
                  }`}
                >
                  <Icon icon={t.icon} className="h-4 w-4" />
                  <span className="truncate">{t.label}</span>
                </button>
              );
            })}
          </div>

          <div className="transition-all duration-200">
            {activeTab === 'content' && <QRContentForm config={config} onChange={updateConfig} />}
            {activeTab === 'style' && <QRStyleCustomizer config={config} onChange={updateConfig} />}
            {activeTab === 'logo' && <QRLogoManager config={config} onChange={updateConfig} />}
            {activeTab === 'frame' && <QRFrameSelector config={config} onChange={updateConfig} />}
          </div>
        </div>

        <div className="lg:col-span-5 lg:sticky lg:top-24">
          <QRPreviewCanvas
            config={config}
            onOpenExport={() => setIsExportOpen(true)}
            onQuickCopy={handleQuickCopy}
            copied={copied}
          />
        </div>
      </div>

      <QRExportDialog isOpen={isExportOpen} onClose={() => setIsExportOpen(false)} config={config} />

      <QRDecoderModal
        isOpen={isDecoderOpen}
        onClose={() => setIsDecoderOpen(false)}
        onApplyDecodedText={handleApplyDecodedText}
      />
    </div>
  );
};
