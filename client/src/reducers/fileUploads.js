import { DOWNLOAD_FILE_FAIL, DOWNLOAD_FILE_REQUEST, DOWNLOAD_FILE_RESET, DOWNLOAD_FILE_SUCCESS } from "../constants/FileUpload";

export const downloadFileReducer = (state = {}, action) => {
    switch (action.type) {
        case DOWNLOAD_FILE_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case DOWNLOAD_FILE_SUCCESS:
            return {
                ...state,
                loading: false,
                success: true,
            };
        case DOWNLOAD_FILE_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        case DOWNLOAD_FILE_RESET:
            return {};
        default:
            return state;
    }
}