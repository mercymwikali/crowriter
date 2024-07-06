import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Checkbox, Button, message } from 'antd'; // Import message from antd
import { FaCity, FaInfoCircle, FaMailchimp, FaPhone, FaUserCircle } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom'; // Import useNavigate
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile } from '../actions/userActions';

const { Option } = Select;

const Freelancer = () => {
    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate(); // useNavigate hook for navigation
    const { userInfo } = useSelector((state) => state.userLogin);
    const { loading, success, error } = useSelector((state) => state.profileUpdate);

    const [userId, setUserId] = useState('');

    useEffect(() => {
        if (location.state && location.state.userId) {
            setUserId(location.state.userId);
        }
    }, [location.state]);

    useEffect(() => {
        if (success) {
            message.success('Profile updated successfully!', 5);
            const userId = userInfo.userId; // Assuming this is how you get userId from the state
            localStorage.setItem('userInfo', JSON.stringify(userInfo)); // Store user info in local storage
            navigate('/login', { state: { userId } }); // Navigate to the profile selection page
        }
        if (error) {
            message.error(error, 5);
        }
    }, [success, error, navigate, userInfo]);

    const [form] = Form.useForm();

    const [formData, setFormData] = useState({
        gender: '',
        country: '',
        city: '',
        altEmail: '',
        phone: '',
        altPhone: '',
        citationStyles: [],
        languages: [],
        highestDegree: '',
        disciplines: [],
        specialization: [],
        additionalSoftware: [],
        aboutMe: '',
        role: '', // Add role field to formData state
    });

    const citationStyleOptions = ['MLA', 'APA', 'Chicago/Turabian', 'Harvard', 'Not applicable', 'Other'];
    const languageOptions = ['English', 'German', 'Spanish', 'French', 'Other'];
    const degreeOptions = ['Bachelor\'s', 'Master\'s', 'PhD', 'Other'];
    const disciplineOptions = ['Accounting', 'Agriculture', 'Anthropology', 'Application Letters', 'Art', 'Biology (and other Life Sciences)', 'Business Studies', 'Chemistry', 'Classic English Literature', 'Computer science', 'Criminal Justice', 'Criminal law', 'Economics', 'Education', 'Engineering', 'English 101', 'Environmental studies and Forestry', 'Ethics', 'Family and consumer science', 'Film & Theater studies', 'Finance', 'Health Care', 'History', 'Human Resources Management (HRM)', 'International Relations', 'International Trade', 'IT, Web', 'Law', 'Leadership Studies', 'Linguistics', 'Literature', 'Logistics', 'Management', 'Marketing', 'Mathematics', 'Medical Sciences (Anatomy, Physiology, Pharmacology etc.)', 'Medicine', 'Music', 'Nursing', 'Other', 'Philosophy', 'Physics', 'Poetry', 'Political science', 'Psychology'];
    const specializationOptions = ['Academic papers', 'Admission papers', 'Dissertation writing'];
    const softwareOptions = ['AutoCad', 'C++', 'Java programming', 'MATLAB', 'SPSS', 'Other'];

    const onFinish = (values) => {
        console.log('Form values:', values);
        // Handle form submission here
        dispatch(updateProfile({ userId, user: { ...formData, ...values } }));
    };

    return (
        <div className="container py-2 mx-auto text-center my-3" style={{ border: '1px solid #ff4500', borderRadius: '10px' }}>
            <h2 className='py-3'>Freelancer Profile Form</h2>
            <Form form={form} layout="vertical" onFinish={onFinish}>
                <div className="row">
                    <div className="col-md-4">
                        <Form.Item label={<span><FaUserCircle /> Gender</span>} name="gender" rules={[{ required: true }]}>
                            <Select placeholder="Select gender" value={formData.gender} style={{ width: '100%' }} onChange={(value) => setFormData({ ...formData, gender: value })}>
                                <Option value="male">Male</Option>
                                <Option value="female">Female</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item label={<span><FaMailchimp /> Country</span>} name="country" rules={[{ required: true }]}>
                            <Input placeholder="Enter country" onChange={(e) => setFormData({ ...formData, country: e.target.value })} />
                        </Form.Item>
                    </div>
                    <div className="col-md-4">
                        <Form.Item label={<span><FaCity /> City</span>} name="city" rules={[{ required: true }]}>
                            <Input placeholder="Enter city" onChange={(e) => setFormData({ ...formData, city: e.target.value })} />
                        </Form.Item>
                        <Form.Item label={<span><FaMailchimp /> Alternative Email</span>} name="altEmail">
                            <Input placeholder="Enter alternative email" onChange={(e) => setFormData({ ...formData, altEmail: e.target.value })} />
                        </Form.Item>
                    </div>
                    <div className="col-md-4">
                        <Form.Item label={<span><FaPhone /> Phone</span>} name="phone" rules={[{ required: true }]}>
                            <Input placeholder="Enter phone number" onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                        </Form.Item>
                        <Form.Item label={<span><FaPhone /> Alternative Phone</span>} name="altPhone">
                            <Input placeholder="Enter alternative phone number" onChange={(e) => setFormData({ ...formData, altPhone: e.target.value })} />
                        </Form.Item>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <Form.Item label={<span><FaInfoCircle /> Highest Degree</span>} name="highestDegree" rules={[{ required: true }]}>
                            <Select placeholder="Select highest degree" value={formData.highestDegree} style={{ width: '100%' }} onChange={(value) => setFormData({ ...formData, highestDegree: value })}>
                                {degreeOptions.map((option) => (
                                    <Option key={option} value={option}>
                                        {option}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <Form.Item label={<span><FaInfoCircle /> Citation Styles</span>} name="citationStyles">
                            <Checkbox.Group options={citationStyleOptions} value={formData.citationStyles} style={{ width: '100%', alignItems: 'start' }} onChange={(values) => setFormData({ ...formData, citationStyles: values })} />
                        </Form.Item>
                        <Form.Item label={<span><FaInfoCircle /> Languages</span>} name="languages">
                            <Checkbox.Group options={languageOptions} value={formData.languages} style={{ width: '100%', alignItems: 'start' }} onChange={(values) => setFormData({ ...formData, languages: values })} />
                        </Form.Item>
                    </div>
                    <div className="col-12">
                        <Form.Item label={<span><FaInfoCircle /> Specialization</span>} name="specialization">
                            <Checkbox.Group options={specializationOptions} value={formData.specialization} style={{ width: '100%', alignItems: 'start' }} onChange={(values) => setFormData({ ...formData, specialization: values })} />
                        </Form.Item>
                        <Form.Item label={<span><FaInfoCircle /> Additional Software</span>} name="additionalSoftware">
                            <Checkbox.Group options={softwareOptions} value={formData.additionalSoftware} style={{ width: '100%', alignItems: 'start' }} onChange={(values) => setFormData({ ...formData, additionalSoftware: values })} />
                        </Form.Item>
                        <Form.Item label={<span><FaInfoCircle /> Disciplines</span>} name="disciplines">
                            <Checkbox.Group options={disciplineOptions} value={formData.disciplines} style={{ width: '100%', alignItems: 'start', gap: '10px' }} onChange={(values) => setFormData({ ...formData, disciplines: values })} />
                        </Form.Item>
                    </div>
                </div>
                <Form.Item label={<span><FaInfoCircle /> About Me</span>} name="aboutMe">
                    <Input.TextArea rows={4} placeholder="Tell us about yourself" onChange={(e) => setFormData({ ...formData, aboutMe: e.target.value })} />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" style={{ width: '100%' }}>Submit</Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default Freelancer;
