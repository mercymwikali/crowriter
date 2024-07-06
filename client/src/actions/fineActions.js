import axios from "axios";
import { API_URL as API } from "../config";
import { FINES_LIST_FAIL, FINES_LIST_REQUEST, FINES_LIST_RESET, FINES_LIST_SUCCESS, FINE_CREATE_FAIL, FINE_CREATE_REQUEST, FINE_CREATE_SUCCESS, FINE_DELETE_FAIL, FINE_DELETE_REQUEST, FINE_DELETE_SUCCESS, FINE_UPDATE_FAIL, FINE_UPDATE_REQUEST, FINE_UPDATE_RESET, FINE_UPDATE_SUCCESS, WRITER_FINES_LIST_FAIL, WRITER_FINES_LIST_REQUEST, WRITER_FINES_LIST_RESET, WRITER_FINES_LIST_SUCCESS } from "../constants/fines";
import { message } from "antd";

export const fineOrder = (payload) => async (dispatch, getState) => {
  try {
    dispatch({ type: FINE_CREATE_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.accessToken}`,
      },
    };

    const { data } = await axios.post(`${API}fines/create`, payload, config);

    dispatch({ type:FINE_CREATE_SUCCESS, payload: data });
    message.success(data.message, 5);

  } catch (error) {
    console.log(error);
    dispatch({
      type:FINE_CREATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });

    message.error(error.response.data.message, 5);

  }
};

export const freelancerFines = (userId) => async (dispatch, getState) => {
  try {
    dispatch({ type: WRITER_FINES_LIST_REQUEST });

    const { 
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.accessToken}`,
      },
    };

    const { data } = await axios.get(`${API}fines/user/${userId}`, config);

    dispatch({ type: WRITER_FINES_LIST_SUCCESS, payload: data });

  } catch (error) {
    dispatch({
      type:WRITER_FINES_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });

    message.error(error.response.data.message, 5);

    dispatch({ type:WRITER_FINES_LIST_RESET });
  }
};


export const finesList= () => async (dispatch, getState) => {
  try {
    dispatch({ type: FINES_LIST_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.accessToken}`,
      },
    };

    const { data } = await axios.get(`${API}fines/list`, config);

    dispatch({ type: FINES_LIST_SUCCESS, payload: data });

  } catch (error) {
    dispatch({
      type: FINES_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }

  message.error(error.response.data.message, 5);

  dispatch({ type:FINES_LIST_RESET });

};

export const updateFine = (fineId, payload) => async (dispatch, getState) => {
  try {
    dispatch({ type: FINE_UPDATE_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.accessToken}`,
      },
    };

    const { data } = await axios.patch(`${API}fines/update/${fineId}`, payload, config);

    dispatch({ type: FINE_UPDATE_SUCCESS, payload: data });

    message.success(data.message, 5);



  } catch (error) {
    dispatch({
      type: FINE_UPDATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });


    dispatch({ type:FINE_UPDATE_RESET });
  }

};

export const deleteFine = (fineId) => async (dispatch, getState) => {
  try {
    dispatch({ type: FINE_DELETE_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.accessToken}`,
      },
    };

    const { data } = await axios.delete(`${API}fines/delete/${fineId}`, config);

    dispatch({ type:FINE_DELETE_SUCCESS, payload: data }); 
    message.success(data.message, 5);

  } catch (error) {
    dispatch({
      type:FINE_DELETE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });

    message.error(error.response.data.message, 5);

    // dispatch({ type:FINE_UPDATE_RESET });

  }

};
