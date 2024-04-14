const axios = require('axios');
const qs = require('qs');
require('dotenv').config();

const client_id = process.env.CLIENT_ID_SENTINEL_HUB;
const client_secret = process.env.CLIENT_SECRET_SENTINEL_HUB;

const instance = axios.create({
  baseURL: "https://services.sentinel-hub.com"
})

const config = {
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
  }
}

const body = qs.stringify({
  client_id,
  client_secret,
  grant_type: "client_credentials"
})
console.log("body", body)

// All requests using this instance will have an access token automatically added
instance.post("/auth/realms/main/protocol/openid-connect/token", body, config).then(resp => {
  Object.assign(instance.defaults, {headers: {authorization: `Bearer ${resp.data.access_token}`}})
});


module.exports = instance;