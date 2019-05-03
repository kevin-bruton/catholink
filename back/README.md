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

CAT_MONGODB_URI
Value: http://localhost:27017

CAT_GOOGLE_CREDENTIALS_PATH
Value: path and filename of file where google credentials are stored

CAT_GOOGLE_TOKEN_PATH
Value: path and filename of file where google token is stored
