import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const Callback = () => {
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const code = searchParams.get('code');
    const state = searchParams.get('state');

    // Send the code and state to the parent window
    window.opener.postMessage({ type: 'X_AUTH_CALLBACK', code, state }, window.location.origin);

    // Close the popup
    window.close();
  }, [location]);

  return (
    <div className="h-screen flex items-center justify-center text-white text-lg">
      Processing X authentication...
    </div>
  );
};

export default Callback;