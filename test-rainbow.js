const {FlowLogger} = require('./dist/index.js');

// Configure console logging
FlowLogger.configureConsole({
  format: 'cli',
  prefix: {value: 'test-app'},
});

// Test rainbow logging with emojis
console.rainbow('🎉 1 million users milestone reached! 🎉');
console.rainbow('🌈🦄🎉 Special rainbow message! 🎉🦄🌈');
console.rainbow('🚀 Launch successful! 🎊');
