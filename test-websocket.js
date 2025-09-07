#!/usr/bin/env node

/**
 * WebSocket Connection Test Script
 * 
 * This script tests the WebSocket connection to your studio service.
 * Run this after starting your Docker containers to verify WebSocket connectivity.
 * 
 * Usage:
 *   node test-websocket.js [URL]
 * 
 * Examples:
 *   node test-websocket.js ws://localhost/ws/studio
 *   node test-websocket.js ws://localhost:3001/ws
 */

const WebSocket = require('ws');

const DEFAULT_URL = 'ws://localhost/ws/studio';
const url = process.argv[2] || DEFAULT_URL;

console.log(`🔌 Testing WebSocket connection to: ${url}`);
console.log('📋 This will test the studio WebSocket endpoint...\n');

const ws = new WebSocket(url);

let pingInterval;

ws.on('open', function open() {
  console.log('✅ WebSocket connection established successfully!');
  console.log('📡 Sending ping message...');
  
  // Send a ping message
  ws.send(JSON.stringify({
    type: 'ping',
    timestamp: Date.now(),
    test: true
  }));
  
  // Send a subscription test
  ws.send(JSON.stringify({
    type: 'subscribe',
    channel: 'test',
    test: true
  }));
  
  // Set up periodic ping to keep connection alive
  pingInterval = setInterval(() => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        type: 'ping',
        timestamp: Date.now()
      }));
      console.log('🏓 Ping sent...');
    }
  }, 30000); // Ping every 30 seconds
});

ws.on('message', function message(data) {
  try {
    const parsed = JSON.parse(data);
    console.log('📨 Received message:', parsed);
    
    if (parsed.type === 'pong') {
      console.log('🏓 Pong received - connection is healthy!');
    }
    
    if (parsed.type === 'subscribed') {
      console.log('📺 Successfully subscribed to channel:', parsed.channel);
    }
  } catch (error) {
    console.log('📨 Received raw message:', data.toString());
  }
});

ws.on('error', function error(err) {
  console.error('❌ WebSocket error:', err.message);
  if (err.code === 'ECONNREFUSED') {
    console.log('\n🔧 Troubleshooting tips:');
    console.log('1. Make sure Docker containers are running: docker-compose ps');
    console.log('2. Check if studio service is healthy: docker-compose logs studio');
    console.log('3. Verify nginx is proxying correctly: docker-compose logs nginx');
    console.log('4. Try connecting directly to studio: ws://localhost:3001/ws');
  }
});

ws.on('close', function close(code, reason) {
  console.log(`🔌 WebSocket connection closed. Code: ${code}, Reason: ${reason || 'No reason provided'}`);
  if (pingInterval) {
    clearInterval(pingInterval);
  }
  
  if (code !== 1000) {
    console.log('\n🔧 Connection closed unexpectedly. Check your Docker logs:');
    console.log('docker-compose logs studio');
    console.log('docker-compose logs nginx');
  } else {
    console.log('✅ Connection closed normally');
  }
});

// Handle script termination
process.on('SIGINT', () => {
  console.log('\n🛑 Terminating WebSocket test...');
  if (pingInterval) {
    clearInterval(pingInterval);
  }
  ws.close();
  process.exit(0);
});

// Timeout after 2 minutes
setTimeout(() => {
  console.log('\n⏰ Test timeout after 2 minutes');
  if (pingInterval) {
    clearInterval(pingInterval);
  }
  ws.close();
  process.exit(0);
}, 120000);

console.log('\n💡 Press Ctrl+C to stop the test');
console.log('⏱️  Test will timeout after 2 minutes\n');
