export const oktaConfig = {
  clientId: process.env.REACT_APP_CLIENT_ID,
  issuer: `https://${process.env.REACT_APP_USER_ID}/oauth2/default`,
  redirectUri: "http://localhost:3000/login/callback",
  scopes: ["openid", "profile", "email"],
  pkce: true,
  disableHttpsCheck: true,
  features: {
    registration: true,
  },
};

