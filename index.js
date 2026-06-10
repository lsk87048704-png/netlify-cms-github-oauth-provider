require('dotenv').config({ silent: true });
const express = require('express');
const app = express();
const simpleOauthModule = require('simple-oauth2');
const authMiddleWareInit = require('./auth.js');
const callbackMiddleWareInit = require('./callback');

const oauthProvider = process.env.OAUTH_PROVIDER || 'github';
const loginAuthTarget = process.env.AUTH_TARGET || '_self';

const config = {
  client: {
    id: process.env.OAUTH_CLIENT_ID,
    secret: process.env.OAUTH_CLIENT_SECRET
  },
  auth: {
    tokenHost: process.env.GIT_HOSTNAME || 'https://github.com',
    tokenPath: process.env.OAUTH_TOKEN_PATH || '/login/oauth/access_token',
    authorizePath: process.env.OAUTH_AUTHORIZE_PATH || '/login/oauth/authorize'
  }
};

const oauth2 = new simpleOauthModule.AuthorizationCode(config);

app.get('/', (req, res) => {
  res.send(`Hello<br><a href="/auth" target="${loginAuthTarget}">Log in with ${oauthProvider.toUpperCase()}</a>`);
});

app.get('/auth', authMiddleWareInit(oauth2));
app.get('/callback', callbackMiddleWareInit(oauth2, oauthProvider));
app.get('/success', (req, res) => res.send(''));

module.exports = app;
