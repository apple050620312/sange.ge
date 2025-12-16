const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, 'public', 'images');

// Configuration
const SIZES = [480, 800, 1200]; // Widths to generate
const QUALITY = 80;

async function processFile(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    if (ext !== '.webp') return; // Only process WebP (assuming conversion is done)
    
    // Skip already resized images (e.g. name-480w.webp)
    if (filePath.match(/-\d+w\.webp$/)) return;

    const filename = path.basename(filePath, ext);
    const dir = path.dirname(filePath);

    try {
        const image = sharp(filePath);
        const metadata = await image.metadata();

        console.log(`Processing: ${path.relative(imagesDir, filePath)} (${metadata.width}x${metadata.height})`);

        for (const width of SIZES) {
            if (metadata.width > width) {
                const outputName = `${filename}-${width}w.webp`;
                const outputPath = path.join(dir, outputName);

                if (!fs.existsSync(outputPath)) {
                    await image
                        .resize({ width: width, withoutEnlargement: true })
                        .webp({ quality: QUALITY })
                        .toFile(outputPath);
                    console.log(`  -> Generated ${outputName}`);
                }
            }
        }
    } catch (err) {
        console.error(`Error processing ${filePath}:`, err);
    }
}

async function scanDir(directory) {
    const files = fs.readdirSync(directory);

    for (const file of files) {
        const fullPath = path.join(directory, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            await scanDir(fullPath);
        } else {
            await processFile(fullPath);
        }
    }
}

console.log('Starting image optimization...');
scanDir(imagesDir).then(() => {
    console.log('Image optimization complete!');
});
