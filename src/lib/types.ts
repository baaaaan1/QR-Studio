export type QRContentType =
  | 'url'
  | 'text'
  | 'wifi'
  | 'vcard'
  | 'email'
  | 'phone'
  | 'sms'
  | 'whatsapp'
  | 'crypto'
  | 'event';

export type QRDotType =
  | 'square'
  | 'dots'
  | 'rounded'
  | 'classy'
  | 'classy-rounded'
  | 'extra-rounded';

export type QRCornerSquareType = 'square' | 'dot' | 'extra-rounded';
export type QRCornerDotType = 'square' | 'dot';

export type FrameType =
  | 'none'
  | 'scan-me-bottom'
  | 'top-banner'
  | 'polaroid'
  | 'phone'
  | 'neon-badge'
  | 'ticket';

export interface GradientConfig {
  type: 'linear' | 'radial';
  rotation: number;
  colorStops: { offset: number; color: string }[];
}

export interface QRConfig {
  // Content
  type: QRContentType;
  content: string;
  // Specific data representations
  urlData: { url: string };
  textData: { text: string };
  wifiData: { ssid: string; password: string; encryption: 'WPA' | 'WEP' | 'nopass'; hidden: boolean };
  vcardData: {
    firstName: string;
    lastName: string;
    organization: string;
    title: string;
    phone: string;
    email: string;
    url: string;
    address: string;
  };
  emailData: { email: string; subject: string; body: string };
  phoneData: { phone: string };
  smsData: { phone: string; message: string };
  whatsappData: { phone: string; message: string };
  cryptoData: { coin: 'BTC' | 'ETH' | 'SOL' | 'USDT'; address: string; amount: string };
  eventData: { title: string; location: string; start: string; end: string; notes: string };

  // Styling
  dotType: QRDotType;
  cornerSquareType: QRCornerSquareType;
  cornerDotType: QRCornerDotType;
  useGradient: boolean;
  dotColor: string;
  gradient: GradientConfig;
  cornerSquareColor: string;
  cornerDotColor: string;
  bgColor: string;
  transparentBg: boolean;
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H';

  // Logo
  logoUrl: string | null;
  logoSize: number; // 0.1 to 0.4
  logoMargin: number; // 0 to 20
  logoBgColor: string;
  hideLogoBg: boolean;
  removeLogoBgApplied: boolean;

  // Frame
  frameType: FrameType;
  frameText: string;
  frameTopText: string;
  frameTextPosition: 'bottom' | 'top' | 'both';
  frameColor: string;
  frameTextColor: string;
  frameBgColor: string;
}

export interface DecodedQRResult {
  text: string;
  detectedType: QRContentType;
  timestamp: number;
}
