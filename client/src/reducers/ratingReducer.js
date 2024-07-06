import { REVIEW_CREATE_REQUEST, REVIEW_CREATE_RESET, REVIEW_CREATE_SUCCESS } from "../constants/reviewConstants";

export const rateFreelancer = (state = {}, action) => {
  switch (action.type) {
    case REVIEW_CREATE_REQUEST:
      return { loading: true };
    case REVIEW_CREATE_SUCCESS:
      return { loading: false, success: true };
    case REVIEW_CREATE_REQUEST:
      return { loading: false, error: action.payload };
    case REVIEW_CREATE_RESET:
      return {};
    default:
      return state;
  }
};
