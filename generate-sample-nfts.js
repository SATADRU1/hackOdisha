// Generate Sample NFTs and Save as Files
// Run with: node generate-sample-nfts.js

const fs = require('fs');
const path = require('path');

// Mock the Gemini API for testing
const mockGenerateContent = async (prompt) => {
  console.log('🤖 Generating AI content...');
  
  // Simulate AI response with more variety
  const responses = [
    'Name: Cosmic Serenity Diamond\nDescription: A mystical manifestation of concentrated willpower, featuring cosmic energies and geometric patterns that celebrate your dedication to mindful focus.',
    'Name: Ethereal Focus Hexagon\nDescription: An ethereal embodiment of deep focus, with crystalline structures and flowing energy that radiates the power of sustained attention.',
    'Name: Mystic Clarity Spiral\nDescription: A sacred symbol of meditation mastery, radiating divine light through complex geometries born from your focused dedication.',
    'Name: Divine Meditation Star\nDescription: A luminous achievement token celebrating your journey into mindful concentration, where willpower meets artistic expression.',
    'Name: Sacred Wisdom Circle\nDescription: A transcendent artifact of mental clarity, born from pure dedication and the disciplined pursuit of focused productivity.',
    'Name: Radiant Focus Mandala\nDescription: An ancient symbol of inner peace transformed through modern achievement, celebrating your mastery of distraction and embrace of flow.',
    'Name: Celestial Achievement Wave\nDescription: A flowing testament to your mental discipline, where ethereal waves carry the essence of your focused energy into digital permanence.'
  ];
  
  return responses[Math.floor(Math.random() * responses.length)];
};

// Mock generateContent function
global.generateContent = mockGenerateContent;

// NFT Generation Core Functions
const backgrounds = [
  'cosmic', 'gradient', 'geometric', 'organic', 'digital', 'abstract', 
  'crystalline', 'flowing', 'structured', 'chaotic'
];

const shapes = [
  'circle', 'hexagon', 'diamond', 'star', 'spiral', 'wave', 
  'triangle', 'pentagon', 'infinity', 'mandala'
];

const patterns = [
  'dots', 'lines', 'waves', 'grid', 'spiral', 'fractal',
  'organic', 'geometric', 'flowing', 'structured'
];

const styles = [
  'minimalist', 'vibrant', 'ethereal', 'bold', 'subtle', 'dynamic',
  'serene', 'energetic', 'mystical', 'futuristic'
];

const colorPalettes = [
  { name: 'Sunset', colors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'] },
  { name: 'Ocean', colors: ['#0984e3', '#74b9ff', '#00b894', '#00cec9', '#6c5ce7'] },
  { name: 'Forest', colors: ['#00b894', '#55a3ff', '#fd79a8', '#fdcb6e', '#6c5ce7'] },
  { name: 'Cosmic', colors: ['#a29bfe', '#fd79a8', '#fdcb6e', '#e17055', '#74b9ff'] },
  { name: 'Neon', colors: ['#ff7675', '#74b9ff', '#55a3ff', '#00b894', '#ffeaa7'] },
  { name: 'Aurora', colors: ['#00b894', '#74b9ff', '#fd79a8', '#6c5ce7', '#fdcb6e'] },
  { name: 'Fire', colors: ['#ff7675', '#e17055', '#fdcb6e', '#fd79a8', '#FF6B6B'] }
];

function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function seedRandom(seed) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  
  return function() {
    hash = (hash * 9301 + 49297) % 233280;
    return hash / 233280;
  };
}

function generateRandomTraits(seed) {
  const random = seedRandom(seed);
  const paletteIndex = Math.abs(Math.floor(random() * colorPalettes.length)) % colorPalettes.length;
  let palette = colorPalettes[paletteIndex];
  
  if (!palette || !palette.colors) {
    // Fallback to first palette if something goes wrong
    palette = colorPalettes[0];
  }
  
  const colors = palette.colors;
  
  return {
    background: backgrounds[Math.abs(Math.floor(random() * backgrounds.length)) % backgrounds.length],
    shape: shapes[Math.abs(Math.floor(random() * shapes.length)) % shapes.length],
    pattern: patterns[Math.abs(Math.floor(random() * patterns.length)) % patterns.length],
    color1: colors[Math.abs(Math.floor(random() * colors.length)) % colors.length],
    color2: colors[Math.abs(Math.floor(random() * colors.length)) % colors.length],
    accent: colors[Math.abs(Math.floor(random() * colors.length)) % colors.length],
    style: styles[Math.abs(Math.floor(random() * styles.length)) % styles.length],
    palette: palette.name
  };
}

