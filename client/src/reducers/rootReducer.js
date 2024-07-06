import { combineReducers } from "@reduxjs/toolkit";
import { freelancerDetailsReducer, freelancersListReducer, managerDetailsReducer, managersListReducer, userLoginReducer, userRegisterReducer, userUpdateReducer } from "./userReducer";
import {
  assignOrderReducer,
  assignmentListReducer,
  cancelJobReducer,
  deleteAssignmentReducer,
  editJobReducer,
  extendDeadlineReducer,
  freelancerAssignmentsReducer,
  listOrdersReducer,
  newOrdersListReducer,
  orderCreateReducer,
  reassignReducer,
} from "./ordersReducers";
import {
  bidDeleteReducer,
  bidReducer,
  bidsListReducer,
  freelancerBidsReducer,
} from "./bidReducer";
import {
  deleteSubmissionReducer,
  downloadSubmissionReducer,
  listSubmissionByfreelancerReducer,
  listSubmissionReducer,
} from "./submissionReducer";
import { rateFreelancer } from "./ratingReducer";
import {
  deleteFineReducer,
  fineOrderReducer,
  finesListByWriterReducer,
  finesListReducer,
  updateFineReducer,
} from "./finesReducer";

import {
    invoiceListReducer,
    invoiceDetailsReducer,
    invoiceCreateReducer,
    invoiceUpdateReducer,
    invoiceDeleteReducer,
  } from './invoiceReducer';
import { paymentDetailsReducer, paymentListReducer, paymentPostingReducer } from "./paymentReducers";
import { downloadFileReducer } from "./fileUploads";

export const rootReducer = combineReducers({
  userLogin: userLoginReducer,
  addUser:userRegisterReducer,
  createOrder: orderCreateReducer,
  listOrders: listOrdersReducer,
  updateOrder: editJobReducer,
  cancelOrder: cancelJobReducer,
  createBid: bidReducer,
  freelancerBids: freelancerBidsReducer,
  bidsList: bidsListReducer,
  deleteBid: bidDeleteReducer,
  assignOrder: assignOrderReducer,
  assignmentList: assignmentListReducer,
  freelancerAssignments: freelancerAssignmentsReducer,
  newOrders: newOrdersListReducer,
  extendDeadline: extendDeadlineReducer,
  reassign: reassignReducer,
  deleteAssignment: deleteAssignmentReducer,
  submissionList: listSubmissionReducer,
  freelancerSubList: listSubmissionByfreelancerReducer,
  downloadSub: downloadSubmissionReducer,
  deleteSub: deleteSubmissionReducer,
  review: rateFreelancer,
  fineOrder: fineOrderReducer,
  fines: finesListReducer,
  freelancerFines: finesListByWriterReducer,
  editFine: updateFineReducer,
  deleteFine: deleteFineReducer,
  invoiceList: invoiceListReducer,
  invoiceDetails: invoiceDetailsReducer,
  invoiceCreate: invoiceCreateReducer,
  invoiceUpdate: invoiceUpdateReducer,
  invoiceDelete: invoiceDeleteReducer,
  postPayment:paymentPostingReducer,
  paymentList:paymentListReducer,
  paymentDetails:paymentDetailsReducer, 
  downloadFile:downloadFileReducer,
  freelancersList:freelancersListReducer,
  managersList:managersListReducer,
  profileUpdate:userUpdateReducer,
  managerProfile:managerDetailsReducer,
  freelancerProfile:freelancerDetailsReducer



});
