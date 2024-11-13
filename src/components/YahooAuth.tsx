import React from 'react';
import { useEffect } from 'react';
import { getAuthUrl, handleCallback } from '../lib/yahoo';
import toast from 'react-hot-toast';

export const YahooAuth: React.FC = () => {
  useEffect(() => {
    // Check if this is a callback from Yahoo
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    
    if (code) {
      handleCallback(code).then(result => {
        if (result.success) {
          toast.success('Successfully connected to Yahoo Fantasy');
          // Remove the code from the URL
          window.history.replaceState({}, document.title, window.location.pathname);
        } else {
          toast.error('Failed to connect to Yahoo Fantasy');
        }
      });
    }
  }, []);

  const handleConnect = async () => {
    const authUrl = getAuthUrl();
    window.location.href = authUrl;
  };

  return (
    <button
      onClick={handleConnect}
      className="retro-button"
    >
      Connect Yahoo Fantasy
    </button>
  );
};