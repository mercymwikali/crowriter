import React, { useState } from 'react';
import { Badge, Dropdown, Button, Menu, List, Avatar } from 'antd';
import { FaBell } from 'react-icons/fa';
import { MdOutlineCancelPresentation } from 'react-icons/md'; // Import the MdOutlineCancelPresentation icon
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const NotificationBell = () => {
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

  const userRole=useAuth().user.role;
  console.log(userRole)

  const handleVisibleChange = (flag) => {
    setVisible(flag);
  };

  const handleViewNotifications = () => {
   
switch (userRole) {
  case 'admin':
    navigate('/admin/notification');
    break;
  case 'freelancer':
    navigate('/freelancer/notification');
    
    break;
  case 'manager':
    navigate('/manager/notification');
    break;

  default:
    break;
}

    setVisible(false); // Hide the dropdown after navigating
  };

  const notifications = [
    {
      id: 1,
      title: 'New Message',
      description: 'You have received a new message from John Doe.',
      avatar: 'https://via.placeholder.com/150',
    },
    {
      id: 2,
      title: 'New Notification',
      description: 'Your order has been processed successfully.',
      avatar: 'https://via.placeholder.com/150',
    },
    // Add more notifications as needed
  ];

  const menu = (
    <Menu style={{ minWidth: '320px' }}>
      <Menu.Item key="0">
        <List
          itemLayout="horizontal"
          dataSource={notifications}
          renderItem={(item) => (
            <List.Item key={item.id}>
              <List.Item.Meta
                avatar={<Avatar src={item.avatar} />}
                title={<a href="#">{item.title}</a>}
                description={item.description}
              />
            </List.Item>
          )}
        />
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="1">
        <Button onClick={handleViewNotifications} style={{ width: '100%' }} type="primary" icon={<MdOutlineCancelPresentation />} >
          View Notifications
        </Button>
      </Menu.Item>
    </Menu>
  );

  return (
    <Dropdown
      overlay={menu}
      trigger={['click']}
      visible={visible}
      onVisibleChange={handleVisibleChange}
    >
      <div style={{ marginRight: '20px', color: '#fff' }}>
        <Badge count={notifications.length}>
          <FaBell style={{ fontSize: '20px', cursor: 'pointer', color: '#fff' }} />
        </Badge>
      </div>
    </Dropdown>
  );
};

export default NotificationBell;
