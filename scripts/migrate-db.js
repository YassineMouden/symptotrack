// scripts/migrate-db.js
import { execSync } from 'child_process';
import { env } from '../src/env.js';

// This script runs the Prisma migration in production
async function main() {
  try {
    console.log('Starting database migration...');
    
    // Run Prisma migrations
    execSync('npx prisma migrate deploy', {
      env: {
        ...process.env,
        DATABASE_URL: env.DATABASE_URL,
      },
      stdio: 'inherit',
    });
    
    console.log('Database migration completed successfully');
  } catch (error) {
    console.error('Error during database migration:', error);
    process.exit(1);
  }
}

main(); 