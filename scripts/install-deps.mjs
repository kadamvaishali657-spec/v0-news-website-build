import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');

console.log('[v0] Installing dependencies with pnpm...');

try {
  execSync('pnpm install --no-frozen-lockfile', {
    cwd: projectRoot,
    stdio: 'inherit',
  });
  console.log('[v0] Dependencies installed successfully!');
  process.exit(0);
} catch (error) {
  console.error('[v0] Failed to install dependencies:', error.message);
  process.exit(1);
}
