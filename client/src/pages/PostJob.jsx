import React, { useEffect, useState } from 'react';
import { Form, Input, Typography, Select, InputNumber, DatePicker, Button, message } from 'antd';
import { Categories } from '../constants/Categories';
import { services } from '../constants/Services';
import { sources } from '../constants/Sources';
import { citation } from '../constants/Citation';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import moment from 'moment';
import FileUpload from '../components/FileUpload';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createOrder } from '../actions/orderActions';

const PostJob = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const postJob = useSelector((state) => state.createOrder);
    const { success, loading } = postJob;

    const [newOrder, setNewOrder] = useState({
        orderId: '',
        topic: '',
        category: '',
        service: '',
        sources: '',
        citation: '',
        deadline: null,
        duration: '',
        pages: 0,
        cpp: 0,
        amount: 0,
        instructions: '',
        attachments: [], // Changed to array
        additionalNotes: '',
        status: 'PENDING',
    });

    const handleChange = (field, value) => {
        setNewOrder(prevState => ({
            ...prevState,
            [field]: value
        }));

        if (field === 'cpp' || field === 'pages') {
            setNewOrder(prevState => ({
                ...prevState,
                amount: prevState.pages * prevState.cpp
            }));
        }

        if (field === 'deadline') {
            calculateEstimatedTime(value);
        }
    };

    const calculateEstimatedTime = (deadline) => {
        if (!deadline) {
            setNewOrder(prevState => ({ ...prevState, duration: 'No Deadline' }));
            return;
        }

        const now = moment();
        const end = moment(deadline);
        const duration = moment.duration(end.diff(now));
        const days = Math.floor(duration.asDays());
        const hours = Math.floor(duration.asHours() % 24);
        const minutes = Math.floor(duration.asMinutes() % 60);
        let durationStr = `${days} days and ${hours} hours`;

        if (days === 0) {
            durationStr = `${hours} hours`;
        }
        if (hours === 0) {
            durationStr = `${minutes} minutes`;
        }

        setNewOrder(prevState => ({ ...prevState, duration: durationStr }));
    };

    const handleSubmit = async () => {
        try {
            const order = {
                ...newOrder,
                deadline: newOrder.deadline ? moment(newOrder.deadline).toISOString() : null,
                instructions: extractInstructions(newOrder.instructions),
            };
            await dispatch(createOrder(order)).then(() => {
                if (success) {
                    message.success('Order created successfully');
                    navigate('/manager/manage-jobs/all-jobs');
                    resetForm();
                }
            });

        } catch (error) {
            message.error('Error creating order');
        }
    };

    const extractInstructions = (instructions) => {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = instructions;
        return tempDiv.textContent || tempDiv.innerText || '';
    };
