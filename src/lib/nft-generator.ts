import { generateContent } from './gemini';

// NFT Visual Generation
export interface NFTTraits {
  background: string;
  shape: string;
  pattern: string;
  color1: string;
  color2: string;
  accent: string;
  style: string;
}

export interface GeneratedNFT {
  id: string;
  name: string;
  description: string;
  image: string; // base64 data URL
  traits: NFTTraits;
  timestamp: number;
  sessionData: {
    duration: number;
    completedAt: string;
  };
}

// Random trait generators
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

// Color palettes
const colorPalettes = [
  { name: 'Sunset', colors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'] },
  { name: 'Ocean', colors: ['#0984e3', '#74b9ff', '#00b894', '#00cec9', '#6c5ce7'] },
  { name: 'Forest', colors: ['#00b894', '#55a3ff', '#fd79a8', '#fdcb6e', '#6c5ce7'] },
  { name: 'Cosmic', colors: ['#a29bfe', '#fd79a8', '#fdcb6e', '#e17055', '#74b9ff'] },
  { name: 'Neon', colors: ['#ff7675', '#74b9ff', '#55a3ff', '#00b894', '#ffeaa7'] }
];

function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function generateRandomTraits(seed?: string): NFTTraits {
  // Use seed for consistent randomness if provided
  const random = seed ? seedRandom(seed) : Math.random;
  
  const palette = getRandomItem(colorPalettes);
  const colors = palette.colors;
  
  return {
    background: getRandomItem(backgrounds),
    shape: getRandomItem(shapes),
    pattern: getRandomItem(patterns),
    color1: getRandomItem(colors),
    color2: getRandomItem(colors),
    accent: getRandomItem(colors),
    style: getRandomItem(styles)
  };
}

// Simple seed-based random number generator
function seedRandom(seed: string): () => number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  return function() {
    hash = (hash * 9301 + 49297) % 233280;
    return hash / 233280;
  };
}

// Generate SVG image based on traits
function generateSVGImage(traits: NFTTraits): string {
  const { background, shape, pattern, color1, color2, accent, style } = traits;
  
  // Create gradient definitions
  const gradientId = `grad-${Date.now()}`;
  const patternId = `pattern-${Date.now()}`;
  
  let svgContent = `
    <svg width="500" height="500" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="${gradientId}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${color1};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${color2};stop-opacity:1" />
        </linearGradient>
        <pattern id="${patternId}" patternUnits="userSpaceOnUse" width="20" height="20">
          ${generatePatternElements(pattern, accent)}
        </pattern>
      </defs>
      
      <!-- Background -->
      <rect width="500" height="500" fill="url(#${gradientId})" />
      
      <!-- Pattern overlay -->
      <rect width="500" height="500" fill="url(#${patternId})" opacity="0.3" />
      
      <!-- Main shape -->
      <g transform="translate(250,250)">
        ${generateShapeElement(shape, accent, 150)}
      </g>
      
      <!-- Accent elements -->
      ${generateAccentElements(accent, 3)}
    </svg>
  `;
  
  return svgContent;
}

function generatePatternElements(pattern: string, color: string): string {
  switch (pattern) {
    case 'dots':
      return `<circle cx="10" cy="10" r="2" fill="${color}" opacity="0.6" />`;
    case 'lines':
      return `<line x1="0" y1="10" x2="20" y2="10" stroke="${color}" stroke-width="1" opacity="0.6" />`;
    case 'grid':
      return `<rect x="0" y="0" width="20" height="20" fill="none" stroke="${color}" stroke-width="1" opacity="0.4" />`;
    case 'waves':
      return `<path d="M0,10 Q5,5 10,10 T20,10" stroke="${color}" stroke-width="2" fill="none" opacity="0.6" />`;
    default:
      return `<circle cx="10" cy="10" r="1" fill="${color}" opacity="0.5" />`;
  }
}