function generatePatternElements(pattern, color) {
  switch (pattern) {
    case 'dots':
      return `<circle cx="10" cy="10" r="2" fill="${color}" opacity="0.6" />`;
    case 'lines':
      return `<line x1="0" y1="10" x2="20" y2="10" stroke="${color}" stroke-width="1" opacity="0.6" />`;
    case 'grid':
      return `<rect x="0" y="0" width="20" height="20" fill="none" stroke="${color}" stroke-width="1" opacity="0.4" />`;
    case 'waves':
      return `<path d="M0,10 Q5,5 10,10 T20,10" stroke="${color}" stroke-width="2" fill="none" opacity="0.6" />`;
    case 'spiral':
      return `<path d="M10,2 Q18,10 10,18 Q2,10 10,2" stroke="${color}" stroke-width="1" fill="none" opacity="0.6" />`;
    case 'fractal':
      return `<polygon points="10,2 6,18 18,18" stroke="${color}" stroke-width="1" fill="none" opacity="0.5" />`;
    default:
      return `<circle cx="10" cy="10" r="1" fill="${color}" opacity="0.5" />`;
  }
}

function generateShapeElement(shape, color, size) {
  const opacity = 0.85;
  
  switch (shape) {
    case 'circle':
      return `<circle r="${size}" fill="${color}" opacity="${opacity}" />`;
    case 'hexagon':
      const hexPoints = Array.from({length: 6}, (_, i) => {
        const angle = (i * 60 - 90) * Math.PI / 180;
        const x = size * Math.cos(angle);
        const y = size * Math.sin(angle);
        return `${x},${y}`;
      }).join(' ');
      return `<polygon points="${hexPoints}" fill="${color}" opacity="${opacity}" />`;
    case 'diamond':
      return `<polygon points="0,-${size} ${size},0 0,${size} -${size},0" fill="${color}" opacity="${opacity}" />`;
    case 'star':
      const starPoints = Array.from({length: 10}, (_, i) => {
        const angle = (i * 36 - 90) * Math.PI / 180;
        const radius = i % 2 === 0 ? size : size * 0.5;
        const x = radius * Math.cos(angle);
        const y = radius * Math.sin(angle);
        return `${x},${y}`;
      }).join(' ');
      return `<polygon points="${starPoints}" fill="${color}" opacity="${opacity}" />`;
    case 'spiral':
      let spiralPath = 'M250,250';
      for (let i = 0; i < 100; i++) {
        const angle = i * 0.1;
        const radius = i * 1.5;
        const x = 250 + radius * Math.cos(angle);
        const y = 250 + radius * Math.sin(angle);
        spiralPath += ` L${x},${y}`;
      }
      return `<path d="${spiralPath}" stroke="${color}" stroke-width="4" fill="none" opacity="${opacity}" />`;
    case 'wave':
      return `<path d="M-${size},-20 Q-${size/2},${size} 0,0 T${size},20" stroke="${color}" stroke-width="8" fill="none" opacity="${opacity}" />`;
    case 'triangle':
      return `<polygon points="0,-${size} ${size * 0.866},${size/2} -${size * 0.866},${size/2}" fill="${color}" opacity="${opacity}" />`;
    case 'pentagon':
      const pentPoints = Array.from({length: 5}, (_, i) => {
        const angle = (i * 72 - 90) * Math.PI / 180;
        const x = size * Math.cos(angle);
        const y = size * Math.sin(angle);
        return `${x},${y}`;
      }).join(' ');
      return `<polygon points="${pentPoints}" fill="${color}" opacity="${opacity}" />`;
    case 'mandala':
      let mandalaElements = '';
      for (let ring = 0; ring < 3; ring++) {
        const ringRadius = size * (0.3 + ring * 0.35);
        for (let i = 0; i < 8; i++) {
          const angle = (i * 45) * Math.PI / 180;
          const x = ringRadius * Math.cos(angle);
          const y = ringRadius * Math.sin(angle);
          mandalaElements += `<circle cx="${x}" cy="${y}" r="${5 + ring * 3}" fill="${color}" opacity="${opacity * (1 - ring * 0.2)}" />`;
        }
      }
      return mandalaElements;
    default:
      return `<circle r="${size}" fill="${color}" opacity="${opacity}" />`;
  }
}

