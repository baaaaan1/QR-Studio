/**
 * Client-side background removal for logo / user image.
 * Analyzes corner colors and applies threshold color-distance alpha keying with edge smoothing.
 */
export async function removeImageBackground(
  imageSrc: string,
  tolerance = 38,
  edgeFeather = 14
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          return reject(new Error('Canvas 2D context not supported'));
        }

        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        const width = canvas.width;
        const height = canvas.height;

        // Sample corner pixels to determine dominant background color
        const cornerCoords = [
          [0, 0],
          [width - 1, 0],
          [0, height - 1],
          [width - 1, height - 1],
          [Math.floor(width / 2), 0],
          [0, Math.floor(height / 2)],
        ];

        let bgR = 0;
        let bgG = 0;
        let bgB = 0;
        let sampleCount = 0;

        for (const [x, y] of cornerCoords) {
          const idx = (y * width + x) * 4;
          // Only sample if pixel is not already transparent
          if (data[idx + 3] > 50) {
            bgR += data[idx];
            bgG += data[idx + 1];
            bgB += data[idx + 2];
            sampleCount++;
          }
        }

        if (sampleCount > 0) {
          bgR = Math.round(bgR / sampleCount);
          bgG = Math.round(bgG / sampleCount);
          bgB = Math.round(bgB / sampleCount);
        } else {
          // Default to pure white background
          bgR = 255;
          bgG = 255;
          bgB = 255;
        }

        // Apply color distance transparency
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const a = data[i + 3];

          if (a === 0) continue;

          // Euclidean distance in RGB color space
          const dist = Math.sqrt(
            Math.pow(r - bgR, 2) + Math.pow(g - bgG, 2) + Math.pow(b - bgB, 2)
          );

          if (dist < tolerance) {
            // Background pixel -> set fully transparent
            data[i + 3] = 0;
          } else if (dist < tolerance + edgeFeather) {
            // Feather edge for smooth transition
            const factor = (dist - tolerance) / edgeFeather;
            data[i + 3] = Math.round(a * factor);
          }
        }

        ctx.putImageData(imageData, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      } catch (err) {
        reject(err);
      }
    };

    img.onerror = (err) => reject(err);
    img.src = imageSrc;
  });
}
