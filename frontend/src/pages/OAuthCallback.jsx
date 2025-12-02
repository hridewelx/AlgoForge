import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { checkAuthenticatedUser } from '../authenticationSlicer';
import { toast } from 'react-hot-toast';

const OAuthCallback = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();

  console.log("SearchParams:", searchParams);

  useEffect(() => {
    const handleCallback = async () => {
      const success = searchParams.get('success');
      const error = searchParams.get('error');

      if (success === 'true') {
        // OAuth was successful, check authentication status
        try {
          await dispatch(checkAuthenticatedUser()).unwrap();
          toast.success('Login successful!');
          navigate('/');
        } catch (err) {
          toast.error('Failed to verify authentication');
          navigate('/login');
        }
      } else if (error) {
        // Handle different error types
        const errorMessages = {
          invalid_state: 'Security validation failed. Please try again.',
          no_code: 'Authorization failed. Please try again.',
          token_error: 'Failed to authenticate. Please try again.',
          no_email: 'Email access is required. Please grant email permission.',
          oauth_error: 'Authentication failed. Please try again.'
        };
        
        toast.error(errorMessages[error] || 'Authentication failed');
        navigate('/login');
      } else {
        navigate('/login');
      }
    };

    handleCallback();
  }, [searchParams, dispatch, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-white text-lg">Completing authentication...</p>
      </div>
    </div>
  );
};

export default OAuthCallback;
