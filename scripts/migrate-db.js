// scripts/migrate-db.js
const { execSync } = require('child_process');

// This script runs the Prisma migration in production
async function main() {
  try {
    console.log('Starting database migration...');
    
    // Run Prisma migrations
    execSync('npx prisma migrate deploy', {
      env: process.env,
      stdio: 'inherit',
    });
    
    console.log('Database migration completed successfully');
  } catch (error) {
    console.error('Error during database migration:', error);
    process.exit(1);
  }
}

main(); 