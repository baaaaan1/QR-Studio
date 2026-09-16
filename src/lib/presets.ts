import type { GradientConfig, QRConfig } from './types';

export interface ColorPreset {
  id: string;
  name: string;
  dotColor: string;
  bgColor: string;
  useGradient: boolean;
  gradient?: {
    type: 'linear' | 'radial';
    rotation: number;
    colorStops: { offset: number; color: string }[];
  };
  cornerSquareColor: string;
  cornerDotColor: string;
}

export const COLOR_PRESETS: ColorPreset[] = [
  {
    id: 'signal-emerald',
    name: 'Signal Emerald',
    dotColor: '#10B981',
    bgColor: '#FFFFFF',
    useGradient: true,
    gradient: {
      type: 'linear',
      rotation: 45,
      colorStops: [
        { offset: 0, color: '#10B981' },
        { offset: 1, color: '#38BDF8' },
      ],
    },
    cornerSquareColor: '#10B981',
    cornerDotColor: '#38BDF8',
  },
  {
    id: 'sky-signal',
    name: 'Sky Signal',
    dotColor: '#38BDF8',
    bgColor: '#192126',
    useGradient: true,
    gradient: {
      type: 'linear',
      rotation: 90,
      colorStops: [
        { offset: 0, color: '#38BDF8' },
        { offset: 1, color: '#10B981' },
      ],
    },
    cornerSquareColor: '#38BDF8',
    cornerDotColor: '#10B981',
  },
  {
    id: 'emerald-field',
    name: 'Emerald Field',
    dotColor: '#10B981',
    bgColor: '#FFFFFF',
    useGradient: true,
    gradient: {
      type: 'linear',
      rotation: 135,
      colorStops: [
        { offset: 0, color: '#10B981' },
        { offset: 1, color: '#38BDF8' },
      ],
    },
    cornerSquareColor: '#10B981',
    cornerDotColor: '#172126',
  },
  {
    id: 'aqua-pulse',
    name: 'Aqua Pulse',
    dotColor: '#38BDF8',
    bgColor: '#FFFFFF',
    useGradient: true,
    gradient: {
      type: 'linear',
      rotation: 45,
      colorStops: [
        { offset: 0, color: '#38BDF8' },
        { offset: 1, color: '#10B981' },
      ],
    },
    cornerSquareColor: '#38BDF8',
    cornerDotColor: '#10B981',
  },
  {
    id: 'ocean-signal',
    name: 'Ocean Signal',
    dotColor: '#10B981',
    bgColor: '#FFFFFF',
    useGradient: true,
    gradient: {
      type: 'linear',
      rotation: 135,
      colorStops: [
        { offset: 0, color: '#10B981' },
        { offset: 1, color: '#38BDF8' },
      ],
    },
    cornerSquareColor: '#10B981',
    cornerDotColor: '#38BDF8',
  },
  {
    id: 'signal-mint',
    name: 'Signal Mint',
    dotColor: '#10B981',
    bgColor: '#FFFFFF',
    useGradient: true,
    gradient: {
      type: 'linear',
      rotation: 90,
      colorStops: [
        { offset: 0, color: '#10B981' },
        { offset: 1, color: '#38BDF8' },
      ],
    },
    cornerSquareColor: '#10B981',
    cornerDotColor: '#38BDF8',
  },
  {
    id: 'signal-current',
    name: 'Signal Current',
    dotColor: '#38BDF8',
    bgColor: '#FFFFFF',
    useGradient: true,
    gradient: {
      type: 'linear',
      rotation: 45,
      colorStops: [
        { offset: 0, color: '#38BDF8' },
        { offset: 1, color: '#10B981' },
      ],
    },
    cornerSquareColor: '#38BDF8',
    cornerDotColor: '#10B981',
  },
  {
    id: 'maker-matrix',
    name: 'Maker Matrix',
    dotColor: '#10B981',
    bgColor: '#192126',
    useGradient: true,
    gradient: {
      type: 'linear',
      rotation: 180,
      colorStops: [
        { offset: 0, color: '#22C55E' },
        { offset: 1, color: '#10B981' },
      ],
    },
    cornerSquareColor: '#10B981',
    cornerDotColor: '#38BDF8',
  },
  {
    id: 'abyss-signal',
    name: 'Abyss Signal',
    dotColor: '#172126',
    bgColor: '#FFFFFF',
    useGradient: true,
    gradient: {
      type: 'linear',
      rotation: 135,
      colorStops: [
        { offset: 0, color: '#172126' },
        { offset: 1, color: '#10B981' },
      ],
    },
    cornerSquareColor: '#172126',
    cornerDotColor: '#10B981',
  },
  {
    id: 'deep-current',
    name: 'Deep Current',
    dotColor: '#38BDF8',
    bgColor: '#FFFFFF',
    useGradient: true,
    gradient: {
      type: 'linear',
      rotation: 45,
      colorStops: [
        { offset: 0, color: '#38BDF8' },
        { offset: 1, color: '#172126' },
      ],
    },
    cornerSquareColor: '#38BDF8',
    cornerDotColor: '#172126',
  },
  {
    id: 'radial-abyss',
    name: 'Radial Abyss',
    dotColor: '#10B981',
    bgColor: '#FFFFFF',
    useGradient: true,
    gradient: {
      type: 'radial',
      rotation: 0,
      colorStops: [
        { offset: 0, color: '#10B981' },
        { offset: 1, color: '#38BDF8' },
      ],
    },
    cornerSquareColor: '#10B981',
    cornerDotColor: '#38BDF8',
  },
  {
    id: 'signal-highlight',
    name: 'Signal Highlight',
    dotColor: '#0E9F6E',
    bgColor: '#FFFFFF',
    useGradient: true,
    gradient: {
      type: 'radial',
      rotation: 0,
      colorStops: [
        { offset: 0, color: '#0E9F6E' },
        { offset: 1, color: '#0284C7' },
      ],
    },
    cornerSquareColor: '#0E9F6E',
    cornerDotColor: '#0284C7',
  },
  {
    id: 'monolith-dark',
    name: 'Monolith Dark',
    dotColor: '#172126',
    bgColor: '#FFFFFF',
    useGradient: false,
    cornerSquareColor: '#172126',
    cornerDotColor: '#10B981',
  },
  {
    id: 'pure-contrast',
    name: 'Pure Contrast',
    dotColor: '#000000',
    bgColor: '#FFFFFF',
    useGradient: false,
    cornerSquareColor: '#000000',
    cornerDotColor: '#000000',
  },
];

