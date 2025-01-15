import {Logger} from '../../src/logger/Logger';

const logger = new Logger({
  prefix: {value: 'meta', color: 'orange_400'},
});

logger.rainbow(
  'This happens to be a really long message about testing longer line lengths 😀',
  {
    kind: 'USER',
    id: '00asdf3asc',
    name: 'John Doe',
    email: 'jd123534@company.net',
    role: 'admin',
    permissions: ['read', 'write', 'delete'],
    active: true,
    profile: {
      dob: '1990-01-01',
      bio: 'I am a person who likes to test things',
      avatar: 'https://example.com/avatar.jpg',
    },
  },
);
