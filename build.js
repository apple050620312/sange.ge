const ejs = require('ejs');
const fs = require('fs');
const path = require('path');

const viewsDir = path.join(__dirname, 'views');
const publicDir = path.join(__dirname, 'public');
const distDir = path.join(__dirname, 'dist');

// Define data passed to template (extracted from server.js logic if any, currently assumed empty/basic)
// Based on typical Express + EJS usage, index.ejs usually receives a title or similar.
// Looking at the file, it seems mostly static or hardcoded, but we'll try to find out.
// If server.js passes objects, we need to mimic them here. 
// For now, I'll assume an empty object or basic config.
const templateData = {}; 

async function build() {
    try {
        console.log('Building static site...');

        // 1. Create/Clean dist folder
        if (fs.existsSync(distDir)) {
            fs.rmSync(distDir, { recursive: true, force: true });
        }
        fs.mkdirSync(distDir);

        // 2. Render index.ejs to HTML
        const templatePath = path.join(viewsDir, 'index.ejs');
        const outputPath = path.join(distDir, 'index.html');
        
        // Check if template exists
        if (!fs.existsSync(templatePath)) {
            throw new Error(`Template not found: ${templatePath}`);
        }

        // Render
        const html = await ejs.renderFile(templatePath, templateData);
        fs.writeFileSync(outputPath, html);
        console.log('✓ Generated index.html');

        // 3. Copy public assets
        if (fs.existsSync(publicDir)) {
            // Using fs.cpSync (available in Node 16.7.0+)
            fs.cpSync(publicDir, distDir, { recursive: true });
            console.log('✓ Copied public assets');
        }

        console.log('Build completed successfully! Output in ./dist');

    } catch (error) {
        console.error('Build failed:', error);
        process.exit(1);
    }
}

build();