// Handle File Upload
const handleFileUpload = (attachments) => {
    setNewOrder(prevState => ({
      ...prevState,
      attachments: attachments.map(file => file.documentId) // Keep as array of document IDs
    }));
  };
    
    const resetForm = () => {
        setNewOrder({
            orderId: '',
            topic: '',
            category: '',
            service: '',
            sources: '',
            citation: '',
            deadline: null,
            duration: '',
            pages: 0,
            cpp: 0,
            amount: 0,
            instructions: '',
            attachments: '',
            additionalNotes: '',
            status: 'PENDING',
        });
    };

    return (
        <div className='container'>
            <Typography.Title level={2} style={{ textAlign: 'center' }}>Create a New Order</Typography.Title>
            <h6>Order Requirements</h6>

            <Form layout="vertical" onFinish={handleSubmit}>
                <div className="row">
                    <div className="col-md-4">
                        {/* Order ID */}
                        <Form.Item label="Order ID">
                            <Input value={newOrder.orderId} onChange={(e) => handleChange('orderId', e.target.value)} />
                        </Form.Item>
                        {/* Service */}
                        <Form.Item label='Service'>
                            <Select
                                value={newOrder.service}
                                onChange={(value) => handleChange('service', value)}
                                options={services}
                                placeholder="Select type of service"
                            />
                        </Form.Item>
                    </div>
                    <div className="col-md-4">
                        {/* Topic */}
                        <Form.Item label="Topic">
                            <Input value={newOrder.topic} onChange={(e) => handleChange('topic', e.target.value)} />
                        </Form.Item>
                        {/* Number of Sources */}
                        <Form.Item label='No of Sources'>
                            <Select
                                value={newOrder.sources}
                                onChange={(value) => handleChange('sources', value)}
                                options={sources}
                                placeholder="Select number of sources required"
                            />
                        </Form.Item>
                    </div>
                    <div className="col-md-4">
                        {/* Category */}
                        <Form.Item label="Category">
                            <Select
                                value={newOrder.category}
                                onChange={(value) => handleChange('category', value)}
                                options={Categories}
                                placeholder="Select a category"
                            />
                        </Form.Item>
                        {/* Citation Style */}
                        <Form.Item label='Citation Style'>
                            <Select
                                value={newOrder.citation}
                                onChange={(value) => handleChange('citation', value)}
                                options={citation}
                                placeholder="Select citation style"
                            />
                        </Form.Item>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 col-md-4">
                        {/* Number of Pages */}
                        <Form.Item label="No of Pages">
                            <InputNumber
                                className="w-100"
                                value={newOrder.pages}
                                onChange={(value) => handleChange('pages', value)}
                            />
                        </Form.Item>
                    </div>
                    <div className="col-12 col-md-4">
                        {/* Cost Per Page */}
                        <Form.Item label="Cost Per Page">
                            <InputNumber
                                className="w-100"
                                value={newOrder.cpp}
                                onChange={(value) => handleChange('cpp', value)}
                            />
                        </Form.Item>
                    </div>
                    <div className="col-12 col-md-4">
                        {/* Total Cost */}
                        <Form.Item label="Total Cost">
                            <InputNumber
                                className="w-100"
                                value={newOrder.amount}
                                readOnly
                            />
                        </Form.Item>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 col-md-6">
                        {/* Deadline */}
                        <Form.Item label="Deadline">
                            <DatePicker
                                showTime
                                value={newOrder.deadline ? moment(newOrder.deadline) : null}
                                onChange={(date, dateString) => handleChange('deadline', dateString)}
                                className="w-100"
                            />
                        </Form.Item>
                    </div>
                    <div className="col-12 col-md-6">
                        {/* Due In */}
                        <Form.Item label="Due In">
                            <Input
                                className="w-100"
                                value={newOrder.duration}
                                readOnly
                            />
                        </Form.Item>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        {/* Instructions */}
                        <Form.Item label='Instructions'>
                            <ReactQuill value={newOrder.instructions} onChange={(value) => handleChange('instructions', value)} theme="snow" style={{ height: '200px' }} />
                        </Form.Item>
                    </div>
                </div>
                <div className='row'>
                    <div className="col-12 col-md-6 text-center my-md-5 py-4">
                        <Form.Item label='Attachments'>
                            {/* File Upload */}
                            <FileUpload onFileUpload={handleFileUpload} />
                            <span>Images, PDF, and other files</span>
                        </Form.Item>
                    </div>
                    <div className="col-12 col-md-6 text-center my-md-5 py-4">
                        {/* Additional Notes */}
                        <Form.Item label='Additional Notes'>
                            <Input.TextArea rows={8} value={newOrder.additionalNotes} onChange={(e) => handleChange('additionalNotes', e.target.value)} />
                        </Form.Item>
                    </div>
                </div>

                {/* Submit Button */}
                <Form.Item className='text-center'>
                    <Button
                        className="w-50"
                        size="large"
                        type="primary"
                        htmlType="submit"
                        onClick={handleSubmit}
                        loading={loading}
                        disabled={loading}
                    >
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default PostJob;
