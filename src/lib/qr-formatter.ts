import type { QRConfig } from './types';

export function formatQRContent(config: QRConfig): string {
  switch (config.type) {
    case 'url': {
      let url = config.urlData.url.trim();
      if (!url) return 'https://qrstudio.dev';
      if (!/^https?:\/\//i.test(url)) {
        url = 'https://' + url;
      }
      return url;
    }

    case 'text':
      return config.textData.text || 'QR Studio';

    case 'wifi': {
      const { ssid, password, encryption, hidden } = config.wifiData;
      // WIFI:T:WPA;S:MySSID;P:MyPassword;H:false;;
      return `WIFI:T:${encryption};S:${ssid};P:${password};H:${hidden ? 'true' : 'false'};;`;
    }

    case 'vcard': {
      const { firstName, lastName, organization, title, phone, email, url, address } = config.vcardData;
      const vcard = [
        'BEGIN:VCARD',
        'VERSION:3.0',
        `N:${lastName};${firstName};;;`,
        `FN:${firstName} ${lastName}`.trim(),
        organization ? `ORG:${organization}` : '',
        title ? `TITLE:${title}` : '',
        phone ? `TEL;TYPE=CELL:${phone}` : '',
        email ? `EMAIL:${email}` : '',
        url ? `URL:${url}` : '',
        address ? `ADR;TYPE=WORK:;;${address};;;;` : '',
        'END:VCARD',
      ]
        .filter(Boolean)
        .join('\n');
      return vcard;
    }

    case 'email': {
      const { email, subject, body } = config.emailData;
      const params = new URLSearchParams();
      if (subject) params.append('subject', subject);
      if (body) params.append('body', body);
      const query = params.toString();
      return `mailto:${email}${query ? `?${query}` : ''}`;
    }

    case 'phone': {
      const phone = config.phoneData.phone.trim();
      return `tel:${phone}`;
    }

    case 'sms': {
      const { phone, message } = config.smsData;
      return `smsto:${phone}:${message}`;
    }

    case 'whatsapp': {
      const cleanPhone = config.whatsappData.phone.replace(/[^0-9]/g, '');
      const text = encodeURIComponent(config.whatsappData.message);
      return `https://wa.me/${cleanPhone}${text ? `?text=${text}` : ''}`;
    }

    case 'crypto': {
      const { coin, address, amount } = config.cryptoData;
      const cleanAddr = address.trim();
      if (coin === 'BTC') {
        return amount ? `bitcoin:${cleanAddr}?amount=${amount}` : `bitcoin:${cleanAddr}`;
      } else if (coin === 'ETH') {
        return amount ? `ethereum:${cleanAddr}?value=${amount}` : `ethereum:${cleanAddr}`;
      }
      return `${coin.toLowerCase()}:${cleanAddr}`;
    }

    case 'event': {
      const { title, location, start, end, notes } = config.eventData;
      const formatTime = (iso: string) => {
        if (!iso) return '';
        return iso.replace(/[-:]/g, '') + '00Z';
      };
      const ics = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'BEGIN:VEVENT',
        `SUMMARY:${title || 'Event'}`,
        location ? `LOCATION:${location}` : '',
        start ? `DTSTART:${formatTime(start)}` : '',
        end ? `DTEND:${formatTime(end)}` : '',
        notes ? `DESCRIPTION:${notes}` : '',
        'END:VEVENT',
        'END:VCALENDAR',
      ]
        .filter(Boolean)
        .join('\n');
      return ics;
    }

    default:
      return config.content || 'https://qrstudio.dev';
  }
}
