import type { QRConfig } from './types';

export function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function drawTopText(
  ctx: CanvasRenderingContext2D,
  text: string,
  canvasW: number,
  bannerH: number,
  color: string,
  bgColor: string,
  fontSize: number
) {
  ctx.fillStyle = bgColor;
  ctx.beginPath();
  ctx.moveTo(0, 24);
  ctx.quadraticCurveTo(0, 0, 24, 0);
  ctx.lineTo(canvasW - 24, 0);
  ctx.quadraticCurveTo(canvasW, 0, canvasW, 24);
  ctx.lineTo(canvasW, bannerH);
  ctx.lineTo(0, bannerH);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = color;
  ctx.font = `bold ${fontSize}px "Space Grotesk", sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text.toUpperCase(), canvasW / 2, bannerH / 2);
}

function drawBottomPill(
  ctx: CanvasRenderingContext2D,
  text: string,
  canvasW: number,
  qrBottom: number,
  bannerH: number,
  accentColor: string,
  textColor: string
) {
  const btnW = Math.round(canvasW * 0.72);
  const btnH = Math.round(bannerH * 0.65);
  const btnX = Math.round((canvasW - btnW) / 2);
  const btnY = qrBottom + Math.round((bannerH - btnH) / 2);

  ctx.fillStyle = accentColor;
  drawRoundedRect(ctx, btnX, btnY, btnW, btnH, btnH / 2);
  ctx.fill();

  ctx.fillStyle = textColor;
  ctx.font = `bold ${Math.round(btnH * 0.46)}px "Space Grotesk", sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text.toUpperCase(), btnX + btnW / 2, btnY + btnH / 2 + 1);
}

