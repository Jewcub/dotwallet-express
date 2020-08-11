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

// Handle the authentication response. Optionally redirect the browser to '/restricted-page'. Optionally pull out the user data and access tokens.
app.get(
  '/auth',
  dotwallet.handleAuthResponse('/restricted-page').then((result) => {
    const userData = result.userData;
    const refreshToken = result.accessData.refresh_token;
  }),
);
// Refresh access token
dotwallet.refreshToken(refreshToken);
```
