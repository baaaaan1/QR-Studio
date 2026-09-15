import QRCodeStyling, { type Options } from 'qr-code-styling';
import type { QRConfig } from './types';
import { formatQRContent } from './qr-formatter';
import { compositeQRWithFrame } from './qr-frames';

export { compositeQRWithFrame } from './qr-frames';

/**
 * Creates and configures QRCodeStyling instance
 */
export function createQRCodeInstance(config: QRConfig, size = 400): QRCodeStyling {
  const content = formatQRContent(config);

  const dotsOptions: Options['dotsOptions'] = {
    type: config.dotType,
  };

  if (config.useGradient && config.gradient) {
    dotsOptions.gradient = {
      type: config.gradient.type,
      rotation: (config.gradient.rotation * Math.PI) / 180,
      colorStops: config.gradient.colorStops,
    };
  } else {
    dotsOptions.color = config.dotColor;
  }

  const cornersSquareOptions: Options['cornersSquareOptions'] = {
    type: config.cornerSquareType,
    color: config.cornerSquareColor || config.dotColor,
  };

  const cornersDotOptions: Options['cornersDotOptions'] = {
    type: config.cornerDotType,
    color: config.cornerDotColor || config.dotColor,
  };

  const backgroundOptions: Options['backgroundOptions'] = {
    color: config.transparentBg ? 'transparent' : config.bgColor,
  };

  const imageOptions: Options['imageOptions'] = {
    hideBackgroundDots: !config.hideLogoBg,
    imageSize: config.logoSize,
    margin: config.logoMargin,
    crossOrigin: 'anonymous',
  };

  return new QRCodeStyling({
    width: size,
    height: size,
    type: 'canvas',
    data: content,
    image: config.logoUrl || undefined,
    dotsOptions,
    cornersSquareOptions,
    cornersDotOptions,
    backgroundOptions,
    imageOptions,
    qrOptions: {
      errorCorrectionLevel: config.logoUrl ? 'H' : config.errorCorrectionLevel,
    },
  });
}

/**
 * Export composite canvas as high resolution PNG data URL
 */
export async function exportPNG(config: QRConfig, targetSize = 1024): Promise<string> {
  const qr = createQRCodeInstance(config, targetSize);
  const rawBlob = await qr.getRawData('png');
  if (!rawBlob) throw new Error('Failed to generate QR data');

  const img = new Image();
  const blobUrl = URL.createObjectURL(rawBlob as Blob);

  return new Promise((resolve, reject) => {
    img.onload = async () => {
      try {
        const rawCanvas = document.createElement('canvas');
        rawCanvas.width = img.width;
        rawCanvas.height = img.height;
        const ctx = rawCanvas.getContext('2d');
        if (!ctx) return reject(new Error('Canvas context error'));
        ctx.drawImage(img, 0, 0);

        const finalCanvas = document.createElement('canvas');
        await compositeQRWithFrame(rawCanvas, config, finalCanvas);
        URL.revokeObjectURL(blobUrl);
        resolve(finalCanvas.toDataURL('image/png'));
      } catch (err) {
        reject(err);
      }
    };
    img.onerror = (e) => reject(e);
    img.src = blobUrl;
  });
}

/**
 * Export pure SVG vector
 */
export async function exportSVG(config: QRConfig): Promise<string> {
  const qr = createQRCodeInstance(config, 600);
  const rawBlob = await qr.getRawData('svg');
  if (!rawBlob) throw new Error('Failed to generate SVG data');
  return await (rawBlob as Blob).text();
}