function generateShapeElement(shape: string, color: string, size: number): string {
  const opacity = 0.8;
  
  switch (shape) {
    case 'circle':
      return `<circle r="${size}" fill="${color}" opacity="${opacity}" />`;
    case 'hexagon':
      const points = Array.from({length: 6}, (_, i) => {
        const angle = (i * 60 - 90) * Math.PI / 180;
        const x = size * Math.cos(angle);
        const y = size * Math.sin(angle);
        return `${x},${y}`;
      }).join(' ');
      return `<polygon points="${points}" fill="${color}" opacity="${opacity}" />`;
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
    default:
      return `<circle r="${size}" fill="${color}" opacity="${opacity}" />`;
  }
}

function generateAccentElements(color: string, count: number): string {
  let elements = '';
  for (let i = 0; i < count; i++) {
    const x = 50 + Math.random() * 400;
    const y = 50 + Math.random() * 400;
    const radius = 5 + Math.random() * 15;
    const opacity = 0.3 + Math.random() * 0.4;
    
    elements += `<circle cx="${x}" cy="${y}" r="${radius}" fill="${color}" opacity="${opacity}" />`;
  }
  return elements;
}

// Convert SVG to base64 data URL
function svgToDataURL(svgString: string): string {
  const base64 = btoa(svgString);
  return `data:image/svg+xml;base64,${base64}`;
}

// Generate AI description using Gemini
async function generateAIDescription(traits: NFTTraits): Promise<{ name: string; description: string }> {
  const prompt = `Create a mystical and creative NFT name and description based on these visual traits:
  
Background: ${traits.background}
Shape: ${traits.shape} 
Pattern: ${traits.pattern}
Style: ${traits.style}
Colors: ${traits.color1}, ${traits.color2}, ${traits.accent}

Generate a unique, creative name (2-4 words) and a poetic description (1-2 sentences) that captures the essence of these visual elements. Make it sound magical and achievement-worthy.

Format:
Name: [Creative Name Here]
Description: [Poetic description here]`;

  try {
    const aiResponse = await generateContent(prompt);
    
    // Parse the AI response
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
    // Fallback to algorithmic generation
    return generateFallbackDescription(traits);
  }
}

function generateFallbackDescription(traits: NFTTraits): { name: string; description: string } {
  const adjectives = ['Mystic', 'Ethereal', 'Radiant', 'Cosmic', 'Divine', 'Sacred', 'Ancient', 'Luminous'];
  const nouns = ['Focus', 'Meditation', 'Serenity', 'Clarity', 'Wisdom', 'Achievement', 'Vision', 'Energy'];
  
  const name = `${getRandomItem(adjectives)} ${getRandomItem(nouns)} ${traits.shape.charAt(0).toUpperCase() + traits.shape.slice(1)}`;
  const description = `A ${traits.style} manifestation of concentrated willpower, featuring ${traits.background} energies and ${traits.pattern} patterns that celebrate your dedication to mindful focus.`;
  
  return { name, description };
}

// Main NFT generation function
export async function generateFocusNFT(
  duration: number,
  completedAt: string,
  userId?: string
): Promise<GeneratedNFT> {
  try {
    // Generate unique seed based on user and completion time
    const seed = `${userId || 'anonymous'}-${completedAt}-${duration}`;
    
    // Generate random traits
    const traits = generateRandomTraits(seed);
    
    // Generate AI description
    const { name, description } = await generateAIDescription(traits);
    
    // Generate SVG image
    const svgString = generateSVGImage(traits);
    const imageDataURL = svgToDataURL(svgString);
    
    // Create NFT object
    const nft: GeneratedNFT = {
      id: `nft-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      description,
      image: imageDataURL,
      traits,
      timestamp: Date.now(),
      sessionData: {
        duration,
        completedAt
      }
    };
    
    console.log('Generated NFT:', { name, traits });
    return nft;
    
  } catch (error) {
    console.error('Error generating NFT:', error);
    throw new Error('Failed to generate NFT');
  }
}

// Helper function to download NFT image
export function downloadNFT(nft: GeneratedNFT, filename?: string): void {
  const link = document.createElement('a');
  link.href = nft.image;
  link.download = filename || `${nft.name.replace(/\s+/g, '_')}.svg`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
