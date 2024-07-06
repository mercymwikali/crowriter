import axios from "axios";
import { API_URL as API } from "../config";

import {
  INVOICE_LIST_REQUEST,
  INVOICE_LIST_SUCCESS,
  INVOICE_LIST_FAIL,
  INVOICE_DETAILS_REQUEST,
  INVOICE_DETAILS_SUCCESS,
  INVOICE_DETAILS_FAIL,
  INVOICE_CREATE_REQUEST,
  INVOICE_CREATE_SUCCESS,
  INVOICE_CREATE_FAIL,
  INVOICE_UPDATE_REQUEST,
  INVOICE_UPDATE_SUCCESS,
  INVOICE_UPDATE_FAIL,
  INVOICE_DELETE_REQUEST,
  INVOICE_DELETE_SUCCESS,
  INVOICE_DELETE_FAIL,
} from "../constants/invoiceConstants";
import { message } from "antd";

export const listInvoices = () => async (dispatch, getState) => {
  try {
    dispatch({ type: INVOICE_LIST_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };
    const { data } = await axios.get(`${API}invoice/list`, config);
    dispatch({ type: INVOICE_LIST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: INVOICE_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const getInvoiceDetails = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: INVOICE_DETAILS_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    // const { data } = await axios.get(`/api/invoices/${id}`);

    const { data } = await axios.get(`${API}invoice/user/${id}`, config); 

console.log(data);

    dispatch({ type: INVOICE_DETAILS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: INVOICE_DETAILS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const createInvoice = (invoice) => async (dispatch, getState) => {
  try {
    dispatch({ type: INVOICE_CREATE_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.post(`${API}invoice/create`, invoice, config); // Ensure correct parameter order
    dispatch({ type: INVOICE_CREATE_SUCCESS, payload: data });

    message.success(data.message, 5);
  } catch (error) {
    dispatch({
      type: INVOICE_CREATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });

    message.error(
      error.response && error.response.data.error
        ? error.response.data.error
        : error.message,
      5
    ); 
  
  }
};

export const updateInvoice = (invoice) => async (dispatch) => {
  try {
    dispatch({ type: INVOICE_UPDATE_REQUEST });
    const { data } = await axios.put(`/api/invoices/${invoice.id}`, invoice);
    dispatch({ type: INVOICE_UPDATE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: INVOICE_UPDATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const deleteInvoice = (id) => async (dispatch) => {
  try {
    dispatch({ type: INVOICE_DELETE_REQUEST });
    await axios.delete(`/api/invoices/${id}`);
    dispatch({ type: INVOICE_DELETE_SUCCESS });
  } catch (error) {
    dispatch({
      type: INVOICE_DELETE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
