// Generate PNG icons for PWA using pure Node.js (no dependencies)
const fs = require('fs');
const path = require('path');

function createPNG(size) {
  // Create a minimal valid PNG with BharatBuddy branding
  // Using raw PNG creation
  
  const { createCanvas } = (() => {
    // We'll create a simple colored square PNG manually
    // PNG structure: signature + IHDR + IDAT + IEND
    
    function crc32(buf) {
      let crc = 0xffffffff;
      const table = new Int32Array(256);
      for (let i = 0; i < 256; i++) {
        let c = i;
        for (let j = 0; j < 8; j++) c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
        table[i] = c;
      }
      for (let i = 0; i < buf.length; i++) crc = table[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
      return (crc ^ 0xffffffff) >>> 0;
    }

    function createChunk(type, data) {
      const typeBytes = Buffer.from(type);
      const len = Buffer.alloc(4);
      len.writeUInt32BE(data.length, 0);
      const crcData = Buffer.concat([typeBytes, data]);
      const crc = Buffer.alloc(4);
      crc.writeUInt32BE(crc32(crcData), 0);
      return Buffer.concat([len, typeBytes, data, crc]);
    }

    function deflateRaw(data) {
      const zlib = require('zlib');
      return zlib.deflateSync(data);
    }

    return {
      createCanvas: (w, h) => {
        return {
          toPNG: () => {
            // Create pixel data: green circle on dark background
            const raw = [];
            const cx = w / 2, cy = h / 2, r = w * 0.42;
            const innerR = w * 0.30;
            
            for (let y = 0; y < h; y++) {
              raw.push(0); // filter byte
              for (let x = 0; x < w; x++) {
                const dx = x - cx, dy = y - cy;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist <= r) {
                  // Inside circle — green gradient
                  if (dist <= innerR) {
                    // Inner area — "B" letter area (white on green)
                    const letterX = (x - cx) / innerR;
                    const letterY = (y - cy) / innerR;
                    
                    // Simple "B" shape
                    const isB = (
                      // Vertical bar
                      (letterX >= -0.5 && letterX <= -0.2 && letterY >= -0.6 && letterY <= 0.6) ||
                      // Top horizontal
                      (letterX >= -0.5 && letterX <= 0.3 && letterY >= -0.6 && letterY <= -0.35) ||
                      // Middle horizontal
                      (letterX >= -0.5 && letterX <= 0.3 && letterY >= -0.12 && letterY <= 0.12) ||
                      // Bottom horizontal
                      (letterX >= -0.5 && letterX <= 0.3 && letterY >= 0.35 && letterY <= 0.6) ||
                      // Top right curve
                      (letterX >= 0.15 && letterX <= 0.45 && letterY >= -0.6 && letterY <= -0.12 &&
                        Math.sqrt((letterX - 0.15) ** 2 + (letterY - (-0.36)) ** 2) <= 0.35) ||
                      // Bottom right curve
                      (letterX >= 0.15 && letterX <= 0.45 && letterY >= -0.12 && letterY <= 0.6 &&
                        Math.sqrt((letterX - 0.15) ** 2 + (letterY - 0.24) ** 2) <= 0.4)
                    );
                    
                    if (isB) {
                      raw.push(255, 255, 255, 255); // White letter
                    } else {
                      raw.push(37, 211, 102, 255); // Green #25D366
                    }
                  } else {
                    // Outer ring
                    raw.push(37, 211, 102, 255); // Green
                  }
                } else {
                  raw.push(10, 10, 10, 255); // Dark background #0a0a0a
                }
              }
            }
            
            const rawBuf = Buffer.from(raw);
            const compressed = deflateRaw(rawBuf);
            
            // PNG signature
            const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
            
            // IHDR
            const ihdr = Buffer.alloc(13);
            ihdr.writeUInt32BE(w, 0);
            ihdr.writeUInt32BE(h, 4);
            ihdr[8] = 8; // bit depth
            ihdr[9] = 6; // color type (RGBA)
            ihdr[10] = 0; // compression
            ihdr[11] = 0; // filter
            ihdr[12] = 0; // interlace
            
            // IEND
            const iend = Buffer.alloc(0);
            
            return Buffer.concat([
              sig,
              createChunk('IHDR', ihdr),
              createChunk('IDAT', compressed),
              createChunk('IEND', iend)
            ]);
          }
        };
      }
    };
  })();

  return createCanvas(size, size).toPNG();
}

// Generate both sizes
const icon192 = createPNG(192);
const icon512 = createPNG(512);

fs.writeFileSync(path.join(__dirname, 'public', 'icons', 'icon-192.png'), icon192);
fs.writeFileSync(path.join(__dirname, 'public', 'icons', 'icon-512.png'), icon512);

console.log('✅ Icons generated: icon-192.png & icon-512.png');
