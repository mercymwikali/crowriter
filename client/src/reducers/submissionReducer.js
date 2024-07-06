import { DELETE_SUBMISSION_FAIL, DELETE_SUBMISSION_REQUEST, DELETE_SUBMISSION_RESET, DELETE_SUBMISSION_SUCCESS, DOWNLOAD_SUBMISSION_FAIL, DOWNLOAD_SUBMISSION_REQUEST, DOWNLOAD_SUBMISSION_RESET, DOWNLOAD_SUBMISSION_SUCCESS, SUBMISSION_LIST_FAIL, SUBMISSION_LIST_FAIL_BY_FREELANCER, SUBMISSION_LIST_REQUEST, SUBMISSION_LIST_REQUEST_BY_FREELANCER, SUBMISSION_LIST_RESET, SUBMISSION_LIST_RESET_BY_FREELANCER, SUBMISSION_LIST_SUCCESS, SUBMISSION_LIST_SUCCESS_BY_FREELANCER } from "../constants/submissionConstants";

export const listSubmissionReducer = (state = { submissions: [] }, action) => {
    switch (action.type) {
        case SUBMISSION_LIST_REQUEST:
            return { loading: true };
        case SUBMISSION_LIST_SUCCESS:
            return { loading: false, submissions: action.payload };
        case SUBMISSION_LIST_FAIL:
            return { loading: false, error: action.payload };
            case SUBMISSION_LIST_RESET:
                return { submissions: [] };
        default:
            return state;
    }
}

export const listSubmissionByfreelancerReducer = (state = { submissions: [] }, action) => {
    switch (action.type) {
        case SUBMISSION_LIST_REQUEST_BY_FREELANCER:
            return { loading: true };
        case SUBMISSION_LIST_SUCCESS_BY_FREELANCER:
            return { loading: false, submissions: action.payload };
        case SUBMISSION_LIST_FAIL_BY_FREELANCER:
            return { loading: false, error: action.payload };
            case SUBMISSION_LIST_RESET_BY_FREELANCER:
                return { submissions: [] };
        default:
            return state;
    }
}

export const  downloadSubmissionReducer = (state = {}, action) => {
    switch (action.type) {
        case DOWNLOAD_SUBMISSION_REQUEST:
            return { loading: true };
        case DOWNLOAD_SUBMISSION_SUCCESS:
            return { loading: false, success: true };
        case DOWNLOAD_SUBMISSION_FAIL:
            return { loading: false, error: action.payload };
            case DOWNLOAD_SUBMISSION_RESET:
                return {submissions: []};
        default:
            return state;
    }
}

export const deleteSubmissionReducer = (state = {}, action) => {
    switch (action.type) {
        case DELETE_SUBMISSION_REQUEST:
            return { loading: true };
        case DELETE_SUBMISSION_SUCCESS:
            return { loading: false, success: true };
        case DELETE_SUBMISSION_FAIL:
            return { loading: false, error: action.payload };
            case DELETE_SUBMISSION_RESET:
                return {submissions: []};
        default:
            return state;
    }
}