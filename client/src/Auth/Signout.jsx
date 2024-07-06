import React from 'react';
import { Menu, Dropdown, Avatar } from 'antd';
import { FaUserAlt } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../actions/userActions';
import useAuth from '../hooks/useAuth';
import { MdLogout } from 'react-icons/md';
import { GiRamProfile } from 'react-icons/gi';

const Signout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userDetails = useAuth();
  const userId = userDetails?.user?.id;
  if (!userDetails || !userDetails.user) {
    navigate('/login');
    return null; // Exit early if userDetails or userDetails.user is null
  }

  const handleMenuClick = (e) => {
    if (e.key === '/signout') {
      dispatch(logout(userId));
      navigate('/login');
    } else if (e.key === '/user-profile') {
      switch (userDetails.user.role) {
        case 'MANAGER':
          navigate('/manager/user-profile');
          break;
        case 'FREELANCER':
          navigate('/freelancer/user-profile');
          break;
        case 'ADMIN':
          navigate('/admin/user-profile');
          break;
        default:
          navigate('/');
          break;
      }
    }
  };

  const menuItems = [
    { key: '/user-profile', icon: <GiRamProfile />, text: 'View Profile' },
    { key: '/signout', icon: <MdLogout />, text: 'Sign Out', danger: true }
  ];

  const menu = (
    <Menu onClick={handleMenuClick}>
      {menuItems.map(item => (
        <Menu.Item key={item.key} icon={item.icon} danger={item.danger}>
          {item.text}
        </Menu.Item>
      ))}
    </Menu>
  );

  return (
    <div>
      <Dropdown overlay={menu} trigger={['click']}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' }}>
          <Avatar size="large" icon={<FaUserAlt />} />
          <h6 style={{ marginLeft: '10px', color: '#fff', padding: '10px' }}>Hi! {userDetails.user.fname}</h6>
        </div>
      </Dropdown>
    </div>
  );
};

export default Signout;
