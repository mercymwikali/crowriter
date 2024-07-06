import React, { useState } from 'react';
import { List, Avatar, Tabs } from 'antd';

const { TabPane } = Tabs;

const Notification = () => {
  const [notifications, setNotifications] = useState([
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
  ]);

  const [messages, setMessages] = useState([
    {
      id: 1,
      title: 'New Message',
      description: 'You have received a new message from John Doe.',
      avatar: 'https://via.placeholder.com/150',
    },
    // Add more messages as needed
  ]);

  return (
    <div style={{ padding: '40px', background: '#fff', borderRadius: '8px' }}>
      <Tabs defaultActiveKey="notifications">
        <TabPane tab="Notifications" key="notifications">
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
        </TabPane>
        <TabPane tab="Messages" key="messages">
          <List
            itemLayout="horizontal"
            dataSource={messages}
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
        </TabPane>
      </Tabs>
    </div>
  );
};

export default Notification;
