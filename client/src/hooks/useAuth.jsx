import { useSelector } from 'react-redux';
import {jwtDecode} from 'jwt-decode';

const useAuth = () => {
  // Select user information from Redux store
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  // Decode the JWT token if user information is available
  const decodedUserInfo = userInfo ? jwtDecode(userInfo.accessToken) : null;

  return decodedUserInfo; // Return the decoded user information
};

export default useAuth;
