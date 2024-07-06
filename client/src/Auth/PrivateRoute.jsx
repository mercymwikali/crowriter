import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {jwtDecode} from 'jwt-decode';

const PrivateRoute = ({ allowedRoles }) => {
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  if (!userInfo) {
    return <Navigate to="/" />;
  }

  try {
    const decoded = jwtDecode(userInfo.accessToken);
    const userRoles = decoded.user?.role;

    if (allowedRoles.includes(userRoles)) {
      return <Outlet />;
    } else {
      return <Navigate to="/" />;
    }
  } catch (error) {
    console.error("Failed to decode token:", error);
    return <Navigate to="/" />;
  }
};

export default PrivateRoute;
