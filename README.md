# dotwallet-express

express package for interacting with dotwallet APIs

## To use

```bash
npm install dotwallet-express
```

```js
const express = require('express');
const app = express();

const DotWallet = require('dotwallet-express');
const dotwallet = DotWallet('<YOUR_APP_ID>', '<YOUR_APP_SECRET>');
// Handle the authentication response.
// Optionally redirect the browser to '/restricted-page'.
// Optionally get back user data and access tokens.
app.get('/auth', async (req, res, next) => {
  const result = await dotwallet.handleAuthResponse(req, res, next, '/restricted-page');
  refreshToken = result.accessData.refresh_token;
});
// Refresh access token
const newToken = await dotwallet.refreshAccess(refreshToken);

// handle order
app.post('/create-order', async (req, res) => {
  // save the merchant_order_sn for records or checking order status
  const merchant_order_sn = req.body.merchant_order_sn;
  const order_sn = await dotwallet.handleOrder(req.body, true);
  // return the order_sn to the client to redirect to the order confirmation page
  res.json({ order_sn });
});
```

## Examples

See the examples folder in the package, and check out the `examples/simple-store/src/index.js` file.
