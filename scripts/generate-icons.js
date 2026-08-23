import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const svgIcon = `
<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad" x1="0" y1="0" x2="512" y2="512" gradientUnits="userSpaceOnUse">
      <stop stop-color="#0F172A"/>
      <stop offset="0.5" stop-color="#1E1B4B"/>
      <stop offset="1" stop-color="#020617"/>
    </linearGradient>
    <linearGradient id="bubbleGrad1" x1="60" y1="60" x2="450" y2="450" gradientUnits="userSpaceOnUse">
      <stop stop-color="#9333EA"/>
      <stop offset="0.5" stop-color="#EC4899"/>
      <stop offset="1" stop-color="#F59E0B"/>
    </linearGradient>
    <linearGradient id="bubbleGrad2" x1="120" y1="120" x2="380" y2="380" gradientUnits="userSpaceOnUse">
      <stop stop-color="#8B5CF6"/>
      <stop offset="1" stop-color="#D946EF"/>
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%" filterUnits="userSpaceOnUse">
      <feGaussianBlur stdDeviation="16" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
  </defs>

  <!-- Background rounded squircle -->
  <rect width="512" height="512" rx="128" fill="url(#bgGrad)"/>
  <rect x="8" y="8" width="496" height="496" rx="120" stroke="url(#bubbleGrad1)" stroke-width="6" stroke-opacity="0.4"/>

  <!-- Glowing Aura -->
  <circle cx="256" cy="240" r="140" fill="url(#bubbleGrad2)" opacity="0.3" filter="url(#glow)"/>

  <!-- Left Speech Bubble -->
  <path d="M120 220C120 159.249 169.249 110 230 110C290.751 110 340 159.249 340 220C340 280.751 290.751 330 230 330C205.58 330 183.024 322.046 164.717 308.647L116 336L127.324 286.082C122.645 266.303 120 244.382 120 220Z" fill="url(#bubbleGrad1)" opacity="0.95"/>

  <!-- Right Overlapping Speech Bubble -->
  <path d="M250 250C250 205.817 285.817 170 330 170C374.183 170 410 205.817 410 250C410 294.183 374.183 330 330 330C312.24 330 295.836 324.215 282.522 314.471L247 334L255.236 297.878C251.833 283.493 250 267.551 250 250Z" fill="url(#bubbleGrad2)" opacity="0.85"/>

  <!-- Georgian Word / Icon Typography (A / ა stylized logo) -->
  <text x="226" y="248" font-family="system-ui, -apple-system, sans-serif" font-size="110" font-weight="900" fill="#FFFFFF" text-anchor="middle" letter-spacing="-2">ა</text>

  <!-- Sparkles -->
  <circle cx="360" cy="130" r="10" fill="#FDE047" opacity="0.9"/>
  <circle cx="390" cy="155" r="5" fill="#F472B6" opacity="0.8"/>
  <circle cx="110" cy="150" r="7" fill="#C084FC" opacity="0.8"/>
  <circle cx="370" cy="370" r="8" fill="#38BDF8" opacity="0.7"/>

  <!-- Bottom App Label -->
  <text x="256" y="440" font-family="system-ui, -apple-system, sans-serif" font-size="44" font-weight="900" fill="#FFFFFF" text-anchor="middle" letter-spacing="4">ALIAS</text>
</svg>
`;

async function generate() {
  const publicDir = path.resolve('public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // Save SVG
  fs.writeFileSync(path.join(publicDir, 'favicon.svg'), svgIcon.trim());
  console.log('Created favicon.svg');

  const svgBuffer = Buffer.from(svgIcon);

  // 192x192 PNG
  await sharp(svgBuffer)
    .resize(192, 192)
    .png()
    .toFile(path.join(publicDir, 'pwa-192x192.png'));
  console.log('Created pwa-192x192.png');

  // 512x512 PNG
  await sharp(svgBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'pwa-512x512.png'));
  console.log('Created pwa-512x512.png');

  // 180x180 Apple Touch Icon
  await sharp(svgBuffer)
    .resize(180, 180)
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));
  console.log('Created apple-touch-icon.png');

  // Maskable Icon (with slight padding for safe zone)
  await sharp(svgBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'maskable-icon.png'));
  console.log('Created maskable-icon.png');
}

generate().catch(console.error);
