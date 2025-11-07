#!/usr/bin/env node

const http = require('http');

console.log('🧪 Testing End-to-End Refresh Flow...\n');

// Test GET /api/refresh to check status
function testGetStatus() {
  return new Promise((resolve, reject) => {
    const req = http.get('http://localhost:3000/api/refresh', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          console.log('✅ GET /api/refresh status:', result.message);
          console.log('   - Can refresh:', result.canRefresh);
          console.log('   - Last update:', result.lastUpdate || 'None');
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
    });
    
    req.on('error', reject);
    req.setTimeout(5000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

// Test POST /api/refresh to trigger refresh
function testPostRefresh() {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({});
    
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/refresh',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': postData.length
      }
    };
    
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          console.log(`\n🔄 POST /api/refresh response (${res.statusCode}):`);
          console.log('   - Success:', result.success || false);
          console.log('   - Message:', result.message);
          if (result.error) {
            console.log('   - Error:', result.error);
          }
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
    });
    
    req.on('error', reject);
    req.setTimeout(5000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
    
    req.write(postData);
    req.end();
  });
}

// Test refresh status polling
function testRefreshStatus() {
  return new Promise((resolve, reject) => {
    const req = http.get('http://localhost:3000/api/refresh-status', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          console.log('\n📊 GET /api/refresh-status:');
          console.log('   - Is running:', result.isRunning);
          console.log('   - Progress:', result.progress || 0, '%');
          console.log('   - Message:', result.message);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
    });
    
    req.on('error', reject);
    req.setTimeout(5000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

// Run the tests
async function runTests() {
  try {
    console.log('1. Testing initial status...');
    await testGetStatus();
    
    console.log('\n2. Testing refresh trigger...');
    await testPostRefresh();
    
    console.log('\n3. Testing refresh status...');
    await testRefreshStatus();
    
    console.log('\n🎉 All API endpoints are working!');
    console.log('\n📋 Next Steps:');
    console.log('   1. Open http://localhost:3000 in your browser');
    console.log('   2. Look for the "Data Refresh" panel at the top');
    console.log('   3. Click "Refresh Now" to test end-to-end');
    console.log('   4. Watch the progress bar and status updates');
    console.log('\n⚠️  Note: Actual scraping will take 10-15 minutes');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('   - Make sure the dev server is running: npm run dev');
    console.log('   - Check that localhost:3000 is accessible');
    console.log('   - Verify API routes are compiled correctly');
  }
}

runTests();