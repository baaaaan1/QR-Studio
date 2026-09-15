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
    id: 'neon-indigo',
    name: 'Neon Indigo',
    dotColor: '#5B5CEB',
    bgColor: '#FFFFFF',
    useGradient: true,
    gradient: {
      type: 'linear',
      rotation: 45,
      colorStops: [
        { offset: 0, color: '#5B5CEB' },
        { offset: 1, color: '#22C8F6' },
      ],
    },
    cornerSquareColor: '#5B5CEB',
    cornerDotColor: '#22C8F6',
  },
  {
    id: 'cyber-cyan',
    name: 'Cyber Cyan',
    dotColor: '#22C8F6',
    bgColor: '#101522',
    useGradient: true,
    gradient: {
      type: 'linear',
      rotation: 90,
      colorStops: [
        { offset: 0, color: '#22C8F6' },
        { offset: 1, color: '#35C98A' },
      ],
    },
    cornerSquareColor: '#22C8F6',
    cornerDotColor: '#35C98A',
  },
  {
    id: 'emerald-glow',
    name: 'Emerald Mint',
    dotColor: '#35C98A',
    bgColor: '#FFFFFF',
    useGradient: true,
    gradient: {
      type: 'linear',
      rotation: 135,
      colorStops: [
        { offset: 0, color: '#35C98A' },
        { offset: 1, color: '#22C8F6' },
      ],
    },
    cornerSquareColor: '#35C98A',
    cornerDotColor: '#172033',
  },
  {
    id: 'sunset-magenta',
    name: 'Sunset Neon',
    dotColor: '#F06EAE',
    bgColor: '#FFFFFF',
    useGradient: true,
    gradient: {
      type: 'linear',
      rotation: 45,
      colorStops: [
        { offset: 0, color: '#F06EAE' },
        { offset: 1, color: '#5B5CEB' },
      ],
    },
    cornerSquareColor: '#F06EAE',
    cornerDotColor: '#5B5CEB',
  },
  {
    id: 'hyper-violet',
    name: 'Hyper Violet',
    dotColor: '#7928CA',
    bgColor: '#FFFFFF',
    useGradient: true,
    gradient: {
      type: 'linear',
      rotation: 135,
      colorStops: [
        { offset: 0, color: '#7928CA' },
        { offset: 1, color: '#FF0080' },
      ],
    },
    cornerSquareColor: '#7928CA',
    cornerDotColor: '#FF0080',
  },
  {
    id: 'aurora-lime',
    name: 'Aurora Lime',
    dotColor: '#10B981',
    bgColor: '#FFFFFF',
    useGradient: true,
    gradient: {
      type: 'linear',
      rotation: 90,
      colorStops: [
        { offset: 0, color: '#10B981' },
        { offset: 1, color: '#06B6D4' },
      ],
    },
    cornerSquareColor: '#10B981',
    cornerDotColor: '#06B6D4',
  },
  {
    id: 'electric-flame',
    name: 'Electric Flame',
    dotColor: '#FF416C',
    bgColor: '#FFFFFF',
    useGradient: true,
    gradient: {
      type: 'linear',
      rotation: 45,
      colorStops: [
        { offset: 0, color: '#FF416C' },
        { offset: 1, color: '#FF4B2B' },
      ],
    },
    cornerSquareColor: '#FF416C',
    cornerDotColor: '#FF4B2B',
  },
  {
    id: 'cyber-matrix',
    name: 'Cyber Matrix',
    dotColor: '#10B981',
    bgColor: '#0F172A',
    useGradient: true,
    gradient: {
      type: 'linear',
      rotation: 180,
      colorStops: [
        { offset: 0, color: '#047857' },
        { offset: 1, color: '#10B981' },
      ],
    },
    cornerSquareColor: '#10B981',
    cornerDotColor: '#34D399',
  },
  {
    id: 'midnight-ocean',
    name: 'Midnight Ocean',
    dotColor: '#1E3A8A',
    bgColor: '#FFFFFF',
    useGradient: true,
    gradient: {
      type: 'linear',
      rotation: 135,
      colorStops: [
        { offset: 0, color: '#1E3A8A' },
        { offset: 1, color: '#38BDF8' },
      ],
    },
    cornerSquareColor: '#1E3A8A',
    cornerDotColor: '#38BDF8',
  },
  {
    id: 'crimson-glow',
    name: 'Crimson Glow',
    dotColor: '#E11D48',
    bgColor: '#FFFFFF',
    useGradient: true,
    gradient: {
      type: 'linear',
      rotation: 45,
      colorStops: [
        { offset: 0, color: '#E11D48' },
        { offset: 1, color: '#4C1D95' },
      ],
    },
    cornerSquareColor: '#E11D48',
    cornerDotColor: '#4C1D95',
  },
  {
    id: 'radial-nebula',
    name: 'Radial Nebula',
    dotColor: '#A855F7',
    bgColor: '#FFFFFF',
    useGradient: true,
    gradient: {
      type: 'radial',
      rotation: 0,
      colorStops: [
        { offset: 0, color: '#A855F7' },
        { offset: 1, color: '#3B82F6' },
      ],
    },
    cornerSquareColor: '#A855F7',
    cornerDotColor: '#3B82F6',
  },
  {
    id: 'radial-solar',
    name: 'Radial Solar',
    dotColor: '#F59E0B',
    bgColor: '#FFFFFF',
    useGradient: true,
    gradient: {
      type: 'radial',
      rotation: 0,
      colorStops: [
        { offset: 0, color: '#F59E0B' },
        { offset: 1, color: '#EF4444' },
      ],
    },
    cornerSquareColor: '#F59E0B',
    cornerDotColor: '#EF4444',
  },
  {
    id: 'monolith-dark',
    name: 'Monolith Dark',
    dotColor: '#172033',
    bgColor: '#EFF3F9',
    useGradient: false,
    cornerSquareColor: '#172033',
    cornerDotColor: '#5B5CEB',
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
    id: 'indigo-cyan-diagonal',
    name: 'Indigo Cyan',
    gradient: {
      type: 'linear',
      rotation: 45,
      colorStops: [
        { offset: 0, color: '#5B5CEB' },
        { offset: 1, color: '#22C8F6' },
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
        { offset: 1, color: '#06B6D4' },
      ],
    },
  },
  {
    id: 'violet-vertical',
    name: 'Violet Rise',
    gradient: {
      type: 'linear',
      rotation: 90,
      colorStops: [
        { offset: 0, color: '#7C3AED' },
        { offset: 1, color: '#EC4899' },
      ],
    },
  },
  {
    id: 'ocean-depth',
    name: 'Ocean Depth',
    gradient: {
      type: 'linear',
      rotation: 135,
      colorStops: [
        { offset: 0, color: '#0369A1' },
        { offset: 1, color: '#2DD4BF' },
      ],
    },
  },
  {
    id: 'sunset-three-stop',
    name: 'Sunset Flow',
    gradient: {
      type: 'linear',
      rotation: 45,
      colorStops: [
        { offset: 0, color: '#F43F5E' },
        { offset: 0.5, color: '#F97316' },
        { offset: 1, color: '#FACC15' },
      ],
    },
  },
  {
    id: 'aurora-three-stop',
    name: 'Aurora Flow',
    gradient: {
      type: 'linear',
      rotation: 135,
      colorStops: [
        { offset: 0, color: '#8B5CF6' },
        { offset: 0.5, color: '#22D3EE' },
        { offset: 1, color: '#34D399' },
      ],
    },
  },
  {
    id: 'radial-cosmic',
    name: 'Cosmic Pulse',
    gradient: {
      type: 'radial',
      rotation: 0,
      colorStops: [
        { offset: 0, color: '#C084FC' },
        { offset: 1, color: '#312E81' },
      ],
    },
  },
  {
    id: 'radial-citrus',
    name: 'Citrus Bloom',
    gradient: {
      type: 'radial',
      rotation: 0,
      colorStops: [
        { offset: 0, color: '#FDE047' },
        { offset: 0.55, color: '#FB923C' },
        { offset: 1, color: '#E11D48' },
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
  dotColor: '#5B5CEB',
  gradient: {
    type: 'linear',
    rotation: 45,
    colorStops: [
      { offset: 0, color: '#5B5CEB' },
      { offset: 1, color: '#22C8F6' },
    ],
  },
  cornerSquareColor: '#5B5CEB',
  cornerDotColor: '#22C8F6',
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
  frameColor: '#5B5CEB',
  frameTextColor: '#FFFFFF',
  frameBgColor: '#FFFFFF',
};