function drawBottomCaption(
  ctx: CanvasRenderingContext2D,
  text: string,
  canvasW: number,
  yCenter: number,
  color: string,
  fontSize: number
) {
  ctx.fillStyle = color;
  ctx.font = `600 ${fontSize}px "Space Grotesk", sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text.toUpperCase(), canvasW / 2, yCenter);
}

/**
 * Composites the QR code with custom frames onto a target canvas.
 * Supports frameTextPosition: 'bottom' | 'top' | 'both'
 */
export async function compositeQRWithFrame(
  qrCanvas: HTMLCanvasElement,
  config: QRConfig,
  targetCanvas: HTMLCanvasElement
): Promise<void> {
  const ctx = targetCanvas.getContext('2d');
  if (!ctx) return;

  const qrSize = qrCanvas.width;
  const frameType = config.frameType;
  const pos = config.frameTextPosition || 'bottom';
  const topText = (config.frameTopText || 'SCAN HERE').toUpperCase();
  const bottomText = (config.frameText || 'SCAN ME').toUpperCase();

  if (frameType === 'none') {
    targetCanvas.width = qrSize;
    targetCanvas.height = qrSize;
    ctx.clearRect(0, 0, qrSize, qrSize);
    ctx.drawImage(qrCanvas, 0, 0);
    return;
  }

  const padding = Math.round(qrSize * 0.08);
  const canvasW = qrSize + padding * 2;
  const qrX = padding;
  const bannerSize = Math.round(qrSize * 0.2);
  const hasTop = pos === 'top' || pos === 'both';
  const hasBottom = pos === 'bottom' || pos === 'both';

  if (frameType === 'scan-me-bottom') {
    const topH = hasTop ? bannerSize : 0;
    const bottomH = hasBottom ? Math.round(qrSize * 0.22) : 0;
    const canvasH = qrSize + padding * 2 + topH + bottomH;
    const qrY = padding + topH;
    targetCanvas.width = canvasW;
    targetCanvas.height = canvasH;

    ctx.fillStyle = config.frameBgColor || '#FFFFFF';
    drawRoundedRect(ctx, 0, 0, canvasW, canvasH, 24);
    ctx.fill();
    ctx.strokeStyle = config.frameColor;
    ctx.lineWidth = 3;
    ctx.stroke();

    if (hasTop) {
      drawTopText(ctx, topText, canvasW, topH, config.frameTextColor || '#FFFFFF', config.frameColor, Math.round(topH * 0.42));
    }
    ctx.drawImage(qrCanvas, qrX, qrY);
    if (hasBottom) {
      drawBottomPill(ctx, bottomText, canvasW, qrY + qrSize, bottomH, config.frameColor, config.frameTextColor || '#FFFFFF');
    }
  } else if (frameType === 'top-banner') {
    const topH = hasTop ? bannerSize : 0;
    const bottomH = hasBottom ? bannerSize : 0;
    const canvasH = qrSize + padding * 2 + topH + bottomH;
    const qrY = padding + topH;
    targetCanvas.width = canvasW;
    targetCanvas.height = canvasH;

    ctx.fillStyle = config.frameBgColor || '#FFFFFF';
    drawRoundedRect(ctx, 0, 0, canvasW, canvasH, 24);
    ctx.fill();

    if (hasTop) {
      drawTopText(ctx, topText, canvasW, topH, config.frameTextColor || '#FFFFFF', config.frameColor, Math.round(topH * 0.42));
    }
    ctx.drawImage(qrCanvas, qrX, qrY);
    if (hasBottom) {
      drawBottomCaption(ctx, bottomText, canvasW, qrY + qrSize + bottomH / 2, config.frameColor, Math.round(bottomH * 0.38));
    }
  } else if (frameType === 'polaroid') {
    const topH = hasTop ? bannerSize : 0;
    const bottomMargin = hasBottom ? Math.round(qrSize * 0.28) : padding;
    const canvasH = qrSize + padding * 2 + topH + (hasBottom ? bottomMargin : 0);
    const qrY = padding + topH;
    targetCanvas.width = canvasW;
    targetCanvas.height = canvasH;

    ctx.fillStyle = '#FFFFFF';
    drawRoundedRect(ctx, 0, 0, canvasW, canvasH, 18);
    ctx.fill();
    ctx.strokeStyle = '#CBD5E1';
    ctx.lineWidth = 2;
    ctx.stroke();

    if (hasTop) {
      drawTopText(ctx, topText, canvasW, topH, config.frameTextColor || '#FFFFFF', config.frameColor || '#172033', Math.round(topH * 0.38));
    }
    ctx.drawImage(qrCanvas, qrX, qrY);
    if (hasBottom) {
      drawBottomCaption(ctx, bottomText, canvasW, qrY + qrSize + bottomMargin / 2, config.frameColor || '#172033', Math.round(bottomMargin * 0.3));
    }
  } else if (frameType === 'phone') {
    const topNotch = Math.round(qrSize * 0.14);
    const bottomHome = Math.round(qrSize * 0.18);
    const topH = hasTop ? bannerSize : 0;
    const canvasH = qrSize + padding * 2 + topNotch + bottomHome + topH;
    const qrY = padding + topNotch + topH;
    targetCanvas.width = canvasW;
    targetCanvas.height = canvasH;

    ctx.fillStyle = '#101522';
    drawRoundedRect(ctx, 0, topH, canvasW, canvasH - topH, 36);
    ctx.fill();

    ctx.fillStyle = config.frameBgColor || '#EFF3F9';
    drawRoundedRect(ctx, 8, topH + 8, canvasW - 16, canvasH - topH - 16, 28);
    ctx.fill();

    ctx.fillStyle = '#101522';
    drawRoundedRect(ctx, canvasW / 2 - 40, topH + 14, 80, 16, 8);
    ctx.fill();

    if (hasTop) {
      ctx.fillStyle = config.frameBgColor || '#FFFFFF';
      drawRoundedRect(ctx, 0, 0, canvasW, topH + 24, 24);
      ctx.fill();
      drawTopText(ctx, topText, canvasW, topH, config.frameTextColor || '#FFFFFF', config.frameColor, Math.round(topH * 0.38));
    }
    ctx.drawImage(qrCanvas, qrX, qrY);
    if (hasBottom) {
      drawBottomCaption(ctx, bottomText, canvasW, qrY + qrSize + bottomHome / 2, config.frameColor, Math.round(bottomHome * 0.28));
    }
  } else if (frameType === 'neon-badge') {
    const topH = hasTop ? bannerSize : 0;
    const bottomBannerH = hasBottom ? bannerSize : padding;
    const canvasH = qrSize + padding * 2 + topH + (hasBottom ? bottomBannerH : 0);
    const qrY = padding + topH;
    targetCanvas.width = canvasW;
    targetCanvas.height = canvasH;

    ctx.fillStyle = '#101522';
    drawRoundedRect(ctx, 0, 0, canvasW, canvasH, 24);
    ctx.fill();
    ctx.strokeStyle = config.frameColor;
    ctx.lineWidth = 4;
    ctx.stroke();

    if (hasTop) {
      ctx.fillStyle = config.frameColor;
      ctx.font = `700 ${Math.round(topH * 0.36)}px "Space Grotesk", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`• ${topText} •`, canvasW / 2, topH / 2);
    }
    ctx.drawImage(qrCanvas, qrX, qrY);
    if (hasBottom) {
      ctx.fillStyle = config.frameColor;
      ctx.font = `700 ${Math.round(bottomBannerH * 0.38)}px "Space Grotesk", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`• ${bottomText} •`, canvasW / 2, qrY + qrSize + bottomBannerH / 2);
    }
  } else if (frameType === 'ticket') {
    const topH = hasTop ? bannerSize : 0;
    const bottomH = hasBottom ? Math.round(qrSize * 0.24) : padding;
    const canvasH = qrSize + padding * 2 + topH + (hasBottom ? bottomH : 0);
    const qrY = padding + topH;
    targetCanvas.width = canvasW;
    targetCanvas.height = canvasH;

    ctx.fillStyle = config.frameBgColor || '#FFFFFF';
    drawRoundedRect(ctx, 0, 0, canvasW, canvasH, 20);
    ctx.fill();

    if (hasTop) {
      drawTopText(ctx, topText, canvasW, topH, config.frameTextColor || '#FFFFFF', config.frameColor, Math.round(topH * 0.38));
    }
    ctx.drawImage(qrCanvas, qrX, qrY);
    if (hasBottom) {
      const dividerY = qrY + qrSize + 10;
      ctx.beginPath();
      ctx.setLineDash([8, 6]);
      ctx.moveTo(15, dividerY);
      ctx.lineTo(canvasW - 15, dividerY);
      ctx.strokeStyle = '#CBD5E1';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.setLineDash([]);
      drawBottomCaption(ctx, bottomText, canvasW, dividerY + (canvasH - dividerY) / 2, config.frameColor, Math.round(bottomH * 0.32));
    }
  }
}
