import React, { useState } from 'react';
import { Form, Input, Button, Select, Switch } from 'antd';

const { Option } = Select;

const NewManager = () => {
  const [status, setStatus] = useState(true);

  const handleSubmit = (values) => {
    console.log('Form Values:', { ...values, status: status ? 'active' : 'inactive' });
    // Add logic to handle form submission
  };

  return (
    <div style={{ margin: '0 auto', padding: '40px', background: '#fff', borderRadius: '8px',  }}>
      <h2>Create New User</h2>
      <Form layout="vertical" onFinish={handleSubmit}>
        <div className="row">
          <div className="col-12 col-md-6">
            <Form.Item
              label="First Name"
              name="firstName"
              rules={[{ required: true, message: 'Please input the first name!' }]}
            >
              <Input placeholder="First Name" />
            </Form.Item>
          </div>
          <div className="col-12 col-md-6">
            <Form.Item
              label="Last Name"
              name="lastName"
              rules={[{ required: true, message: 'Please input the last name!' }]}
            >
              <Input placeholder="Last Name" />
            </Form.Item>
          </div>
        </div>
        <div className="row">
          <div className="col-12 col-md-6">
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: 'Please input the email!' },
                { type: 'email', message: 'Please enter a valid email!' }
              ]}
            >
              <Input placeholder="Email" />
            </Form.Item>
          </div>
          <div className="col-12 col-md-6">
            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: 'Please input the password!' }]}
            >
              <Input.Password placeholder="Password" />
            </Form.Item>
          </div>
        </div>
        <div className="row">
          <div className="col-12 col-md-6">
            <Form.Item
              label="Role"
              name="role"
              rules={[{ required: true, message: 'Please select the role!' }]}
            >
              <Select placeholder="Select Role">
                <Option value="manager">Manager</Option>
                <Option value="admin">Admin</Option>
                <Option value="user">User</Option>
              </Select>
            </Form.Item>
          </div>
          <div className="col-12 col-md-6">
            <Form.Item
              label="Status"
              name="status"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Switch checked={status} onChange={setStatus} style={{ marginRight: '10px' }}  size='large' width={60}/>
                <span>{status ? 'Active' : 'Inactive'}</span>
              </div>
            </Form.Item>
          </div>
        </div>
        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
            Create Manager
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default NewManager;
