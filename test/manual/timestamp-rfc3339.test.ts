import {buildTimestampGenerator} from '../../src/timestamp';

console.log('=== Testing RFC3339 Timestamp ===\n');

// Test RFC3339 timestamp generation
const rfc3339Generator = buildTimestampGenerator('RFC3339');
const rfc3339Timestamp = rfc3339Generator();

console.log('1. RFC3339 Timestamp:', rfc3339Timestamp);

// Verify it's a valid RFC3339 format (ISO 8601 with timezone)
const rfc3339Regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
const isValidRfc3339 = rfc3339Regex.test(rfc3339Timestamp);

console.log('2. Is valid RFC3339 format:', isValidRfc3339);
console.log('3. Timestamp length:', rfc3339Timestamp.length);
console.log('4. Contains timezone (Z):', rfc3339Timestamp.includes('Z'));

// Compare with ISO8601 (which truncates)
const iso8601Generator = buildTimestampGenerator('ISO8601');
const iso8601Timestamp = iso8601Generator();

console.log('\n5. Comparison:');
console.log('RFC3339:', rfc3339Timestamp);
console.log('ISO8601:', iso8601Timestamp);
console.log(
  'RFC3339 is longer:',
  rfc3339Timestamp.length > iso8601Timestamp.length,
);

// Test that it's a valid date
const parsedDate = new Date(rfc3339Timestamp);
const isValidDate = !isNaN(parsedDate.getTime());

console.log('\n6. Date validation:');
console.log('Parsed date:', parsedDate.toISOString());
console.log('Is valid date:', isValidDate);
console.log('Matches original:', parsedDate.toISOString() === rfc3339Timestamp);

console.log('\n=== RFC3339 Timestamp Test Complete ===');
