import React, { useEffect, useState } from 'react';
import { Avatar, Typography, Input, InputNumber, Modal, Button, message } from 'antd';
import { UserOutlined, EditOutlined } from '@ant-design/icons';
import { getFreelancerDetails, getManagerDetails, updateProfile } from '../actions/userActions';
import { useDispatch, useSelector } from 'react-redux';
import useAuth from '../hooks/useAuth';

const { Title } = Typography;

const UserProfile = () => {
  const dispatch = useDispatch();
  const { role: userRole, id: userId, fname, lname, email } = useAuth().user;

  const freelancerProfile = useSelector(state => state.freelancerProfile);
  const managerProfile = useSelector(state => state.managerProfile);
  const editProfile = useSelector(state => state.profileUpdate);

  const { error: freelancerError, success: freelancerSuccess, freelancer: freelancerData } = freelancerProfile;
  const { error: managerError, success: managerSuccess, manager: managerData } = managerProfile;
  const { error: editError, success: editSuccess } = editProfile;

  useEffect(() => {
    if (userRole === 'FREELANCER') {
      dispatch(getFreelancerDetails(userId));
    } else if (userRole === 'MANAGER') {
      dispatch(getManagerDetails(userId));
    }
  }, [dispatch, userRole, userId]);

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [updatedUserData, setUpdatedUserData] = useState({});

  const openEditModal = () => {
    setEditModalVisible(true);
    // Initialize updatedUserData with current user data
    setUpdatedUserData({
      ...freelancerData, // Assuming freelancerData or managerData contains current user data
      ...managerData,
    });
  };

  const closeEditModal = () => {
    setEditModalVisible(false);
    setUpdatedUserData({}); // Clear the updated data after closing modal
  };

  const getStatusColor = (active) => {
    return active ? 'green' : 'red';
  };

  const handleEditSubmit = () => {
    // Ensure updatedUserData is not empty and has values to update
    if (Object.keys(updatedUserData).length > 0) {
      dispatch(updateProfile(userId, updatedUserData));
    } else {
      message.warning('No changes to save.');
    }
    closeEditModal(); // Close modal after submitting
  };

  const renderManagerFields = () => {
    return (
      <>
        <div className="row mb-3">
          <label className="col-sm-3 col-form-label">Experience:</label>
          <div className="col-sm-9">
            <Input
              value={updatedUserData?.experience || 'Not applicable'}
              onChange={(e) => setUpdatedUserData({ ...updatedUserData, experience: e.target.value })}
            />
          </div>
        </div>
        <div className="row mb-3">
          <label className="col-sm-3 col-form-label">Leadership Style:</label>
          <div className="col-sm-9">
            <Input
              value={updatedUserData?.leadershipStyle || 'Not applicable'}
              onChange={(e) => setUpdatedUserData({ ...updatedUserData, leadershipStyle: e.target.value })}
            />
          </div>
        </div>
        <div className="row mb-3">
          <label className="col-sm-3 col-form-label">Team Size:</label>
          <div className="col-sm-9">
            <InputNumber
              value={updatedUserData?.teamSize || 0}
              onChange={(value) => setUpdatedUserData({ ...updatedUserData, teamSize: value })}
            />
          </div>
        </div>
        <div className="row mb-3">
          <label className="col-sm-3 col-form-label">Achievements:</label>
          <div className="col-sm-9">
            <Input
              value={updatedUserData?.achievements || 'Not applicable'}
              onChange={(e) => setUpdatedUserData({ ...updatedUserData, achievements: e.target.value })}
            />
          </div>
        </div>
        <div className="row mb-3">
          <label className="col-sm-3 col-form-label">Professional Development:</label>
          <div className="col-sm-9">
            <Input
              value={updatedUserData?.professionalDevelopment || 'Not applicable'}
              onChange={(e) => setUpdatedUserData({ ...updatedUserData, professionalDevelopment: e.target.value })}
            />
          </div>
        </div>
        {/* phone number */}
        <div className="row mb-3">
          <label className="col-sm-3 col-form-label">Phone Number:</label>
          <div className="col-sm-9">
            <Input
              value={updatedUserData?.phone || 'Not applicable'}
              onChange={(e) => setUpdatedUserData({ ...updatedUserData, phone: e.target.value })}
            />
          </div>
        </div>
      </>
    );
  };

  const renderFreelancerFields = () => {
    return (
      <>
        <div className="row mb-3">
          <label className="col-sm-3 col-form-label">Gender:</label>
          <div className="col-sm-9">
            <Input
              value={updatedUserData?.gender || 'Not applicable'}
              onChange={(e) => setUpdatedUserData({ ...updatedUserData, gender: e.target.value })}
            />
          </div>
        </div>
        <div className="row mb-3">
          <label className="col-sm-3 col-form-label">Country:</label>
          <div className="col-sm-9">
            <Input
              value={updatedUserData?.country || 'Not applicable'}
              onChange={(e) => setUpdatedUserData({ ...updatedUserData, country: e.target.value })}
            />
          </div>
        </div>
        <div className="row mb-3">
          <label className="col-sm-3 col-form-label">City:</label>
          <div className="col-sm-9">
            <Input
              value={updatedUserData?.city || 'Not applicable'}
              onChange={(e) => setUpdatedUserData({ ...updatedUserData, city: e.target.value })}
            />
          </div>
        </div>
        <div className="row mb-3">
          <label className="col-sm-3 col-form-label">Bio:</label>
          <div className="col-sm-9">
            <Input.TextArea 
              rows={4}
              value={updatedUserData?.aboutMe || 'Not applicable'}
              onChange={(e) => setUpdatedUserData({ ...updatedUserData, aboutMe: e.target.value })}
            />
          </div>
        </div>
      </>
    );
  };

  const renderAdminFields = () => (
    <>
        <div className="row mb-3">
          <label className="col-sm-3 col-form-label">Experience:</label>
          <div className="col-sm-9">
            <Input
              value={updatedUserData?.experience || 'Not applicable'}
              onChange={(e) => setUpdatedUserData({ ...updatedUserData, experience: e.target.value })}
            />
          </div>
        </div>
        <div className="row mb-3">
          <label className="col-sm-3 col-form-label">Leadership Style:</label>
          <div className="col-sm-9">
            <Input
              value={updatedUserData?.leadershipStyle || 'Not applicable'}
              onChange={(e) => setUpdatedUserData({ ...updatedUserData, leadershipStyle: e.target.value })}
            />
          </div>
        </div>
        <div className="row mb-3">
          <label className="col-sm-3 col-form-label">Team Size:</label>
          <div className="col-sm-9">
            <InputNumber
              value={updatedUserData?.teamSize || 0}
              onChange={(value) => setUpdatedUserData({ ...updatedUserData, teamSize: value })}
            />
          </div>
        </div>
        <div className="row mb-3">
          <label className="col-sm-3 col-form-label">Achievements:</label>
          <div className="col-sm-9">
            <Input
              value={updatedUserData?.achievements || 'Not applicable'}
              onChange={(e) => setUpdatedUserData({ ...updatedUserData, achievements: e.target.value })}
            />
          </div>
        </div>
        <div className="row mb-3">
          <label className="col-sm-3 col-form-label">Professional Development:</label>
          <div className="col-sm-9">
            <Input
              value={updatedUserData?.professionalDevelopment || 'Not applicable'}
              onChange={(e) => setUpdatedUserData({ ...updatedUserData, professionalDevelopment: e.target.value })}
            />
          </div>
        </div>
        {/* phone number */}
        <div className="row mb-3">
          <label className="col-sm-3 col-form-label">Phone Number:</label>
          <div className="col-sm-9">
            <Input
              value={updatedUserData?.phone || 'Not applicable'}
              onChange={(e) => setUpdatedUserData({ ...updatedUserData, phone: e.target.value })}
            />
          </div>
        </div>
      </>
  );

  if (!userId) {
    return null; // or a loading indicator
  }

  return (
    <div className="container" style={{ padding: '20px' }}>
      <Title level={4}>My Profile</Title>
      <div className='text-center mb-4'>
        <Avatar shape="square" icon={<UserOutlined />} size={100} src={freelancerData?.profilePic || managerData?.profilePic || ''} />
        <Title level={4} className='mt-2'>{`${fname} ${lname}`}</Title>
        <p>{userRole}</p>
        <span>Status : <span style={{ color: getStatusColor(freelancerData?.active || managerData?.active) }}>{freelancerData?.active || managerData?.active ? 'Active' : 'Inactive'}</span></span>
        <p>{email}</p>
        <Button type="primary" icon={<EditOutlined />} onClick={openEditModal}>Edit Profile</Button>
      </div>

      <div>
        {/* Common fields for all roles */}
        <div className="row mb-3">
          <label className="col-sm-3 col-form-label">First Name:</label>
          <div className="col-sm-9">
            <Input value={fname} readOnly />
          </div>
        </div>
        <div className="row mb-3">
          <label className="col-sm-3 col-form-label">Last Name:</label>
          <div className="col-sm-9">
            <Input value={lname} readOnly />
          </div>
        </div>
        <div className="row mb-3">
          <label className="col-sm-3 col-form-label">Email:</label>
          <div className="col-sm-9">
            <Input value={email} readOnly />
          </div>
        </div>
        <div className="row mb-3">
          <label className="col-sm-3 col-form-label">Phone:</label>
          <div className="col-sm-9">
            <Input value={updatedUserData?.phone || 'Not applicable'} readOnly />
          </div>
        </div>
        {/* Add more common fields as needed */}
      </div>

      {/* Render role-specific fields based on user's role */}
      {userRole === 'MANAGER' && (
        <>
          <div style={{ marginBottom: '20px' }}>
            <Title level={5}>Manager Details</Title>
            {renderManagerFields()}
          </div>
        </>
      )}

      {userRole === 'FREELANCER' && (
        <>
          <div style={{ marginBottom: '20px' }}>
            <Title level={5}>Freelancer Details</Title>
            {renderFreelancerFields()}
          </div>
        </>
      )}

      {userRole === 'ADMIN' && (
        <>
          <div style={{ marginBottom: '20px' }}>
            <Title level={5}>Admin Details</Title>
            {renderAdminFields()}
          </div>
        </>
      )}

      {/* Edit Profile Modal */}
      <Modal
        title="Edit Profile"
        visible={editModalVisible}
        onCancel={closeEditModal}
        footer={[
          <Button key="cancel" onClick={closeEditModal}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleEditSubmit}>
            Save
          </Button>,
        ]}
      >
        {/* Render form elements based on userRole */}
        {userRole === 'MANAGER' && renderManagerFields()}
        {userRole === 'FREELANCER' && renderFreelancerFields()}
        {/* Add more conditions for other roles if necessary */}
      </Modal>
    </div>
  );
};

export default UserProfile;
