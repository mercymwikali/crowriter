import { PAYMENT_CREATE_FAIL, PAYMENT_CREATE_REQUEST, PAYMENT_CREATE_RESET, PAYMENT_CREATE_SUCCESS, PAYMENT_DETAILS_FAIL, PAYMENT_DETAILS_REQUEST, PAYMENT_DETAILS_RESET, PAYMENT_DETAILS_SUCCESS, PAYMENT_LIST_FAIL, PAYMENT_LIST_REQUEST, PAYMENT_LIST_RESET, PAYMENT_LIST_SUCCESS } from "../constants/paymentConstants";

export const  paymentPostingReducer = (state = {}, action) => {
    switch (action.type) {
        case PAYMENT_CREATE_REQUEST:
            return { loading: true };
        case PAYMENT_CREATE_SUCCESS:
            return { loading: false, success: true };
        case PAYMENT_CREATE_FAIL:
            return { loading: false, error: action.payload };
        case PAYMENT_CREATE_RESET:
            return {};
        default:
            return state;
    }
}

export const paymentListReducer = (state = { payments: [] }, action) => {
    switch (action.type) {
        case PAYMENT_LIST_REQUEST:
            return { loading: true, payments: [] };
        case PAYMENT_LIST_SUCCESS:
            return { loading: false, payments: action.payload };
        case PAYMENT_LIST_FAIL:
            return { loading: false, error: action.payload };
        case PAYMENT_LIST_RESET:
            return { payments: [] };
        default:
            return state;
    }
}

export const paymentDetailsReducer = (state = { payment: {} }, action) => {
    switch (action.type) {
        case PAYMENT_DETAILS_REQUEST:
            return { loading: true };
        case PAYMENT_DETAILS_SUCCESS:
            return { loading: false, payment: action.payload };
        case PAYMENT_DETAILS_FAIL:
            return { loading: false, error: action.payload };
        case PAYMENT_DETAILS_RESET:
            return { payment: {} };
        default:
            return state;
    }
}