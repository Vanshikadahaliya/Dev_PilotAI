import fs from 'fs';
import path from 'path';

const file = path.resolve(process.cwd(), 'node_modules', 'express-rate-limit', 'tsconfig.json');

try {
  if (fs.existsSync(file)) {
    fs.unlinkSync(file);
    console.log('Removed problematic express-rate-limit/tsconfig.json');
  } else {
    console.log('No express-rate-limit tsconfig found');
  }
} catch (err) {
  console.error('Error removing express-rate-limit tsconfig', err);
}
