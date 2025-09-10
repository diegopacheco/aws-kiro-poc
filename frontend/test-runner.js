#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

const runCommand = (command, args, options = {}) => {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: 'inherit',
      shell: true,
      ...options
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with exit code ${code}`));
      }
    });

    child.on('error', reject);
  });
};

async function runTests() {
  console.log('🧪 Running Frontend Tests...\n');

  try {
    // Install dependencies
    console.log('📦 Installing dependencies...');
    await runCommand('bun', ['install'], { cwd: __dirname });

    // Run tests with coverage
    console.log('\n🔍 Running tests with coverage...');
    await runCommand('bun', ['run', 'test:coverage'], { cwd: __dirname });

    console.log('\n✅ All tests completed successfully!');
    console.log('📊 Coverage report generated in coverage/ directory');
    
  } catch (error) {
    console.error('\n❌ Tests failed:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  runTests();
}

module.exports = { runTests };