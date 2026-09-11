import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const imageFiles = [
  'vetki.jpg', 'vetki-sharp.jpg', 'teplitsa.jpg',
  'seed-el-kolyuchaya.jpg', 'seed-el-serbskaya.jpg', 'seed-el-ayanskaya.jpg',
  'seed-el-sibirskaya.jpg', 'seed-sosna-mugus.jpg', 'seed-sosna-pumilio.jpg',
  'sapling-el-kolyuchaya.jpg', 'sapling-el-serbskaya.jpg', 'sapling-el-ayanskaya.jpg',
  'sapling-el-sibirskaya.jpg', 'sapling-sosna-mugus.jpg', 'sapling-sosna-obyknovennaya.jpg',
  'adult-kolyuchaya.jpg', 'adult-serbskaya.jpg', 'adult-ayanskaya.jpg', 'adult-sibirskaya.jpg',
  'adult-sosna-mugus.jpg', 'adult-sosna-pumilio.jpg', 'adult-sosna-obyknovennaya.jpg',
];

const imagesObj = {};
let totalBytes = 0;
for (const f of imageFiles){
  const buf = fs.readFileSync(path.join(__dirname, f));
  totalBytes += buf.length;
  imagesObj[f] = 'data:image/jpeg;base64,' + buf.toString('base64');
}
console.log('embedded', imageFiles.length, 'images,', (totalBytes/1024).toFixed(0), 'KB raw ->', (JSON.stringify(imagesObj).length/1024).toFixed(0), 'KB base64');

let html = fs.readFileSync(path.join(__dirname, 'app.html'), 'utf8');

const marker = 'const IMAGES = {};';
if (!html.includes(marker)) throw new Error('IMAGES marker not found');

const injected = 'const IMAGES = ' + JSON.stringify(imagesObj) + ';';
html = html.replace(marker, injected);

const outPath = path.join(__dirname, 'app-final.html');
fs.writeFileSync(outPath, html, 'utf8');
console.log('wrote', outPath, (fs.statSync(outPath).size/1024).toFixed(0), 'KB');
