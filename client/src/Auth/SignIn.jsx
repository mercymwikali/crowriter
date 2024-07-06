import React from 'react';
import { Alert, Button, Card, Form, Input, Space, Spin, Typography } from "antd";
import { GiLoad } from 'react-icons/gi';
import useSignIn from '../hooks/useSignIn';
import logo from '../assets/logo.png'; // Assuming this is the path to your logo image

const SignIn = () => {
  const { email, setEmail, password, setPassword, handleLogin, loading, error } = useSignIn();

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const onFinish = () => {
    handleLogin();
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Card style={{ width: '550px',  textAlign: 'center',  }}>
        <img src={logo} alt="Crowriters Logo" style={{ maxWidth: '180px' }} />

        <Typography.Title level={3} style={{ marginBottom: '20px' }}>
          Sign In 
        </Typography.Title>
        
        {error && <Alert message={error} type="error" showIcon style={{ marginBottom: '20px' }} />}

        <Form
          layout="vertical"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            name="email"
            label="Email"
            rules={[
              {
                required: true,
                message: 'Please input your email!',
              },
              {
                type: 'email',
                message: 'Please enter a valid email!',
              },
            ]}
          >
            <Input
              size="large"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[
              {
                required: true,
                message: 'Please input your password!',
              },
            ]}
          >
            <Input.Password
              size="large"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="on"
            />
          </Form.Item>

          <Form.Item>
            <Space direction="horizontal" style={{ width: '100%', justifyContent: 'end' }}>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Input type="checkbox" />
              </Form.Item>
              <Typography.Text style={{ marginRight: '10px', color: 'gray' }}>
                Remember me
              </Typography.Text>
            </Space>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              style={{ width: '100%', backgroundColor: '#ff4500' }}
              loading={loading}
              disabled={loading}
            >
              {loading ? <Spin indicator={<GiLoad style={{ fontSize: 24 }} />} /> : 'Sign In'}
            </Button>
          </Form.Item>
        </Form>

        <Typography.Text style={{ marginTop: '20px' }}>
          Don't have an account? <a href="/signup">Sign Up</a>
        </Typography.Text>
      </Card>
    </div>
  );
};

export default SignIn;
