/**
 * Script to generate placeholder SVG images for the portfolio.
 * Run with: node scripts/generate-placeholders.js
 * 
 * Generates:
 * - public/og-image.svg (will be referenced as .png in meta, need manual conversion or use SVG)
 * - public/apple-touch-icon.svg
 * - public/images/projects/*.svg
 */

const fs = require('fs');
const path = require('path');

const PUBLIC_DIR = path.join(__dirname, '..', 'public');

// ============================================
// OG Image (1200x630) - Social sharing card
// ============================================
const ogImage = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0a0f0a"/>
      <stop offset="100%" style="stop-color:#162016"/>
    </linearGradient>
    <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#228B22"/>
      <stop offset="100%" style="stop-color:#34d399"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <!-- Decorative circles -->
  <circle cx="1050" cy="100" r="200" fill="#228B22" opacity="0.1"/>
  <circle cx="150" cy="530" r="150" fill="#34d399" opacity="0.08"/>
  <!-- Green line accent -->
  <rect x="100" y="200" width="80" height="4" fill="url(#accent)" rx="2"/>
  <!-- Name -->
  <text x="100" y="280" font-family="Inter, system-ui, sans-serif" font-size="64" font-weight="700" fill="#e8f5e8">Angelo Navarro</text>
  <!-- Title -->
  <text x="100" y="340" font-family="Inter, system-ui, sans-serif" font-size="28" fill="#a3c9a3">Systems Engineer &amp; Telecom Specialist</text>
  <!-- Subtitle -->
  <text x="100" y="400" font-family="Inter, system-ui, sans-serif" font-size="22" fill="#6b8f6b">6+ years at +Móvil (Liberty Latin America) | Panamá</text>
  <!-- Tech badges -->
  <rect x="100" y="460" width="90" height="32" rx="16" fill="#228B22" opacity="0.3"/>
  <text x="125" y="481" font-family="Inter, sans-serif" font-size="14" fill="#34d399">Python</text>
  <rect x="210" y="460" width="100" height="32" rx="16" fill="#228B22" opacity="0.3"/>
  <text x="230" y="481" font-family="Inter, sans-serif" font-size="14" fill="#34d399">Node.js</text>
  <rect x="330" y="460" width="100" height="32" rx="16" fill="#228B22" opacity="0.3"/>
  <text x="350" y="481" font-family="Inter, sans-serif" font-size="14" fill="#34d399">Telecom</text>
  <rect x="450" y="460" width="90" height="32" rx="16" fill="#228B22" opacity="0.3"/>
  <text x="470" y="481" font-family="Inter, sans-serif" font-size="14" fill="#34d399">Docker</text>
  <!-- Domain -->
  <text x="100" y="570" font-family="JetBrains Mono, monospace" font-size="18" fill="#6b8f6b">angelonavarro.dev</text>
</svg>`;

// ============================================
// Apple Touch Icon (180x180)
// ============================================
const appleTouchIcon = `<svg width="180" height="180" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0a0f0a"/>
      <stop offset="100%" style="stop-color:#162016"/>
    </linearGradient>
  </defs>
  <rect width="180" height="180" rx="36" fill="url(#bg)"/>
  <text x="90" y="105" font-family="Inter, system-ui, sans-serif" font-size="72" font-weight="700" fill="#34d399" text-anchor="middle" dominant-baseline="middle">AN</text>
</svg>`;

// ============================================
// Project Placeholder Generator
// ============================================
function createProjectSvg(title, techStack, color) {
  return `<svg width="800" height="450" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0a0f0a"/>
      <stop offset="100%" style="stop-color:#111a11"/>
    </linearGradient>
  </defs>
  <rect width="800" height="450" fill="url(#bg)"/>
  <!-- Decorative element -->
  <rect x="0" y="0" width="800" height="4" fill="${color}"/>
  <!-- Code-like decoration -->
  <rect x="40" y="40" width="720" height="300" rx="8" fill="#162016" stroke="#1e3a1e" stroke-width="1"/>
  <!-- Terminal dots -->
  <circle cx="70" cy="60" r="6" fill="#ff5f57"/>
  <circle cx="92" cy="60" r="6" fill="#ffbd2e"/>
  <circle cx="114" cy="60" r="6" fill="#28ca42"/>
  <!-- Code lines -->
  <rect x="70" y="90" width="200" height="12" rx="2" fill="${color}" opacity="0.4"/>
  <rect x="70" y="115" width="350" height="12" rx="2" fill="#a3c9a3" opacity="0.2"/>
  <rect x="90" y="140" width="280" height="12" rx="2" fill="#a3c9a3" opacity="0.15"/>
  <rect x="90" y="165" width="320" height="12" rx="2" fill="${color}" opacity="0.3"/>
  <rect x="70" y="190" width="250" height="12" rx="2" fill="#a3c9a3" opacity="0.2"/>
  <rect x="90" y="215" width="400" height="12" rx="2" fill="#a3c9a3" opacity="0.15"/>
  <rect x="70" y="240" width="180" height="12" rx="2" fill="${color}" opacity="0.25"/>
  <rect x="70" y="265" width="300" height="12" rx="2" fill="#a3c9a3" opacity="0.2"/>
  <!-- Project title -->
  <text x="400" y="400" font-family="Inter, system-ui, sans-serif" font-size="24" font-weight="600" fill="#e8f5e8" text-anchor="middle">${title}</text>
  <!-- Tech stack -->
  <text x="400" y="435" font-family="JetBrains Mono, monospace" font-size="14" fill="${color}" text-anchor="middle">${techStack}</text>
</svg>`;
}

// ============================================
// Write all files
// ============================================

// OG Image
fs.writeFileSync(path.join(PUBLIC_DIR, 'og-image.svg'), ogImage);
console.log('✓ Created public/og-image.svg');

// Apple Touch Icon  
fs.writeFileSync(path.join(PUBLIC_DIR, 'apple-touch-icon.svg'), appleTouchIcon);
console.log('✓ Created public/apple-touch-icon.svg');

// Project screenshots
const projects = [
  { file: 'smart-change.svg', title: 'Smart Change Analyzer', tech: 'Python • NLP • Git', color: '#3572A5' },
  { file: 'ims-decoder.svg', title: 'IMS Decoder', tech: 'Python • IMS • Telecom', color: '#34d399' },
  { file: 'cdr-validation.svg', title: 'CDR Validation Tool', tech: 'Python • MySQL • Automation', color: '#e38c00' },
  { file: 'j-pdve.svg', title: 'J-PDVE', tech: 'TypeScript • Next.js • NestJS', color: '#3178c6' },
  { file: 'portfolio.svg', title: 'Portfolio EVERGREEN', tech: 'Next.js • TypeScript • TailwindCSS', color: '#228B22' },
];

const projectsDir = path.join(PUBLIC_DIR, 'images', 'projects');
for (const project of projects) {
  fs.writeFileSync(
    path.join(projectsDir, project.file),
    createProjectSvg(project.title, project.tech, project.color)
  );
  console.log(`✓ Created public/images/projects/${project.file}`);
}

console.log('\n✅ All placeholder images generated!');
console.log('\nNote: For production, replace SVGs with real screenshots.');
console.log('The og-image.svg should be converted to og-image.png (1200x630) for best social media compatibility.');
