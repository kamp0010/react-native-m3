const fs = require('node:fs');
const path = require('node:path');

const sourceDir = path.join(__dirname, 'nitrogen/generated/shared/json');
const targetDir = path.join(__dirname, 'src/generated');

if (!fs.existsSync(sourceDir)) {
    console.error(`Source directory ${sourceDir} does not exist. Run nitrogen first.`);
    process.exit(1);
}

if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
}

const files = fs.readdirSync(sourceDir).filter(f => f.endsWith('.json'));

for (const file of files) {
    const sourceFile = path.join(sourceDir, file);
    const targetFile = path.join(targetDir, file);
    fs.copyFileSync(sourceFile, targetFile);
    console.log(`Copied ${file} to src/generated/`);
}
