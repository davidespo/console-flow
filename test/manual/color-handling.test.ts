import {FlowLogger} from '../../src';

// Test SQL query with ANSI color codes (similar to what database debugging tools output)
const coloredSqlQuery =
  '\\u001b[94mSELECT\\u001b[0m \\u001b[37m"UserRow"\\u001b[0m\\u001b[37m.\\u001b[0m\\u001b[37m"id"\\u001b[0m \\u001b[94mAS\\u001b[0m \\u001b[37m"UserRow_id"\\u001b[0m\\u001b[37m,\\u001b[0m \\u001b[37m"UserRow"\\u001b[0m\\u001b[37m.\\u001b[0m\\u001b[37m"createdAt"\\u001b[0m \\u001b[94mAS\\u001b[0m \\u001b[37m"UserRow_createdAt"\\u001b[0m\\u001b[37m,\\u001b[0m \\u001b[37m"UserRow"\\u001b[0m\\u001b[37m.\\u001b[0m\\u001b[37m"updatedAt"\\u001b[0m \\u001b[94mAS\\u001b[0m \\u001b[37m"UserRow_updatedAt"\\u001b[0m\\u001b[37m,\\u001b[0m \\u001b[37m"UserRow"\\u001b[0m\\u001b[37m.\\u001b[0m\\u001b[37m"email"\\u001b[0m \\u001b[94mAS\\u001b[0m \\u001b[37m"UserRow_email"\\u001b[0m \\u001b[94mFROM\\u001b[0m \\u001b[37m"user_row"\\u001b[0m \\u001b[37m"UserRow"\\u001b[0m \\u001b[94mORDER BY\\u001b[0m \\u001b[37m"UserRow"\\u001b[0m\\u001b[37m.\\u001b[0m\\u001b[37m"email"\\u001b[0m \\u001b[94mASC\\u001b[0m \\u001b[94mLIMIT\\u001b[0m \\u001b[32m10\\u001b[0m';

console.log('=== Testing Color Handling for Different Formats ===\n');

// Test 1: JSON format - should strip all colors
console.log('1. JSON Format (colors should be stripped):');
const jsonLogger = new FlowLogger({format: 'json'});
jsonLogger.log('Database query:', coloredSqlQuery);
console.log('');

// Test 2: Pretty JSON format - should strip all colors
console.log('2. Pretty JSON Format (colors should be stripped):');
const prettyJsonLogger = new FlowLogger({format: 'prettyJson'});
prettyJsonLogger.log('Database query:', coloredSqlQuery);
console.log('');

// Test 3: Console format - should preserve colors
console.log('3. Console Format (colors should be preserved):');
const consoleLogger = new FlowLogger({
  format: 'cli',
  prefix: {value: 'DB-DEBUG', color: 'blue_800'},
});
consoleLogger.log('Database query:', coloredSqlQuery);
console.log('');

// Test 4: Regular message without colors - should apply level colors
console.log('4. Regular message without colors (should apply level colors):');
consoleLogger.log('Regular database operation completed successfully');
console.log('');

// Test 5: Mixed content - some with colors, some without
console.log('5. Mixed content test:');
consoleLogger.log('Query with colors:', coloredSqlQuery);
consoleLogger.log('Query without colors:', 'SELECT * FROM users WHERE id = 1');
console.log('');

// Test 6: Error with colored SQL
console.log('6. Error with colored SQL:');
const error = new Error('Database connection failed');
consoleLogger.error('Failed to execute query:', error, {
  query: coloredSqlQuery,
  params: {userId: 123},
});
console.log('');

// Test 7: Configure console and test
console.log('7. Configured console test:');
FlowLogger.configureConsole({
  format: 'json',
  prefix: {value: 'APP', color: 'green_800'},
});

console.log(
  'This should be JSON format with colors stripped:',
  coloredSqlQuery,
);
console.info('This should also be JSON format:', 'Regular message');
console.error('Error in JSON format:', new Error('Test error'));

// Reset to console format for final test
FlowLogger.configureConsole({
  format: 'cli',
  prefix: {value: 'APP', color: 'green_800'},
});

console.log('\n8. Final console test (colors preserved):');
console.log('Final colored query:', coloredSqlQuery);
console.log('Final regular message');

// Additional test cases for edge-case SQL queries with colors
console.log('9. Additional SQL color edge cases:');
consoleLogger.log('query:', '\u001b[94mCOMMIT\u001b[0m');
consoleLogger.log(
  'query:',
  '\u001b[94mPRAGMA\u001b[0m \u001b[37mforeign_keys\u001b[0m \u001b[37m=\u001b[0m \u001b[94mON\u001b[0m',
);
consoleLogger.log(
  'query:',
  '\u001b[94mSELECT\u001b[0m \u001b[37m"CategoryEntity"\u001b[0m\u001b[37m.\u001b[0m\u001b[37m"categoryId"\u001b[0m \u001b[94mAS\u001b[0m \u001b[37m"CategoryEntity_categoryId"\u001b[0m\u001b[37m,\u001b[0m \u001b[37m"CategoryEntity"\u001b[0m\u001b[37m.\u001b[0m\u001b[37m"parentId"\u001b[0m \u001b[94mAS\u001b[0m \u001b[37m"CategoryEntity_parentId"\u001b[0m\u001b[37m,\u001b[0m \u001b[37m"CategoryEntity"\u001b[0m\u001b[37m.\u001b[0m\u001b[37m"title"\u001b[0m \u001b[94mAS\u001b[0m \u001b[37m"CategoryEntity_title"\u001b[0m\u001b[37m,\u001b[0m \u001b[37m"CategoryEntity"\u001b[0m\u001b[37m.\u001b[0m\u001b[37m"description"\u001b[0m \u001b[94mAS\u001b[0m \u001b[37m"CategoryEntity_description"\u001b[0m\u001b[37m,\u001b[0m \u001b[37m"CategoryEntity"\u001b[0m\u001b[37m.\u001b[0m\u001b[37m"systemPrompt"\u001b[0m \u001b[94mAS\u001b[0m \u001b[37m"CategoryEntity_systemPrompt"\u001b[0m\u001b[37m,\u001b[0m \u001b[37m"CategoryEntity"\u001b[0m\u001b[37m.\u001b[0m\u001b[37m"createdAt"\u001b[0m \u001b[94mAS\u001b[0m \u001b[37m"CategoryEntity_createdAt"\u001b[0m\u001b[37m,\u001b[0m \u001b[37m"CategoryEntity"\u001b[0m\u001b[37m.\u001b[0m\u001b[37m"updatedAt"\u001b[0m \u001b[94mAS\u001b[0m \u001b[37m"CategoryEntity_updatedAt"\u001b[0m \u001b[94mFROM\u001b[0m \u001b[37m"categories"\u001b[0m \u001b[37m"CategoryEntity"\u001b[0m \u001b[94mWHERE\u001b[0m \u001b[37m"CategoryEntity"\u001b[0m\u001b[37m.\u001b[0m\u001b[37m"categoryId"\u001b[0m \u001b[94mIN\u001b[0m \u001b[37m(\u001b[0m\u001b[37m?\u001b[0m\u001b[37m)\u001b[0m \u001b[90m-- PARAMETERS: ["ZhS76cjeAKSAmevHcEm6vfU8"]\u001b[0m',
);
console.log('');
