import React from 'react';
import { Card, Typography, Avatar } from 'antd';
import { FaUserTie, FaUserAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png'; // Assuming this is the path to your logo image

const SelectProfile = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId'); // Fetch the user ID from localStorage

  const handleCardClick = (path, role) => {
    navigate(path, { state: { userId, role } }); // Pass userId and role to the path
  };

  return (
    <div style={{ padding: '20px', margin: 'auto', textAlign: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px' }}>
        <img src={logo} alt="Crowriters Logo" style={{ maxWidth: '180px', marginBottom: '10px' }} />
        <Typography.Title style={{ fontSize: '25px' }} level={2}>
          Choose Your Profile
        </Typography.Title>
      </div>

      <div className="d-block d-md-flex gap-5 justify-content-center my-2 align-items-center">
        <Card
          className="profile-card"
          onClick={() => handleCardClick('/freelance-profile', 'FREELANCER')}
          style={{ textAlign: 'center', padding: '20px', cursor: 'pointer' }}
        >
          <Avatar size={100} icon={<FaUserTie style={{ color: '#ff4500' }} />} />
          <Typography.Title style={{ fontSize: '20px' }} level={5}>
            Freelancer
          </Typography.Title>
          <div style={{ textAlign: 'center', backgroundColor: '#f3f3f3', padding: '10px', width: '100%' }}>
            <Typography.Title style={{ fontSize: '15px' }} level={6}>
              Start a Freelancer Profile
            </Typography.Title>
          </div>
        </Card>

        <Card
          className="profile-card"
          onClick={() => handleCardClick('/manager-profile', 'MANAGER')}
          style={{ textAlign: 'center', padding: '20px', cursor: 'pointer' }}
        >
          <Avatar size={100} icon={<FaUserAlt style={{ color: '#ff4500' }} />} />
          <Typography.Title style={{ fontSize: '20px' }} level={5}>
            Manager
          </Typography.Title>
          <div style={{ textAlign: 'center', backgroundColor: '#f3f3f3', padding: '10px', width: '100%' }}>
            <Typography.Title style={{ fontSize: '15px' }} level={6}>
              Start a Manager Profile
            </Typography.Title>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SelectProfile;