function generateAccentElements(color, count) {
  let elements = '';
  for (let i = 0; i < count; i++) {
    const x = 50 + Math.random() * 400;
    const y = 50 + Math.random() * 400;
    const radius = 5 + Math.random() * 15;
    const opacity = 0.2 + Math.random() * 0.4;
    
    elements += `<circle cx="${x}" cy="${y}" r="${radius}" fill="${color}" opacity="${opacity}" />`;
  }
  return elements;
}

function generateSVGImage(traits) {
  const { background, shape, pattern, color1, color2, accent, style } = traits;
  
  const gradientId = `grad-${Date.now()}-${Math.random()}`;
  const patternId = `pattern-${Date.now()}-${Math.random()}`;
  
  let svgContent = `<svg width="500" height="500" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="${gradientId}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${color1};stop-opacity:1" />
      <stop offset="50%" style="stop-color:${color2};stop-opacity:0.8" />
      <stop offset="100%" style="stop-color:${accent};stop-opacity:1" />
    </linearGradient>
    <radialGradient id="${gradientId}-radial" cx="50%" cy="50%" r="50%">
      <stop offset="0%" style="stop-color:${color1};stop-opacity:0.8" />
      <stop offset="100%" style="stop-color:${color2};stop-opacity:1" />
    </radialGradient>
    <pattern id="${patternId}" patternUnits="userSpaceOnUse" width="20" height="20">
      ${generatePatternElements(pattern, accent)}
    </pattern>
  </defs>
  
  <!-- Background -->
  <rect width="500" height="500" fill="url(#${gradientId})" />
  
  <!-- Background variation based on style -->
  ${style === 'ethereal' ? `<rect width="500" height="500" fill="url(#${gradientId}-radial)" opacity="0.6" />` : ''}
  
  <!-- Pattern overlay -->
  <rect width="500" height="500" fill="url(#${patternId})" opacity="0.3" />
  
  <!-- Main shape -->
  <g transform="translate(250,250)">
    ${generateShapeElement(shape, accent, 140)}
  </g>
  
  <!-- Secondary shape for dynamic styles -->
  ${style === 'dynamic' ? `<g transform="translate(250,250) rotate(45)"><circle r="80" fill="${color1}" opacity="0.4" /></g>` : ''}
  
  <!-- Accent elements -->
  ${generateAccentElements(accent, style === 'vibrant' ? 8 : 4)}
  
  <!-- Glow effect for mystical style -->
  ${style === 'mystical' ? `
  <defs>
    <filter id="glow">
      <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
      <feMerge> 
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  <g transform="translate(250,250)" filter="url(#glow)">
    <circle r="160" stroke="${accent}" stroke-width="2" fill="none" opacity="0.6" />
  </g>` : ''}
</svg>`;
  
  return svgContent;
}

async function generateAIDescription(traits) {
  const prompt = `Create a mystical and creative NFT name and description based on these visual traits:

Background: ${traits.background}
Shape: ${traits.shape} 
Pattern: ${traits.pattern}
Style: ${traits.style}
Color Palette: ${traits.palette}
Colors: ${traits.color1}, ${traits.color2}, ${traits.accent}

Generate a unique, creative name (2-4 words) and a poetic description (1-2 sentences) that captures the essence of these visual elements. Make it sound magical and achievement-worthy.

Format:
Name: [Creative Name Here]
Description: [Poetic description here]`;

  try {
    const aiResponse = await generateContent(prompt);
    
    const lines = aiResponse.split('\n');
    let name = 'Mystic Focus Achievement';
    let description = 'A unique digital artifact celebrating your focused dedication.';
    
    for (const line of lines) {
      if (line.toLowerCase().includes('name:')) {
        name = line.split(':')[1]?.trim() || name;
      }
      if (line.toLowerCase().includes('description:')) {
        description = line.split(':')[1]?.trim() || description;
      }
    }
    
    return { name, description };
  } catch (error) {
    console.error('Failed to generate AI description:', error);
    return {
      name: 'Mystic Focus Achievement',
      description: 'A unique digital artifact celebrating your focused dedication.'
    };
  }
}

