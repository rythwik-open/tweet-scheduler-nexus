import { createContext, useContext, useState, useEffect } from 'react';
import { Buffer } from 'buffer';
import { useAuth } from 'react-oidc-context';

const XAuthContext = createContext(null);

export const XAuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);
  const auth = useAuth();

  const clientId = import.meta.env.VITE_APP_X_CLIENT_ID;
  const clientSecret = import.meta.env.VITE_APP_X_CLIENT_SECRET;
  const redirectUri = import.meta.env.VITE_APP_X_CALLBACK_URL;
  const scope = "tweet.read users.read tweet.write offline.access";

  const fetchUserStatus = async () => {
    try {
      const cognitoToken = auth.user?.access_token;
      if (!cognitoToken) {
        console.log('No Cognito token available');
        return;
      }
      console.log('Cognito Token:', cognitoToken);
      // Decode JWT payload
      const payload = JSON.parse(atob(cognitoToken.split('.')[1]));
      console.log('Token Payload:', payload);

      const response = await fetch('https://vm7pcq411e.execute-api.ap-south-1.amazonaws.com/user', {
        headers: {
          'Authorization': `Bearer ${cognitoToken}`,
        },
      });

      if (!response.ok) {
        console.log('Fetch response:', response.status, await response.text());
        throw new Error('Failed to fetch user status');
      }

      const data = await response.json();
      console.log('isTokenPresent:', data.isTokenPresent); // Log the value of isTokenPresent
      setIsAuthenticated(data.isTokenPresent);
      setUser({
        name: data.name,
        username: data.username,
        email: data.email,
        profile_image_url: data.profile_image_url
      });
    } catch (error) {
      console.error('Fetch user status failed:', error);
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  useEffect(() => {
    if (auth.isAuthenticated && auth.user?.access_token) {
      fetchUserStatus();
    }
  }, [auth.isAuthenticated, auth.user?.access_token]);

  const login = async () => {
    const state = "x-auth";
    const code_verifier = generateCodeVerifier();
    const code_challenge = await generateCodeChallenge(code_verifier);
    localStorage.setItem("code_verifier", code_verifier);

    const authUrl = `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=${state}&code_challenge=${code_challenge}&code_challenge_method=S256`;

    const width = 600;
    const height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;
    const popup = window.open(authUrl, 'XAuth', `width=${width},height=${height},left=${left},top=${top}`);

    return new Promise((resolve, reject) => {
      const messageHandler = (event) => {
        if (event.origin !== window.location.origin) return;
        if (event.data.type === 'X_AUTH_CALLBACK') {
          const { code, state: receivedState } = event.data;
          if (receivedState === state) {
            resolve(code);
          } else {
            reject(new Error('Invalid state'));
          }
          popup.close();
          window.removeEventListener('message', messageHandler);
        }
      };

      window.addEventListener('message', messageHandler);

      const checkPopupClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkPopupClosed);
          window.removeEventListener('message', messageHandler);
          reject(new Error('Popup closed without authorization'));
        }
      }, 500);
    });
  };

  const logout = async () => {
    setIsAuthenticated(false);
    setAccessToken(null);
    setUser(null);
    localStorage.removeItem('x_access_token');
    localStorage.removeItem('x_refresh_token');
    localStorage.removeItem('x_token_expiry');
    await fetchUserStatus();
  };

  const exchangeCodeForToken = async (code) => {
    const codeVerifier = localStorage.getItem('code_verifier');
    const cognitoToken = auth.user?.access_token;

    const response = await fetch('https://vm7pcq411e.execute-api.ap-south-1.amazonaws.com/connect', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${cognitoToken}`,
      },
      body: JSON.stringify({
        code,
        code_verifier: codeVerifier,
        redirect_uri: redirectUri,
        client_id: clientId,
        client_secret: clientSecret,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to exchange code for token');
    }

    const data = await response.json();
    const { access_token, refresh_token, expires_in, user: userData } = data;

    setAccessToken(access_token);
    localStorage.setItem('x_access_token', access_token);
    localStorage.setItem('x_refresh_token', refresh_token);
    localStorage.setItem('x_token_expiry', (Date.now() + expires_in * 1000).toString());

    setUser(userData);
    setIsAuthenticated(true);
    await fetchUserStatus();
  };

  const value = {
    isAuthenticated,
    accessToken,
    user,
    login,
    logout,
    exchangeCodeForToken,
    fetchUserStatus,
  };

  return <XAuthContext.Provider value={value}>{children}</XAuthContext.Provider>;
};

export const useXAuth = () => {
  const context = useContext(XAuthContext);
  if (!context) {
    throw new Error('useXAuth must be used within an XAuthProvider');
  }
  return context;
};

const generateCodeVerifier = () => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
};

const generateCodeChallenge = async (codeVerifier) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const buffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(buffer));
  const hashBase64 = Buffer.from(hashArray).toString('base64');
  return hashBase64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};