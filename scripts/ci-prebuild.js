import fs from 'fs';
import path from 'path';

// Define the path to the problematic symlink
// We use process.cwd() to ensure we are relative to the project root
const symlinkPath = path.join(process.cwd(), 'public', 'assets', 'r2');

// Check if we are running in a CI environment (Cloudflare sets CF_PAGES=1)
// We also check for generic CI, just in case.
const isCI = process.env.CF_PAGES === '1' || process.env.CI === 'true';

console.log('-------------------------------------------------------');
console.log('🔧 Pre-Build Environment Check');
console.log('-------------------------------------------------------');

if (isCI) {
    console.log('🌍 Environment: CI / Cloudflare (Detected)');
    console.log(`🔍 Checking for local-only symlink: ${symlinkPath}`);

    try {
        // Attempt to check if *anything* exists at this path (file, dir, or broken symlink)
        // lstatSync works on broken symlinks, where existsSync returns false!
        const stats = fs.lstatSync(symlinkPath);

        console.log('🔍 Path detected. Checking if it is a symlink...');
        if (stats.isSymbolicLink()) {
            console.log('⚠️  Symlink found (possibly broken). Removing it to prevent build crash...');
            fs.unlinkSync(symlinkPath);
            console.log('✅ Symlink removed. Build can proceed safely.');
        } else {
            console.log('ℹ️  Path exists but is not a symlink. Leaving it alone.');
        }
    } catch (error) {
        if (error.code === 'ENOENT') {
            console.log('✅ No symlink (or file) found at public/assets/r2. Good to go.');
        } else {
            console.error(`❌ Error verifying symlink: ${error.message}`);
        }
    }
} else {
    console.log('💻 Environment: Local Development');
    console.log('🛡️  Preserving asset symlinks for local preview.');
}

console.log('-------------------------------------------------------');