export interface GradientPreset {
  id: string;
  name: string;
  gradient: GradientConfig;
}

export const GRADIENT_PRESETS: GradientPreset[] = [
  {
    id: 'emerald-sky-diagonal',
    name: 'Emerald Sky',
    gradient: {
      type: 'linear',
      rotation: 45,
      colorStops: [
        { offset: 0, color: '#10B981' },
        { offset: 1, color: '#38BDF8' },
      ],
    },
  },
  {
    id: 'mint-horizon',
    name: 'Mint Horizon',
    gradient: {
      type: 'linear',
      rotation: 0,
      colorStops: [
        { offset: 0, color: '#10B981' },
        { offset: 1, color: '#38BDF8' },
      ],
    },
  },
  {
    id: 'signal-vertical',
    name: 'Signal Rise',
    gradient: {
      type: 'linear',
      rotation: 90,
      colorStops: [
        { offset: 0, color: '#10B981' },
        { offset: 1, color: '#38BDF8' },
      ],
    },
  },
  {
    id: 'moss-depth',
    name: 'Moss Depth',
    gradient: {
      type: 'linear',
      rotation: 135,
      colorStops: [
        { offset: 0, color: '#22C55E' },
        { offset: 1, color: '#38BDF8' },
      ],
    },
  },
  {
    id: 'signal-flow',
    name: 'Signal Flow',
    gradient: {
      type: 'linear',
      rotation: 45,
      colorStops: [
        { offset: 0, color: '#10B981' },
        { offset: 0.5, color: '#38BDF8' },
        { offset: 1, color: '#0284C7' },
      ],
    },
  },
  {
    id: 'signal-three-stop',
    name: 'Signal Cascade',
    gradient: {
      type: 'linear',
      rotation: 135,
      colorStops: [
        { offset: 0, color: '#10B981' },
        { offset: 0.5, color: '#38BDF8' },
        { offset: 1, color: '#0284C7' },
      ],
    },
  },
  {
    id: 'radial-current',
    name: 'Signal Pulse',
    gradient: {
      type: 'radial',
      rotation: 0,
      colorStops: [
        { offset: 0, color: '#10B981' },
        { offset: 1, color: '#172126' },
      ],
    },
  },
  {
    id: 'radial-glacier',
    name: 'Glacier Bloom',
    gradient: {
      type: 'radial',
      rotation: 0,
      colorStops: [
        { offset: 0, color: '#6EE7B7' },
        { offset: 0.55, color: '#10B981' },
        { offset: 1, color: '#38BDF8' },
      ],
    },
  },
];

