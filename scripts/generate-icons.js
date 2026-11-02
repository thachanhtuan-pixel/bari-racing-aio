import fs from 'fs';
import zlib from 'zlib';

function createPNG(width, height, drawFn) {
  // Build raw RGBA pixel buffer
  const rowLength = width * 4 + 1; // 1 filter byte per scanline
  const rawData = Buffer.alloc(height * rowLength);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowLength;
    rawData[rowOffset] = 0; // Filter type 0 (None)

    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = drawFn(x, y, width, height);
      const pxOffset = rowOffset + 1 + x * 4;
      rawData[pxOffset] = r;
      rawData[pxOffset + 1] = g;
      rawData[pxOffset + 2] = b;
      rawData[pxOffset + 3] = a;
    }
  }

  const deflated = zlib.deflateSync(rawData);

  // PNG Signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type RGBA
  ihdr[10] = 0; // compression method
  ihdr[11] = 0; // filter method
  ihdr[12] = 0; // interlace method
  const ihdrChunk = createChunk('IHDR', ihdr);

  // IDAT chunk
  const idatChunk = createChunk('IDAT', deflated);

  // IEND chunk
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let j = 0; j < 8; j++) {
      c = (c >>> 1) ^ (-(c & 1) & 0xedb88320);
    }
  }
  return (c ^ 0xffffffff) >>> 0;
}

function createChunk(type, data) {
  const len = data.length;
  const chunk = Buffer.alloc(8 + len + 4);
  chunk.writeUInt32BE(len, 0);
  chunk.write(type, 4, 4, 'ascii');
  data.copy(chunk, 8);
  const typeAndData = chunk.subarray(4, 8 + len);
  const crc = crc32(typeAndData);
  chunk.writeUInt32BE(crc, 8 + len);
  return chunk;
}

// Drawing function for Bari Racing Gothic Y2K icon
function drawIcon(x, y, w, h) {
  const cx = w / 2;
  const cy = h / 2;
  const dx = x - cx;
  const dy = y - cy;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const rOuter = w * 0.46;
  const rInner = w * 0.42;

  // Background
  let r = 10, g = 10, b = 10, a = 255;

  // Border neon ring
  if (dist <= rOuter && dist >= rInner) {
    return [57, 255, 20, 255]; // #39FF14 Neon Green
  }

  // Corner chamfer / dark metallic styling
  if (dist > rOuter) {
    return [0, 0, 0, 0];
  }

  // Inner ring glow
  if (dist < rInner && dist > rInner - (w * 0.02)) {
    return [20, 40, 20, 255];
  }

  // Draw Piston silhouette + "B" Gothic logo in center
  const normX = dx / (w * 0.35);
  const normY = dy / (h * 0.35);

  // Piston crown (top rectangle)
  if (normY > -0.65 && normY < 0.25 && Math.abs(normX) < 0.55) {
    // Piston rings notches
    if ((normY > -0.45 && normY < -0.38) || (normY > -0.25 && normY < -0.18)) {
      return [18, 18, 18, 255];
    }
    // High contrast neon fill
    return [57, 255, 20, 255];
  }

  // Connecting rod (center vertical bar)
  if (normY >= 0.25 && normY < 0.65 && Math.abs(normX) < 0.2) {
    return [57, 255, 20, 255];
  }

  // Big end bearing ring
  const rodDist = Math.sqrt(normX * normX + (normY - 0.65) * (normY - 0.65));
  if (rodDist < 0.3 && rodDist > 0.12) {
    return [57, 255, 20, 255];
  }

  // Inner cut-out of piston pin hole
  const pinDist = Math.sqrt(normX * normX + (normY - 0.05) * (normY - 0.05));
  if (pinDist < 0.18) {
    return [10, 10, 10, 255];
  }

  return [r, g, b, a];
}

// Generate PNGs
fs.writeFileSync('public/pwa-192x192.png', createPNG(192, 192, drawIcon));
fs.writeFileSync('public/pwa-512x512.png', createPNG(512, 512, drawIcon));
fs.writeFileSync('public/apple-touch-icon.png', createPNG(180, 180, drawIcon));
fs.writeFileSync('public/pwa-maskable-512x512.png', createPNG(512, 512, (x, y, w, h) => {
  // Maskable: Solid background with safe zone inner icon
  const cx = w / 2;
  const cy = h / 2;
  const dx = x - cx;
  const dy = y - cy;
  // Scaled down by 0.75 for safe margin
  const scaledX = cx + dx / 0.75;
  const scaledY = cy + dy / 0.75;
  if (scaledX >= 0 && scaledX < w && scaledY >= 0 && scaledY < h) {
    const px = drawIcon(scaledX, scaledY, w, h);
    if (px[3] === 0) return [10, 10, 10, 255];
    return px;
  }
  return [10, 10, 10, 255];
}));

console.log('Generated all PWA icons successfully!');
