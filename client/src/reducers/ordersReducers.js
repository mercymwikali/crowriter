import { ASSIGNMENT_CREATE_FAIL, ASSIGNMENT_CREATE_REQUEST, ASSIGNMENT_CREATE_RESET, ASSIGNMENT_CREATE_SUCCESS, ASSIGNMENT_DELETE_FAIL, ASSIGNMENT_DELETE_REQUEST, ASSIGNMENT_DELETE_RESET, ASSIGNMENT_DELETE_SUCCESS, ASSIGNMENT_DETAILS_FAIL, ASSIGNMENT_DETAILS_REQUEST, ASSIGNMENT_DETAILS_RESET, ASSIGNMENT_DETAILS_SUCCESS, ASSIGNMENT_LIST_FAIL, ASSIGNMENT_LIST_REQUEST, ASSIGNMENT_LIST_RESET, ASSIGNMENT_LIST_SUCCESS, FREELANCER_ASSIGNMENT_LIST_FAIL, FREELANCER_ASSIGNMENT_LIST_REQUEST, FREELANCER_ASSIGNMENT_LIST_RESET, FREELANCER_ASSIGNMENT_LIST_SUCCESS } from "../constants/assignmenConstant";
import {
  ORDER_CANCEL_FAIL,
  ORDER_CANCEL_REQUEST,
  ORDER_CANCEL_SUCCESS,
  ORDER_CANCEL_RESET,
  ORDER_CREATE_FAIL,
  ORDER_CREATE_REQUEST,
  ORDER_CREATE_RESET,
  ORDER_CREATE_SUCCESS,
  ORDER_EDIT_FAIL,
  ORDER_EDIT_REQUEST,
  ORDER_EDIT_RESET,
  ORDER_EDIT_SUCCESS,
  ORDER_LIST_FAIL,
  ORDER_LIST_REQUEST,
  ORDER_LIST_RESET,
  ORDER_LIST_SUCCESS,
  NEW_ORDER_LIST_REQUEST,
  NEW_ORDER_LIST_SUCCESS,
  NEW_ORDER_LIST_FAIL,
  NEW_ORDER_LIST_RESET,
} from "../constants/ordersConstant";

export const orderCreateReducer = (state = {}, action) => {
  switch (action.type) {
    case ORDER_CREATE_REQUEST:
      return { loading: true };
    case ORDER_CREATE_SUCCESS:
      return { loading: false, success: true, order: action.payload };
    case ORDER_CREATE_FAIL:
      return { loading: false, error: action.payload };
    case ORDER_CREATE_RESET:
      return {};
    default:
      return state;
  }
};

export const listOrdersReducer = (state = { orders: [] }, action) => {
  switch (action.type) {
    case ORDER_LIST_REQUEST:
      return { loading: true };
    case ORDER_LIST_SUCCESS:
      return { loading: false, orders: action.payload };
    case ORDER_LIST_FAIL:
      return { loading: false, error: action.payload };
    case ORDER_LIST_RESET:
      return { orders: [] };
    default:
      return state;
  }
};
export const editJobReducer = (state = { job: {} }, action) => {
  switch (action.type) {
    case ORDER_EDIT_REQUEST:
      return { loading: true };
    case ORDER_EDIT_SUCCESS:
      return { loading: false, success: true, job: action.payload };
    case ORDER_EDIT_FAIL:
      return { loading: false, error: action.payload };
    case ORDER_EDIT_RESET:
      return { job: {} };
    default:
      return state;
  }
};

export const cancelJobReducer = (state = {}, action) => {
  switch (action.type) {
    case ORDER_CANCEL_REQUEST:
      return { loading: true };
    case ORDER_CANCEL_SUCCESS:
      return { loading: false, success: true, job: action.payload };
    case ORDER_CANCEL_FAIL:
      return { loading: false, error: action.payload };
    case ORDER_CANCEL_RESET:
      return { job: {} };
    default:
      return state;
  }
};


export const newOrdersListReducer = (state = { orders: [] }, action) => {
  switch (action.type) {
    case NEW_ORDER_LIST_REQUEST:
      return { loading: true };
    case NEW_ORDER_LIST_SUCCESS:
      return { loading: false, orders: action.payload };
    case NEW_ORDER_LIST_FAIL:
      return { loading: false, error: action.payload };
    case NEW_ORDER_LIST_RESET:
      return { orders: [] };
    default:
      return state;
  }
}

export const assignOrderReducer = (state = {}, action) => {
  switch (action.type) {
    case ASSIGNMENT_CREATE_REQUEST:
      return { loading: true };
    case ASSIGNMENT_CREATE_SUCCESS:
      return { loading: false, success: true, order: action.payload };
    case ASSIGNMENT_CREATE_FAIL:
      return { loading: false, error: action.payload };
    case ASSIGNMENT_CREATE_RESET:
    default:
      return state;
  }
};

export const assignmentListReducer = (state = { orders: [] }, action) => {
  switch (action.type) {
    case ASSIGNMENT_LIST_REQUEST:
      return { loading: true };
    case ASSIGNMENT_LIST_SUCCESS:
      return { loading: false, orders: action.payload };
    case ASSIGNMENT_LIST_FAIL:
      return { loading: false, error: action.payload };
    case ASSIGNMENT_LIST_RESET:
      return { orders: [] };
    default:
      return state;
  }
};

export const freelancerAssignmentsReducer = (state = { orders: [] }, action) => {
  switch (action.type) {
    case FREELANCER_ASSIGNMENT_LIST_REQUEST:
      return { loading: true };
    case FREELANCER_ASSIGNMENT_LIST_SUCCESS:
      return { loading: false, orders: action.payload };
    case FREELANCER_ASSIGNMENT_LIST_FAIL:
      return { loading: false, error: action.payload };
    case FREELANCER_ASSIGNMENT_LIST_RESET:
      return { orders: [] };
    default:
      return state;
  }
}

export const extendDeadlineReducer = (state = {}, action) => {
  switch (action.type) {
    case ASSIGNMENT_DETAILS_REQUEST:
      return { loading: true };
    case ASSIGNMENT_DETAILS_SUCCESS:
      return { loading: false, success: true, order: action.payload };
    case ASSIGNMENT_DETAILS_FAIL:
      return { loading: false, error: action.payload };
    case ASSIGNMENT_DETAILS_RESET:
      return { order: {} };
    default:
      return state;
  }
};

export const reassignReducer = (state = {}, action) => {
  switch (action.type) {
    case ASSIGNMENT_DETAILS_REQUEST:
      return { loading: true };
    case ASSIGNMENT_DETAILS_SUCCESS:
      return { loading: false, success: true, order: action.payload };
    case ASSIGNMENT_DETAILS_FAIL:
      return { loading: false, error: action.payload };
    case ASSIGNMENT_DETAILS_RESET:
      return { order: {} };
    default:
      return state;
  }
};

 export const deleteAssignmentReducer = (state = {}, action) => {
   switch (action.type) {
     case ASSIGNMENT_DELETE_REQUEST:
       return { loading: true };
     case ASSIGNMENT_DELETE_SUCCESS:
       return { loading: false, success: true };
     case ASSIGNMENT_DELETE_FAIL:
       return { loading: false, error: action.payload };
     case ASSIGNMENT_DELETE_RESET:
       return {};
     default:
       return state;
   }
 }
