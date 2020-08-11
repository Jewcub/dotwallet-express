# dotwallet-express

express package for interacting with dotwallet APIs

## to use

```bash
npm install dotwallet-express
```

```js
const express = require('express');
const app = express();

import DotWallet from 'dotwallet-express';
const dotwallet = new DotWallet(YOUR_APP_ID, YOUR_APP_SECRET);

// send the authentication response
app.get(
  '/auth',
  dotwallet.handleAuthResponse('/restricted-page/').then((result) => {
    const userData = result.userData;
    const refreshToken = result.accessData.refresh_token;
  }),
);
// refresh access token
dotwallet.refreshToken(refreshToken);
```
