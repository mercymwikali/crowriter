import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import { login } from '../actions/userActions';

const useSignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const loginHandler = useSelector((state) => state.userLogin);
  const { loading, error, userInfo } = loginHandler;

  const handleLogin = () => {
    dispatch(login(email, password));
  };

  useEffect(() => {
    if (userInfo && userInfo.accessToken) {
      try {
        const decoded = jwtDecode(userInfo.accessToken);
        const roles = decoded.user?.role;

        if (roles) {
          switch (roles) { // Assuming roles is a string
            case "FREELANCER":
              navigate('/freelancer');
              break;
            case "MANAGER":
              navigate('/manager');
              break;
            case "ADMIN":
              navigate('/admin');
              break;
            default:
              navigate('/login'); // Redirect to login or a default page if role is not recognized
              break;
          }
        } else {
          navigate('/login'); // Handle case where roles are not defined
        }
      } catch (error) {
        console.error("Failed to decode token:", error);
        navigate('/login'); // Redirect to login if decoding fails
      }
    }
  }, [userInfo, navigate]);

  return {
    email,
    setEmail,
    password,
    setPassword,
    handleLogin,
    loading,
    error,
  };
};

export default useSignIn;
