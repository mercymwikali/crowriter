import { FINES_LIST_FAIL, FINES_LIST_REQUEST, FINES_LIST_RESET, FINES_LIST_SUCCESS, FINE_CREATE_FAIL, FINE_CREATE_REQUEST, FINE_CREATE_SUCCESS, FINE_DELETE_FAIL, FINE_DELETE_REQUEST, FINE_DELETE_SUCCESS, FINE_UPDATE_FAIL, FINE_UPDATE_REQUEST, FINE_UPDATE_SUCCESS, WRITER_FINES_LIST_FAIL, WRITER_FINES_LIST_REQUEST, WRITER_FINES_LIST_RESET, WRITER_FINES_LIST_SUCCESS } from "../constants/fines"

export const fineOrderReducer = (state = {}, action) => {
    switch (action.type) {
        case FINE_CREATE_REQUEST:
            return { loading: true }
        case FINE_CREATE_SUCCESS:
            return { loading: false, fine: action.payload }
        case FINE_CREATE_FAIL:
            return { loading: false, error: action.payload }
        default:
            return state
    }
}


export const finesListReducer= (state = {fines:[]}, action) => {
    switch (action.type) {
        case FINES_LIST_REQUEST:
            return { loading: true }
        case FINES_LIST_SUCCESS:
            return { loading: false, fines: action.payload }
        case FINES_LIST_FAIL:
            return { loading: false, error: action.payload }
            case FINES_LIST_RESET:
                return {fines:[]}
        default:
            return state
    }
}


export const finesListByWriterReducer = (state = {fines:[]}, action) => {
    switch (action.type) {
        case WRITER_FINES_LIST_REQUEST:
            return { loading: true }
        case WRITER_FINES_LIST_SUCCESS:
            return { loading: false, fines: action.payload }
        case WRITER_FINES_LIST_FAIL:
            return { loading: false, error: action.payload }
            case WRITER_FINES_LIST_RESET:
                return {fines:[]}
        default:
            return state
    }
}

export const updateFineReducer = (state = {}, action) => {
    switch (action.type) {
        case FINE_UPDATE_REQUEST:
            return { loading: true }
        case FINE_UPDATE_SUCCESS:
            return { loading: false, fine: action.payload }
        case FINE_UPDATE_FAIL:
            return { loading: false, error: action.payload }
        default:
            return state
    }
}

export const deleteFineReducer = (state = {}, action) => {
    switch (action.type) {
        case FINE_DELETE_REQUEST:
            return { loading: true }
        case FINE_DELETE_SUCCESS:
            return { loading: false, fine: action.payload }
        case FINE_DELETE_FAIL:
            return { loading: false, error: action.payload }
        default:
            return state
    }
}