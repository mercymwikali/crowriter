import { 
    USER_LOGIN_FAIL, 
    USER_LOGIN_REQUEST, 
    USER_LOGIN_SUCCESS, 
    USER_LOGOUT, 
    USER_UPDATE_REQUEST, 
    USER_UPDATE_SUCCESS, 
    USER_UPDATE_FAIL, 
    FREELANCERS_LIST_REQUEST, 
    FREELANCERS_LIST_SUCCESS, 
    FREELANCERS_LIST_FAIL, 
    MANAGERS_LIST_REQUEST, 
    MANAGERS_LIST_SUCCESS, 
    MANAGERS_LIST_FAIL, 
    MANAGERS_LIST_RESET, 
    FREELANCER_DETAILS_REQUEST,
    FREELANCER_DETAILS_SUCCESS,
    FREELANCER_DETAILS_FAIL,
    FREELANCER_DETAILS_RESET,
    MANAGER_DETAILS_REQUEST,
    MANAGER_DETAILS_SUCCESS,
    MANAGER_DETAILS_FAIL,
    MANAGER_DETAILS_RESET,
    USER_REGISTER_REQUEST,
    USER_REGISTER_SUCCESS,
    USER_REGISTER_FAIL
} from "../constants/userConstants";

export const userLoginReducer = (state = {}, action) => {
    switch (action.type) {
        case USER_LOGIN_REQUEST:
            return { loading: true };
        case USER_LOGIN_SUCCESS:
            return { loading: false, userInfo: action.payload };
        case USER_LOGIN_FAIL:
            return { loading: false, error: action.payload };
        case USER_LOGOUT:
            return {};
        default:
            return state;
    }
};

export const userRegisterReducer = (state = {}, action) => {
    switch (action.type) {
        case USER_REGISTER_REQUEST:
            return { loading: true };
        case USER_REGISTER_SUCCESS:
            return { loading: false, userInfo: action.payload };
        case USER_REGISTER_FAIL:
            return { loading: false, error: action.payload };
        case USER_LOGOUT:
            return {};
        default:
            return state;
    }
}

export const userUpdateReducer = (state = {}, action) => {
    switch (action.type) {
        case USER_UPDATE_REQUEST:
            return { loading: true };
        case USER_UPDATE_SUCCESS:
            return { loading: false, success: true, userInfo: action.payload };
        case USER_UPDATE_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
};

export const freelancersListReducer = (state = { freelancers: [] }, action) => {
    switch (action.type) {
        case FREELANCERS_LIST_REQUEST:
            return { loading: true, freelancers: [] };
        case FREELANCERS_LIST_SUCCESS:
            return { loading: false, freelancers: action.payload };
        case FREELANCERS_LIST_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
};

export const managersListReducer = (state = { managers: [] }, action) => {
    switch (action.type) {
        case MANAGERS_LIST_REQUEST:
            return { loading: true, managers: [] };
        case MANAGERS_LIST_SUCCESS:
            return { loading: false, managers: action.payload };
        case MANAGERS_LIST_FAIL:
            return { loading: false, error: action.payload };
        case MANAGERS_LIST_RESET:
            return { managers: [] };
        default:
            return state;
    }
};


export const managerDetailsReducer= (state = { manager: {} }, action) => {
    switch (action.type) {
        case MANAGER_DETAILS_REQUEST:
            return { loading: true, manager: {} };
        case MANAGER_DETAILS_SUCCESS:
            return { loading: false, manager: action.payload };
        case MANAGER_DETAILS_FAIL:
            return { loading: false, error: action.payload };
            case MANAGER_DETAILS_RESET:
                return { manager: {} };
        default:
            return state;
    }
}

export const freelancerDetailsReducer= (state = { freelancer: {} }, action) => {
    switch (action.type) {
        case FREELANCER_DETAILS_REQUEST:
            return { loading: true, freelancer: {} };
        case FREELANCER_DETAILS_SUCCESS:
            return { loading: false, freelancer: action.payload };
        case FREELANCER_DETAILS_FAIL:
            return { loading: false, error: action.payload };
            case FREELANCER_DETAILS_RESET:
                return { freelancer: {} };
        default:
            return state;
    }
}