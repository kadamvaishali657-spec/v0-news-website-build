import { execSync } from 'child_process';

console.log('Installing dependencies with pnpm...');

try {
  execSync('pnpm install --no-frozen-lockfile', {
    stdio: 'inherit',
    cwd: process.cwd(),
  });
  console.log('✓ Dependencies installed successfully!');
  process.exit(0);
} catch (error) {
  console.error('✗ Failed to install dependencies');
  process.exit(1);
}
