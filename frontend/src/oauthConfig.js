const authEndpoint = "https://github.com/login/oauth/authorize";

export const getAuthorizeHref = () => {
  const clientId = process.env.REACT_APP_CLIENT_ID;
  const redirectUri = process.env.REACT_APP_REDIRECT_URI;
  return `${authEndpoint}?scope=user&client_id=${clientId}&redirect_uri=${redirectUri}`;
};
