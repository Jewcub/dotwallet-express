# dotwallet-express

express package for interacting with dotwallet APIs

## to use

```bash
npm install dotwallet-express
```

```js
const express = require('express');
const app = express();

const DotWallet = require('dotwallet-express');
const dotwallet = DotWallet('<YOUR_APP_ID>', '<YOUR_APP_SECRET>');
// Handle the authentication response. Optionally redirect the browser to '/restricted-page'. Optionally pull out the user data and access tokens.
app.get('/auth', (req, res, next) => {
  dotwallet
    .handleAuthResponse(req, res, next, '/restricted-page/')
    .then((result) => (refreshToken = result.accessData.refresh_token));
});
// Refresh access token
dotwallet.refreshToken(refreshToken);
```
