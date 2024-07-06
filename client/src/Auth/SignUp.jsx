import React, { useEffect } from 'react';
import { Button, Card, Form, Input, Typography, Row, Col, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../actions/userActions';

const SignUp = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [firstname, setFirstname] = React.useState('');
  const [lastname, setLastname] = React.useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, success, error, userInfo } = useSelector((state) => state.addUser);

  useEffect(() => {
    if (success) {
      message.success('Registration successful!', 5);
      const userId = userInfo.userId; // Assuming this is how you get userId from the state
      localStorage.setItem('userInfo', JSON.stringify(userInfo)); // Store user info in local storage
      navigate('/selectprofile', { state: { userId } }); // Navigate to the profile selection page
    }
    if (error) {
      message.error(error, 5);
    }
  }, [success, error, navigate, userInfo]);

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const onFinish = (values) => {
    dispatch(register({ fname: firstname, lname: lastname, email, password })).then(() => {
      navigate('/selectprofile', { state: { userId: userInfo.userId } });
    })
  };

  return (
    <div style={{ padding: '20px', margin: 'auto', height: 'calc(100vh - 60px)' }}>
      <Card style={{ width: '550px', margin: 'auto' }}>
        <Typography.Title style={{ textAlign: 'center', fontSize: '30px', marginBottom: '20px' }}>
          Sign Up to Crowriters
        </Typography.Title>

        <Form
          layout="vertical"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            marginTop: '20px',
          }}
        >
          <Row gutter={8}>
            <Col span={12}>
              <Form.Item
                name="firstname"
                label="Firstname"
                rules={[
                  {
                    required: true,
                    message: 'Please input your firstname!',
                  },
                ]}
                style={{ marginBottom: '12px' }}
              >
                <Input
                  size="large"
                  type="text"
                  placeholder="Firstname"
                  value={firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="lastname"
                label="Lastname"
                rules={[
                  {
                    required: true,
                    message: 'Please input your lastname!',
                  },
                ]}
                style={{ marginBottom: '12px' }}
              >
                <Input
                  size="large"
                  type="text"
                  placeholder="Lastname"
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                />
              </Form.Item>
            </Col>
          </Row>

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
            style={{ marginBottom: '12px' }}
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
            style={{ marginBottom: '12px' }}
          >
            <Input.Password
              size="large"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Confirm Password"
            dependencies={['password']}
            hasFeedback
            rules={[
              {
                required: true,
                message: 'Please confirm your password!',
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('The two passwords that you entered do not match!'));
                },
              }),
            ]}
            style={{ marginBottom: '12px' }}
          >
            <Input.Password
              size="large"
              placeholder="Confirm Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Item>

          <Form.Item style={{ marginTop: '12px' }}>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              style={{ width: '100%', backgroundColor: '#ff4500' }}
            >
              Sign Up
            </Button>
          </Form.Item>
        </Form>

        <Typography.Text style={{ textAlign: 'center', marginTop: '20px' }}>
          Already have an account? <a href="/login">Login</a>
        </Typography.Text>
      </Card>
    </div>
  );
};

export default SignUp;
