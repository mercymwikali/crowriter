import { BIDS_LIST_FAIL, BIDS_LIST_REQUEST, BIDS_LIST_RESET, BIDS_LIST_SUCCESS, BID_CREATE_FAIL, BID_CREATE_REQUEST, BID_CREATE_SUCCESS, BID_DELETE_FAIL, BID_DELETE_SUCCESS, BID_DETAILS_USER_FAIL, BID_DETAILS_USER_REQUEST, BID_DETAILS_USER_SUCCESS } from "../constants/bidsConstant";

export const bidReducer = (state = {}, action) => {
    switch (action.type) {
        case BID_CREATE_REQUEST:
            return { loading: true };
        case BID_CREATE_SUCCESS:
            return { loading: false, success: true, bid: action.payload };
        case BID_CREATE_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
}


export const freelancerBidsReducer = (state = { bids: [] }, action) => {
    switch (action.type) {
        case BID_DETAILS_USER_REQUEST:
            return { loading: true };
        case BID_DETAILS_USER_SUCCESS:
            return { loading: false, success: true, bids: action.payload };
        case BID_DETAILS_USER_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
}


export const bidsListReducer = (state = { bids: [] }, action) => {
    switch (action.type) {
        case BIDS_LIST_REQUEST:
            return { loading: true };
        case BIDS_LIST_SUCCESS:
            return { loading: false, bids: action.payload };
        case BIDS_LIST_FAIL:
            return { loading: false, error: action.payload };
            case BIDS_LIST_RESET:
                return { bids: [] };
        default:
            return state;
    }
}

export const bidDeleteReducer = (state = {}, action) => {
    switch (action.type) {
        case BID_DELETE_FAIL:
            return { loading: true };
        case BID_DELETE_SUCCESS:
            return { loading: false, success: true };
        case BID_DELETE_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
}
