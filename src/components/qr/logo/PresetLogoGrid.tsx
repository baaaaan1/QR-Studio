import React, { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import { LOGO_PRESETS } from '../../../lib/presets';

interface Props {
  onSelect: (dataUrl: string) => void;
}

interface IconifyIcon {
  body: string;
  width?: number;
  height?: number;
  left?: number;
  top?: number;
}

interface IconifyResponse {
  width?: number;
  height?: number;
  icons?: Record<string, IconifyIcon>;
}

function createSvgDataUrl(icon: IconifyIcon, fallbackWidth = 24, fallbackHeight = 24): string {
  const width = icon.width ?? fallbackWidth;
  const height = icon.height ?? fallbackHeight;
  const left = icon.left ?? 0;
  const top = icon.top ?? 0;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${left} ${top} ${width} ${height}">${icon.body}</svg>`;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export const PresetLogoGrid: React.FC<Props> = ({ onSelect }) => {
  const [iconUrls, setIconUrls] = useState<Record<string, string>>({});
  const [failedIds, setFailedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    let cancelled = false;

    const loadIcons = async () => {
      const loadedEntries = await Promise.all(
        LOGO_PRESETS.map(async (preset) => {
          const [prefix, name] = preset.icon.split(':');
          if (!prefix || !name) return [preset.id, null] as const;

          try {
            const response = await fetch(
              `https://api.iconify.design/${encodeURIComponent(prefix)}.json?icons=${encodeURIComponent(name)}`
            );
            if (!response.ok) throw new Error(`Icon request failed: ${response.status}`);

            const data = (await response.json()) as IconifyResponse;
            const icon = data.icons?.[name];
            if (!icon) throw new Error(`Icon ${preset.icon} was not found`);

            return [preset.id, createSvgDataUrl(icon, data.width, data.height)] as const;
          } catch (error) {
            console.warn(`Unable to load preset icon "${preset.name}".`, error);
            return [preset.id, null] as const;
          }
        })
      );

      if (cancelled) return;

      const urls: Record<string, string> = {};
      const failed = new Set<string>();
      loadedEntries.forEach(([id, url]) => {
        if (url) urls[id] = url;
        else failed.add(id);
      });
      setIconUrls(urls);
      setFailedIds(failed);
    };

    void loadIcons();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="space-y-2.5">
      <label className="text-xs font-semibold text-text-main block">Preset Badges &amp; Logos</label>
      <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
        {LOGO_PRESETS.map((item) => {
          const iconUrl = iconUrls[item.id];
          const isFailed = failedIds.has(item.id);

          return (
            <button
              key={item.id}
              type="button"
              disabled={!iconUrl}
              onClick={() => iconUrl && onSelect(iconUrl)}
              className="neu-button group flex min-h-11 items-center justify-center rounded-control p-2.5 transition-all hover:border-primary/50 disabled:cursor-wait disabled:opacity-60"
              title={isFailed ? `${item.name} logo could not be loaded` : item.name}
              aria-label={`Use ${item.name} as the QR logo`}
            >
              {iconUrl ? (
                <img
                  src={iconUrl}
                  alt=""
                  className="h-5 w-5 object-contain transition-transform group-hover:scale-110"
                />
              ) : isFailed ? (
                <Icon icon="solar:danger-triangle-outline" className="h-5 w-5 text-pink-accent" aria-hidden="true" />
              ) : (
                <Icon icon="solar:refresh-outline" className="h-5 w-5 animate-spin text-primary" aria-hidden="true" />
              )}
            </button>
          );
        })}
      </div>
      <p className="text-[11px] text-text-muted">Select a badge to add its official icon as your QR logo.</p>
    </div>
  );
};
