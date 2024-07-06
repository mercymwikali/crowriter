import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import SignIn from './Auth/SignIn';
import SignUp from './Auth/SignUp';
import SelectProfile from './Auth/SelectProfile';
import Freelancer from './Auth/Freelancer';
import Manager from './Auth/Manager';
import PrivateRoute from './Auth/PrivateRoute';
import { ROLES } from './config/role';

import ManagerLayout from './core/ManagerLayout';
import ManagerDashboard from './pages/ManagerDashboard';
import PostJob from './pages/PostJob';
import AllJobs from './pages/AllJobs';
import Bids from './pages/Bids';
import SubmittedJobs from './pages/SubmittedJobs';
import HiredWriters from './pages/HiredWriters';
import ViewInvoices from './pages/ViewInvoices';
import PaidInvoices from './pages/PaidInvoices';
import FinedOrdersList from './pages/FinedOrdersList';
import Freelancers from './pages/Freelancers';
import PendingWriters from './pages/PendingWriters';

import AdminLayout from './core/AdminLayout';
import NewManager from './pages/NewManager';
import ListManagers from './pages/ListManagers';
import ListPendingManagers from './pages/ListManagers';
import Notification from './pages/Notification';

import FreelancerLayout from './core/FreelancerLayout';
import AvailableJobs from './pages/AvailableJobs';
import MyBids from './pages/MyBids';
import MyAssignment from './pages/MyAssignment';
import CompletedJobs from './pages/CompletedJobs';
import Invoice from './pages/Invoice';
import MyFines from './pages/MyFines';
import MyPaidInv from './pages/MyPaidInv';
import MyPendingInv from './pages/MyPendingInv';
import FreelancerDashboard from './pages/FreelancerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Home from './core/Home';
import UserProfile from './Auth/UserProfile'; // Ensure correct path to UserProfile

const DashboardRedirect = ({ userRole }) => {
  switch (userRole) {
    case ROLES.Admin:
      return <Navigate to="/admin" />;
    case ROLES.Manager:
      return <Navigate to="/manager" />;
    case ROLES.Freelancer:
      return <Navigate to="/freelancer" />;
    default:
      return <Navigate to="/" />;
  }
};

function App() {
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/selectprofile" element={<SelectProfile />} />
      <Route path="/freelance-profile" element={<Freelancer />} />
      <Route path="/manager-profile" element={<Manager />} />

      <Route element={<PrivateRoute allowedRoles={[ROLES.Admin, ROLES.Manager, ROLES.Freelancer]} />}>
        <Route path="/dashboard" element={<DashboardRedirect userRole={userInfo?.role} />} />

        <Route path="manager/*" element={<ManagerLayout />}>
          <Route index element={<ManagerDashboard />} />
          <Route path="create-order" element={<PostJob />} />
          <Route path="manage-jobs/all-jobs" element={<AllJobs />} />
          <Route path="manage-jobs/bids-list" element={<Bids />} />
          <Route path="manage-jobs/submitted-jobs" element={<SubmittedJobs />} />
          <Route path="manage-jobs/assigned-jobs" element={<HiredWriters />} />
          <Route path="payments/unpaid-orders" element={<ViewInvoices />} />
          <Route path="payments/paid-orders" element={<PaidInvoices />} />
          <Route path="fines/fined-orders" element={<FinedOrdersList />} />
          <Route path="manage-freelancers/freelancers-list" element={<Freelancers />} />
          <Route path="manage-freelancers/pending-freelancers" element={<PendingWriters />} />
          <Route path="notification" element={<Notification />} />
          <Route path="user-profile" element={<UserProfile user={userInfo} />} /> {/* Pass user info */}
        </Route>

        <Route path="admin/*" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="manage-jobs/all-jobs" element={<AllJobs />} />
          <Route path="manage-users/new-manager" element={<NewManager />} />
          <Route path="manage-users/all-users" element={<ListManagers />} />
          <Route path="manage-users/pending-users" element={<ListPendingManagers />} />
          <Route path="notification" element={<Notification />} />
          <Route path="user-profile" element={<UserProfile user={userInfo} />} /> {/* Pass user info */}
        </Route>

        <Route path="freelancer/*" element={<FreelancerLayout />}>
          <Route index element={<FreelancerDashboard />} />
          <Route path="available-jobs" element={<AvailableJobs />} />
          <Route path="my-bids" element={<MyBids />} />
          <Route path="jobs/assigned-jobs" element={<MyAssignment />} />
          <Route path="jobs/submitted-jobs" element={<CompletedJobs />} />
          <Route path="payments/create-invoice" element={<Invoice />} />
          <Route path="fined-orders" element={<MyFines />} />
          <Route path="payments/paid-orders" element={<MyPaidInv />} />
          <Route path="payments/unpaid-orders" element={<MyPendingInv />} />
          <Route path="notification" element={<Notification />} />
          <Route path="user-profile" element={<UserProfile user={userInfo} />} /> {/* Pass user info */}
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
