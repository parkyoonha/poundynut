import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const publicDir = './public';
const maxWidth = 1920;
const quality = 90;

const files = fs.readdirSync(publicDir).filter(f =>
  /\.(png|jpg|jpeg)$/i.test(f)
);

console.log(`Found ${files.length} images to optimize...\n`);

for (const file of files) {
  const filePath = path.join(publicDir, file);
  const stats = fs.statSync(filePath);
  const sizeMB = (stats.size / 1024 / 1024).toFixed(1);

  if (stats.size < 500 * 1024) {
    console.log(`⏭️  ${file} (${sizeMB}MB) - already small, skipping`);
    continue;
  }

  try {
    const image = sharp(filePath);
    const metadata = await image.metadata();

    let pipeline = image;

    if (metadata.width > maxWidth) {
      pipeline = pipeline.resize(maxWidth, null, { withoutEnlargement: true });
    }

    const outputPath = filePath.replace(/\.(png|jpg|jpeg)$/i, '.webp');

    await pipeline
      .webp({ quality })
      .toFile(outputPath);

    const newStats = fs.statSync(outputPath);
    const newSizeMB = (newStats.size / 1024 / 1024).toFixed(2);
    const reduction = ((1 - newStats.size / stats.size) * 100).toFixed(0);

    console.log(`✅ ${file} (${sizeMB}MB) → ${path.basename(outputPath)} (${newSizeMB}MB) - ${reduction}% smaller`);
  } catch (err) {
    console.log(`❌ ${file} - Error: ${err.message}`);
  }
}

console.log('\nDone! Update your code to use .webp files instead of .png/.jpg');