export interface LogoPreset {
  id: string;
  name: string;
  icon: string;
}

export const LOGO_PRESETS: LogoPreset[] = [
  { id: 'globe', name: 'Website', icon: 'solar:global-outline' },
  { id: 'wifi', name: 'Wi-Fi', icon: 'solar:wi-fi-router-minimalistic-outline' },
  { id: 'whatsapp', name: 'WhatsApp', icon: 'logos:whatsapp-icon' },
  { id: 'instagram', name: 'Instagram', icon: 'skill-icons:instagram' },
  { id: 'youtube', name: 'YouTube', icon: 'logos:youtube-icon' },
  { id: 'twitter', name: 'X / Twitter', icon: 'logos:twitter' },
  { id: 'github', name: 'GitHub', icon: 'skill-icons:github-dark' },
  { id: 'linkedin', name: 'LinkedIn', icon: 'logos:linkedin-icon' },
  { id: 'mail', name: 'Email', icon: 'solar:letter-outline' },
  { id: 'phone', name: 'Call', icon: 'solar:phone-calling-outline' },
];

export const DEFAULT_QR_CONFIG: QRConfig = {
  type: 'url',
  content: 'https://qrstudio.dev',
  urlData: { url: 'https://qrstudio.dev' },
  textData: { text: 'Welcome to QR Studio!' },
  wifiData: { ssid: 'Office-WiFi', password: 'securepassword123', encryption: 'WPA', hidden: false },
  vcardData: {
    firstName: 'Alex',
    lastName: 'Morgan',
    organization: 'Studio Corp',
    title: 'Design Engineer',
    phone: '+1 555-0199',
    email: 'alex@example.com',
    url: 'https://example.com',
    address: 'San Francisco, CA',
  },
  emailData: { email: 'hello@example.com', subject: 'Inquiry from QR Code', body: 'Hi, I would like to learn more.' },
  phoneData: { phone: '+15551234567' },
  smsData: { phone: '+15551234567', message: 'Hello from QR Studio' },
  whatsappData: { phone: '628123456789', message: 'Hello! I scanned your QR code.' },
  cryptoData: { coin: 'BTC', address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh', amount: '0.005' },
  eventData: {
    title: 'Design Tech Summit 2026',
    location: 'Innovation Hub, Floor 4',
    start: '2026-10-15T09:00',
    end: '2026-10-15T17:00',
    notes: 'Please bring your attendee QR ticket.',
  },

  dotType: 'rounded',
  cornerSquareType: 'extra-rounded',
  cornerDotType: 'dot',
  useGradient: true,
  dotColor: '#10B981',
  gradient: {
    type: 'linear',
    rotation: 45,
    colorStops: [
      { offset: 0, color: '#10B981' },
      { offset: 1, color: '#38BDF8' },
    ],
  },
  cornerSquareColor: '#10B981',
  cornerDotColor: '#38BDF8',
  bgColor: '#FFFFFF',
  transparentBg: false,
  errorCorrectionLevel: 'Q',

  logoUrl: null,
  logoSize: 0.26,
  logoMargin: 4,
  logoBgColor: '#FFFFFF',
  hideLogoBg: false,
  removeLogoBgApplied: false,

  frameType: 'scan-me-bottom',
  frameText: 'SCAN ME',
  frameTopText: 'SCAN HERE',
  frameTextPosition: 'bottom',
  frameColor: '#10B981',
  frameTextColor: '#172126',
  frameBgColor: '#FAFCFC',
};
