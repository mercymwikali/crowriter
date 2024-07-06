import React, { useState } from 'react';
import { Form, Input, Select, Button } from 'antd';

const { Option } = Select;

const Manager = () => {
    const [form] = Form.useForm();
    const [formData, setFormData] = useState({
        experience: '',
        leadershipStyle: '',
        teamSize: '',
        achievements: '',
        professionalDevelopment: '',
    });

    const experienceOptions = ['Less than 1 year', '1-3 years', '3-5 years', '5+ years'];
    const teamSizeOptions = ['Small (1-10)', 'Medium (11-50)', 'Large (50+)'];

    const onFinish = (values) => {
        console.log('Form values:', values);
        // Handle form submission here
    };

    return (
        <div className="container py-2 mx-auto text-center my-3" style={{ border: '1px solid #ff4500',  borderRadius: '10px' }}>
            <h2 className='py-3'>Manager Profile Form</h2>
            <Form form={form} layout="vertical" onFinish={onFinish}>
                <Form.Item label="Years of Experience" name="experience" rules={[{ required: true }]}>
                    <Select placeholder="Select years of experience" value={formData.experience} style={{ width: '100%' }} onChange={(value) => setFormData({ ...formData, experience: value })}>
                        {experienceOptions.map((option) => (
                            <Option key={option} value={option}>
                                {option}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item label="Leadership Style" name="leadershipStyle" rules={[{ required: true }]}>
                    <Input.TextArea rows={4} placeholder="Describe your leadership style" onChange={(e) => setFormData({ ...formData, leadershipStyle: e.target.value })} />
                </Form.Item>
                <Form.Item label="Team Size" name="teamSize" rules={[{ required: true }]}>
                    <Select placeholder="Select team size" value={formData.teamSize} style={{ width: '100%' }} onChange={(value) => setFormData({ ...formData, teamSize: value })}>
                        {teamSizeOptions.map((option) => (
                            <Option key={option} value={option}>
                                {option}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item label="Key Achievements" name="achievements" rules={[{ required: true }]}>
                    <Input.TextArea rows={4} placeholder="Describe your key achievements as a manager" onChange={(e) => setFormData({ ...formData, achievements: e.target.value })} />
                </Form.Item>
                <Form.Item label="Professional Development" name="professionalDevelopment" rules={[{ required: true }]}>
                    <Input.TextArea rows={4} placeholder="How do you stay updated with industry trends and enhance your managerial skills?" onChange={(e) => setFormData({ ...formData, professionalDevelopment: e.target.value })} />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" style={{ width: '100%', marginTop: '20px' }}>
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default Manager;
