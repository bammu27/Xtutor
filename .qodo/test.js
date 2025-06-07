// test-youtube-api.js
// Run this with: node test-youtube-api.js

const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

async function testYouTubeAPI() {
  const baseUrl = 'http://localhost:3000'; // Change to your server URL

  console.log('🧪 Testing YouTube Explanation API...\n');

  // Public, non-restricted video links
  const publicVideo = 'https://www.youtube.com/watch?v=ysz5S6PUM-U'; // Test video from YouTube
  const shortPublicVideo = 'https://youtu.be/ysz5S6PUM-U'; // Same video in short URL form

  const tests = [
    {
      name: '✅ Valid YouTube URL (Standard)',
      data: { url: publicVideo, ageGroup: 'High School' },
      expectedStatus: 200
    },
    {
      name: '✅ Valid YouTube URL (Short)',
      data: { url: shortPublicVideo, ageGroup: 'Middle School' },
      expectedStatus: 200
    },
    {
      name: '❌ Invalid URL',
      data: { url: 'https://invalid-url.com' },
      expectedStatus: 400
    },
    {
      name: '❌ Missing URL',
      data: { ageGroup: 'High School' },
      expectedStatus: 400
    },
    {
      name: '❌ Invalid Age Group',
      data: { url: publicVideo, ageGroup: 'Alien School' },
      expectedStatus: 400
    },
    {
      name: 'ℹ️ Default Age Group (No ageGroup)',
      data: { url: publicVideo },
      expectedStatus: 200
    }
  ];

  for (const test of tests) {
    console.log(`\n📋 ${test.name}`);
    console.log(`📤 Sending:`, JSON.stringify(test.data, null, 2));

    try {
      const response = await fetch(`${baseUrl}/api/getYouTubeExplanation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(test.data)
      });

      console.log(`📊 Status: ${response.status} (Expected: ${test.expectedStatus})`);
      response.status === test.expectedStatus
        ? console.log('✅ Status check passed')
        : console.error('❌ Status check failed');

      if (response.ok) {
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let result = '';
        let chunkCount = 0;

        if (reader) {
          console.log('📡 Streaming response...');
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            result += chunk;
            chunkCount++;

            if (chunkCount <= 3) {
              console.log(`📦 Chunk ${chunkCount}:`, chunk.substring(0, 100) + '...');
            }
          }
          console.log(`📈 Total chunks: ${chunkCount}`);
          console.log(`📝 First 200 chars: ${result.substring(0, 200)}...`);
        }
      } else {
        const errorText = await response.text();
        console.error(`❌ Error response body: ${errorText}`);
      }

    } catch (error) {
      console.error(`💥 Network or parsing error: ${error.message}`);
      console.info('💡 Check if the server is running or if the video is accessible.');
    }

    console.log('─'.repeat(80));
  }

  console.log('\n🏁 All tests completed!');
}

// Performance test
async function performanceTest() {
  console.log('\n⚡ Running performance test...');

  const testUrl = 'https://www.youtube.com/watch?v=ysz5S6PUM-U';
  const startTime = Date.now();

  try {
    const response = await fetch('http://localhost:3000/api/getYouTubeExplanation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: testUrl,
        ageGroup: 'High School'
      })
    });

    const transcriptTime = Date.now();
    console.log(`⏱️  Transcript extraction time: ${transcriptTime - startTime}ms`);

    if (response.ok) {
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let totalChunks = 0;
      let firstChunkTime = null;
      let lastChunkTime = null;

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunkTime = Date.now();
          if (!firstChunkTime) {
            firstChunkTime = chunkTime;
            console.log(`⏱️  First AI chunk after: ${firstChunkTime - startTime}ms`);
          }
          lastChunkTime = chunkTime;
          totalChunks++;
        }

        console.log(`✅ Total chunks: ${totalChunks}`);
        console.log(`⏱️  Total response time: ${lastChunkTime - startTime}ms`);
        console.log(`📊 Avg chunk time: ${Math.round((lastChunkTime - firstChunkTime) / totalChunks)}ms`);
      }
    } else {
      const text = await response.text();
      console.error(`❌ Error response during performance test: ${text}`);
    }

  } catch (err) {
    console.error(`💥 Performance test error: ${err.message}`);
    console.info('💡 Check server connection or API health.');
  }
}

// Entry
async function main() {
  console.log('🚀 YouTube API Test Suite Started');
  await testYouTubeAPI();
  await performanceTest();
  console.log('\n✨ All tests and benchmarks done!');
}

// Only run if this file is executed directly
if (require.main === module) {
  main().catch(err => {
    console.error('❗ Unhandled error in test suite:', err.message);
  });
}

module.exports = { testYouTubeAPI, performanceTest };
