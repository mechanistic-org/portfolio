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

    if (fs.existsSync(symlinkPath)) {
        try {
            // Check if it is actually a symlink
            const stats = fs.lstatSync(symlinkPath);
            if (stats.isSymbolicLink()) {
                console.log('⚠️  Symlink found. Removing it to prevent build crash...');
                fs.unlinkSync(symlinkPath);
                console.log('✅ Symlink removed. Build can proceed safely.');
            } else {
                console.log('ℹ️  Path exists but is not a symlink. Leaving it alone.');
            }
        } catch (error) {
            console.error(`❌ Error verifying symlink: ${error.message}`);
            // We don't exit(1) because we want the build to try anyway.
        }
    } else {
        console.log('✅ No symlink found used. Good to go.');
    }
} else {
    console.log('💻 Environment: Local Development');
    console.log('🛡️  Preserving asset symlinks for local preview.');
}

console.log('-------------------------------------------------------');