async function generateFocusNFT(duration, completedAt, userId) {
  try {
    // Generate unique seed
    const seed = `${userId || 'anonymous'}-${completedAt}-${duration}`;
    
    // Generate random traits
    const traits = generateRandomTraits(seed);
    
    // Generate AI description
    const { name, description } = await generateAIDescription(traits);
    
    // Generate SVG image
    const svgString = generateSVGImage(traits);
    
    // Create NFT object
    const nft = {
      id: `nft-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      description,
      image: svgString, // Keep as SVG for file saving
      traits,
      timestamp: Date.now(),
      sessionData: {
        duration,
        completedAt
      }
    };
    
    return nft;
    
  } catch (error) {
    console.error('Error generating NFT:', error);
    throw new Error('Failed to generate NFT');
  }
}

async function generateAndSaveNFTs() {
  console.log('🎨 Generating Sample NFTs for Viewing');
  console.log('=' .repeat(50));
  
  // Create output directory
  const outputDir = path.join(__dirname, 'generated-nfts');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
    console.log(`📁 Created directory: ${outputDir}`);
  }
  
  // Generate different types of focus sessions
  const sessions = [
    { duration: 25, user: 'focus-master', type: 'Pomodoro Session' },
    { duration: 30, user: 'productivity-guru', type: 'Focus Sprint' },
    { duration: 45, user: 'deep-thinker', type: 'Deep Work' },
    { duration: 60, user: 'meditation-monk', type: 'Hour of Power' },
    { duration: 90, user: 'flow-state', type: 'Extended Focus' },
    { duration: 120, user: 'focus-legend', type: 'Ultra Session' }
  ];
  
  const generatedNFTs = [];
  
  for (let i = 0; i < sessions.length; i++) {
    const session = sessions[i];
    console.log(`\n🎯 Generating NFT ${i + 1}/${sessions.length}: ${session.type}`);
    
    const completedAt = new Date(Date.now() - (i * 3600000)).toISOString(); // Different times
    const nft = await generateFocusNFT(session.duration, completedAt, session.user);
    
    // Save SVG file
    const fileName = `${nft.name.replace(/[^a-zA-Z0-9]/g, '_')}_${nft.id}.svg`;
    const filePath = path.join(outputDir, fileName);
    fs.writeFileSync(filePath, nft.image);
    
    // Save metadata JSON
    const metadataFileName = `${nft.name.replace(/[^a-zA-Z0-9]/g, '_')}_${nft.id}.json`;
    const metadataPath = path.join(outputDir, metadataFileName);
    const metadata = {
      ...nft,
      image: fileName, // Reference to SVG file
      sessionType: session.type
    };
    fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
    
    generatedNFTs.push({ ...nft, filePath, metadataPath, sessionType: session.type });
    
    console.log(`✅ Generated: ${nft.name}`);
    console.log(`   📄 SVG: ${fileName}`);
    console.log(`   📋 Metadata: ${metadataFileName}`);
    console.log(`   🎨 Traits: ${nft.traits.style} ${nft.traits.shape} with ${nft.traits.pattern} pattern`);
    console.log(`   🎯 Session: ${session.duration}min ${session.type}`);
  }
  
  // Create an HTML gallery to view all NFTs
  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Focus NFT Gallery</title>
    <style>
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            margin: 0; 
            padding: 20px; 
            min-height: 100vh;
        }
        .container { 
            max-width: 1200px; 
            margin: 0 auto; 
            background: white; 
            border-radius: 15px; 
            padding: 30px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }
        h1 { 
            text-align: center; 
            color: #333; 
            margin-bottom: 30px;
            font-size: 2.5em;
        }
        .subtitle {
            text-align: center;
            color: #666;
            margin-bottom: 40px;
            font-size: 1.2em;
        }
        .gallery { 
            display: grid; 
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); 
            gap: 30px; 
        }
        .nft-card { 
            border: 1px solid #e0e0e0; 
            border-radius: 15px; 
            overflow: hidden;
            box-shadow: 0 10px 25px rgba(0,0,0,0.08);
            transition: all 0.3s ease;
        }
        .nft-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 20px 40px rgba(0,0,0,0.15);
        }
        .nft-image { 
            width: 100%; 
            height: 300px; 
            object-fit: contain;
            background: #f8f9fa;
        }
        .nft-info { 
            padding: 20px; 
        }
        .nft-name { 
            font-size: 1.3em; 
            font-weight: bold; 
            margin-bottom: 10px; 
            color: #333;
        }
        .nft-description { 
            color: #666; 
            line-height: 1.5; 
            margin-bottom: 15px;
        }
        .nft-traits {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-bottom: 15px;
        }
        .trait {
            background: #f1f3f4;
            color: #333;
            padding: 4px 8px;
            border-radius: 15px;
            font-size: 0.85em;
        }
        .nft-session {
            background: linear-gradient(45deg, #667eea, #764ba2);
            color: white;
            padding: 8px 15px;
            border-radius: 20px;
            font-size: 0.9em;
            display: inline-block;
        }
        .stats {
            text-align: center;
            margin: 30px 0;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 10px;
        }
        .stat {
            display: inline-block;
            margin: 0 20px;
        }
        .stat-number {
            font-size: 2em;
            font-weight: bold;
            color: #667eea;
        }
        .stat-label {
            color: #666;
            font-size: 0.9em;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🎨 Focus Achievement NFT Gallery</h1>
        <p class="subtitle">Unique digital artifacts celebrating focused productivity sessions</p>
        
        <div class="stats">
            <div class="stat">
                <div class="stat-number">${generatedNFTs.length}</div>
                <div class="stat-label">Unique NFTs</div>
            </div>
            <div class="stat">
                <div class="stat-number">${generatedNFTs.reduce((total, nft) => total + nft.sessionData.duration, 0)}</div>
                <div class="stat-label">Total Focus Minutes</div>
            </div>
            <div class="stat">
                <div class="stat-number">${new Set(generatedNFTs.map(nft => nft.traits.shape)).size}</div>
                <div class="stat-label">Shape Variations</div>
            </div>
        </div>
        
        <div class="gallery">
            ${generatedNFTs.map(nft => `
                <div class="nft-card">
                    <embed src="${path.basename(nft.filePath)}" class="nft-image" type="image/svg+xml">
                    <div class="nft-info">
                        <div class="nft-name">${nft.name}</div>
                        <div class="nft-description">${nft.description}</div>
                        <div class="nft-traits">
                            <span class="trait">${nft.traits.style} Style</span>
                            <span class="trait">${nft.traits.shape} Shape</span>
                            <span class="trait">${nft.traits.pattern} Pattern</span>
                            <span class="trait">${nft.traits.palette} Palette</span>
                        </div>
                        <div class="nft-session">${nft.sessionData.duration}min ${nft.sessionType}</div>
                    </div>
                </div>
            `).join('')}
        </div>
        
        <div style="text-align: center; margin-top: 40px; color: #666;">
            <p>🎯 Each NFT represents a successful focus session completion</p>
            <p>✨ Generated using AI + algorithmic art • Powered by Gemini API</p>
        </div>
    </div>
</body>
</html>`;
  
  const htmlPath = path.join(outputDir, 'gallery.html');
  fs.writeFileSync(htmlPath, htmlContent);
  
  console.log('\n🎉 Generation Complete!');
  console.log('=' .repeat(50));
  console.log(`📁 Files saved to: ${outputDir}`);
  console.log(`🌐 View gallery: ${htmlPath}`);
  console.log(`📄 Individual SVG files: ${generatedNFTs.length} generated`);
  console.log('\n🖼️ Generated NFTs:');
  generatedNFTs.forEach((nft, i) => {
    console.log(`   ${i + 1}. ${nft.name} (${nft.sessionData.duration}min ${nft.sessionType})`);
  });
  
  console.log('\n🚀 Open the gallery.html file in your browser to view all NFTs!');
  
  return generatedNFTs;
}

// Run the generator
generateAndSaveNFTs().catch(console.error);
