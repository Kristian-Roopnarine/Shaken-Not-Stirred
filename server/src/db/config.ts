require('dotenv').config();
let env: string = process.env['NODE_ENV'] as string;
console.log({ env });

interface AppEnvironment {
  [key: string]: {
    [key: string]: string;
  };
}
const dev: AppEnvironment = {
  TABLE_NAMES: {
    users: 'dev.users',
    matches: 'dev.user_matches',
  },
};

const test: AppEnvironment = {
  TABLE_NAMES: {
    users: 'test.users',
    matches: 'test.user_matches',
  },
};
interface Config {
  [key: string]: AppEnvironment;
}

const config: Config = {
  dev,
  test,
};

export default config[env];
