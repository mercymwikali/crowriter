import axios from "axios";
import { API_URL as API } from "../config";
import {
  FREELANCERS_LIST_FAIL,
  FREELANCERS_LIST_REQUEST,
  FREELANCERS_LIST_SUCCESS,
  MANAGERS_LIST_FAIL,
  MANAGERS_LIST_REQUEST,
  MANAGERS_LIST_RESET,
  MANAGERS_LIST_SUCCESS,
  USER_LOGIN_FAIL,
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGOUT,
  USER_UPDATE_REQUEST,
  USER_UPDATE_SUCCESS,
  USER_UPDATE_FAIL,
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
  USER_REGISTER_FAIL,
} from "../constants/userConstants";
import { message } from "antd";

export const login = (email, password) => async (dispatch) => {
  try {
    dispatch({ type: USER_LOGIN_REQUEST });
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    };
    const { data } = await axios.post(
      `${API}auth/login`,
      { email, password },
      config
    );

    dispatch({ type: USER_LOGIN_SUCCESS, payload: data });
    localStorage.setItem('userInfo', JSON.stringify(data)); // This persists the token
    console.log(data);
  } catch (error) {
    const errorMessage =
      error.response && error.response.data && error.response.data.message
        ? error.response.data.message
        : error.message;

    dispatch({ type: USER_LOGIN_FAIL, payload: errorMessage });
  }
};

export const logout = (userId) => (dispatch, getState) => {
  try {
    const {userLogin: {userInfo}} = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.accessToken}`,
      },
      withCredentials: true,
    };
    axios.post(`${API}auth/logout`, {userId}, config);
    localStorage.removeItem("userInfo");
    dispatch({ type: USER_LOGOUT });
    console.log("logged out");
  } catch (error) {
    const errorMessage =
      error.response && error.response.data && error.response.data.message
        ? error.response.data.message
        : error.message;

    console.log(error);
  }
};
export const register = (userData) => async (dispatch) => {
  try {
    dispatch({ type: USER_REGISTER_REQUEST });
    console.log('Dispatch USER_REGISTER_REQUEST');

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    };

    const { data } = await axios.post(`${API}auth/register`, userData, config);

    dispatch({ type: USER_REGISTER_SUCCESS, payload: data });
    console.log('Dispatch USER_REGISTER_SUCCESS', data);
    message.success(data.message, 5);

    localStorage.setItem('userInfo', JSON.stringify(data)); // This persists the token

    return data.userId; // Return the user ID
  } catch (error) {
    const errorMessage =
      error.response && error.response.data && error.response.data.message
        ? error.response.data.message
        : error.message;

    dispatch({ type: USER_REGISTER_FAIL, payload: errorMessage });
    console.log('Dispatch USER_REGISTER_FAIL', errorMessage);

    message.error(error.response.data.message, 5);
  }
};

export const freelancerList = () => async (dispatch, getState) => {
  try {
    dispatch({ type: FREELANCERS_LIST_REQUEST });
    const { userLogin: { userInfo } } = getState();
    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.accessToken}`,
      },
      withCredentials: true,
    };
    const { data } = await axios.get(`${API}users/freelancers`, config);
    console.log(data);
    dispatch({ type: FREELANCERS_LIST_SUCCESS, payload: data });
  } catch (error) {
    console.log(error);
    dispatch({ type: FREELANCERS_LIST_FAIL, payload: error.message });
    message.error(error.response.data.message, 5);
  }
};

export const managersList= () => async (dispatch, getState) => {
  try {
    dispatch({ type: MANAGERS_LIST_REQUEST });
    const { userLogin: { userInfo } } = getState();
    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.accessToken}`,
      },
      withCredentials: true,
    };
    const { data } = await axios.get(`${API}users/managers`, config);
    console.log(data);
    dispatch({ type: MANAGERS_LIST_SUCCESS, payload: data });
  } catch (error) {
    console.log(error);
    dispatch({ type: MANAGERS_LIST_FAIL, payload: error.message });
    message.error(error.response.data.message, 5);
    dispatch({ type: MANAGERS_LIST_RESET });
  }
};

export const getFreelancerDetails = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: FREELANCERS_LIST_REQUEST });
    const { userLogin: { userInfo } } = getState();
    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.accessToken}`,
      },
      withCredentials: true,
    };
    const { data } = await axios.get(`${API}users/freelancers/${id}`, config);
    console.log(data);
    dispatch({ type: FREELANCERS_LIST_SUCCESS, payload: data });
  } catch (error) {
    console.log(error);
    dispatch({ type: FREELANCERS_LIST_FAIL, payload: error.message });
    message.error(error.response.data.message, 5);
  }
};

export const getManagerDetails = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: MANAGERS_LIST_REQUEST });
    const { userLogin: { userInfo } } = getState();
    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.accessToken}`,
      },
      withCredentials: true,
    };
    const { data } = await axios.get(`${API}users/managers/${id}`, config);
    console.log(data);
    dispatch({ type: MANAGERS_LIST_SUCCESS, payload: data });
    
  } catch (error) {
    console.log(error);
    dispatch({ type: MANAGERS_LIST_FAIL, payload: error.message });
    message.error(error.response.data.message, 5);
  }
};

export const updateProfile = (id, user) => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_UPDATE_REQUEST });
    const { userLogin: { userInfo } } = getState();
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.accessToken}`,
      },
      withCredentials: true,
    };
    const { data } = await axios.patch(`${API}users/profile/${id}`, user, config);
    console.log(data);
    dispatch({ type: USER_UPDATE_SUCCESS, payload: data });

    localStorage.setItem("userInfo", JSON.stringify(data));

    message.success(data.message, 5);
  } catch (error) {
    dispatch({ type: USER_UPDATE_FAIL, payload: error.message });
    const errorMessage =
      error.response && error.response.data && error.response.data.message
        ? error.response.data.message
        : error.message;

    console.log(error);
  }
};
