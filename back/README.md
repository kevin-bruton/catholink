How to change jest color reporting from red to magenta:
Change .red to .magenta in:

D:\cat\back\node_modules\jest\node_modules\jest-cli\build\reporters
// jest-matcher-utils/build/index.js
jest-message-utils/build/index.js
jest-resolve/build/index.js
jest-runtime/build/cli/index.js
jest-runtime/build/headers.js
jest-snapshot/build/utils.js
jest-util/build/get_console_output.js
// jest-validate/build/errors.js
// jest-validate/build/utils.js

Have to set the following environment variables:

CAT_SERVER_MODE (optional)
If set to 'DEV' then external services are not invoked ie. google email sending

CAT_ENV_DIR
Its value should be the path of the directory where configuration values are found.
It should contain the following files:

- conf.js
It should export an object with this structure:
module.exports = {
  JWT: {
    PRIVATE_KEY: '',
    PUBLIC_KEY: ''
  },
  MONGO: {
    DEV: {
      USER: '',
      PWD: '',
      HOST: '',
      DB: ''
    },
    PRO: {
      USER: '',
      PWD: '',
      HOST: '',
      DB: ''
    }
  },
  GOOGLE_CREDENTIALS: {}
}

- env.js
It should export an object with this structure, indicating 'DEV' or 'PRO':
module.exports = {
  ENV: 'DEV'
}

- google-token.json
It should contain the Google token which can be refreshed by the application when necessary

ENVIRONMENTS:
- DEV: Mongo local
- PRO(rasp): Mongo Cloud
