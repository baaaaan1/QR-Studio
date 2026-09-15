import jsQR from 'jsqr';
import type { DecodedQRResult, QRContentType } from './types';

/**
 * Detects QR content type from raw string
 */
export function detectQRContentType(raw: string): QRContentType {
  const text = raw.trim();
  if (/^https?:\/\//i.test(text)) return 'url';
  if (/^WIFI:/i.test(text)) return 'wifi';
  if (/^BEGIN:VCARD/i.test(text)) return 'vcard';
  if (/^mailto:/i.test(text)) return 'email';
  if (/^tel:/i.test(text)) return 'phone';
  if (/^smsto:/i.test(text)) return 'sms';
  if (/^https?:\/\/(wa\.me|api\.whatsapp\.com)/i.test(text)) return 'whatsapp';
  if (/^(bitcoin|ethereum|solana):/i.test(text)) return 'crypto';
  if (/^BEGIN:VCALENDAR/i.test(text)) return 'event';
  return 'text';
}

/**
 * Decodes a QR code from an Image file or Data URL
 */
export async function decodeQRFromImage(fileOrUrl: File | string): Promise<DecodedQRResult> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    let objectUrl = '';
    if (typeof fileOrUrl !== 'string') {
      objectUrl = URL.createObjectURL(fileOrUrl);
      img.src = objectUrl;
    } else {
      img.src = fileOrUrl;
    }

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          if (objectUrl) URL.revokeObjectURL(objectUrl);
          return reject(new Error('Canvas context error'));
        }

        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: 'attemptBoth',
        });

        if (objectUrl) URL.revokeObjectURL(objectUrl);

        if (code && code.data) {
          resolve({
            text: code.data,
            detectedType: detectQRContentType(code.data),
            timestamp: Date.now(),
          });
        } else {
          reject(new Error('No QR code detected in the provided image. Please check image quality.'));
        }
      } catch (err) {
        if (objectUrl) URL.revokeObjectURL(objectUrl);
        reject(err);
      }
    };

    img.onerror = () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
      reject(new Error('Failed to load image for scanning.'));
    };
  });
}

/**
 * Scans a single frame from video element
 */
export function scanVideoFrame(video: HTMLVideoElement): DecodedQRResult | null {
  if (video.readyState !== video.HAVE_ENOUGH_DATA) return null;

  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const code = jsQR(imageData.data, imageData.width, imageData.height, {
    inversionAttempts: 'attemptBoth',
  });

  if (code && code.data) {
    return {
      text: code.data,
      detectedType: detectQRContentType(code.data),
      timestamp: Date.now(),
    };
  }
  return null;
}
