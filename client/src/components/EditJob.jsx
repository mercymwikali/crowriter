import { Button, DatePicker, Form, Input, InputNumber, Modal, Select, message } from 'antd';
import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { Categories } from '../constants/Categories';
import { citation } from '../constants/Citation';
import ReactQuill from 'react-quill';
import { sources } from '../constants/Sources';
import { services } from '../constants/Services';
import { useDispatch, useSelector } from 'react-redux';
import { editJob } from '../actions/orderActions';

const EditJob = ({ visible, onCancel, selectedJob: job }) => {
    const dispatch = useDispatch();
    const { loading, error, success } = useSelector((state) => state.updateOrder);

    const [form] = Form.useForm();
    const [newOrder, setNewOrder] = useState({
        ...job,
        deadline: job && job.deadline ? moment(job.deadline) : undefined,
        duration: '', // Initialize duration state
    });

    // Handle Date Change
    const handleDateChange = (date) => {
        const newDeadline = date ? date.toISOString() : null;
        form.setFieldsValue({ deadline: newDeadline }); // Update form field

        // Calculate duration
        calculateEstimatedTime(newDeadline);
    };

    // Calculate Estimated Time Function
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

    // Handle Form Submission
    const handleSubmit = (values) => {
        const updatedJob = { ...newOrder, ...values }; // Use newOrder state
        dispatch(editJob(job.id, updatedJob));

        form.resetFields(); // Reset form fields
    };

    // Reset or Clear Form Fields on Success
    useEffect(() => {
        if (success) {
            message.success('Job updated successfully');
            form.resetFields(); // Reset form fields
            onCancel();
        }
        if (error) {
            message.error(error);
            form.resetFields(); // Reset form fields
        }
    }, [success, error]);

    return (
        <Modal
            title="Edit Job"
            visible={visible}
            onCancel={onCancel}
            footer={[
                <Button key="save" type="primary" onClick={() => form.submit()} loading={loading} disabled={loading}>
                    Save
                </Button>,
                <Button key="close" type="primary" onClick={onCancel} ghost>
                    Close
                </Button>,
            ]}
            width={1000}
            style={{ top: 20 }}
            bodyStyle={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}
        >
            {job && (
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    initialValues={{
                        ...job,
                        deadline: job.deadline ? moment(job.deadline) : undefined,
                    }}
                >
                    <div className="row">
                        <div className="col-12 col-md-3">
                            <Form.Item name="topic" label="Topic">
                                <Input />
                            </Form.Item>
                        </div>
                        <div className="col-12 col-md-3">
                            <Form.Item name="category" label="Category">
                                <Select options={Categories} />
                            </Form.Item>
                        </div>
                        <div className="col-12 col-md-3">
                            <Form.Item name="citation" label="Citation">
                                <Select options={citation} />
                            </Form.Item>
                        </div>
                        <div className="col-12 col-md-3">
                            <Form.Item name="service" label="Services">
                                <Select options={services} />
                            </Form.Item>
                        </div>
                    </div>
                    <Form.Item name="instructions" label="Instructions">
                        <ReactQuill style={{ height: '200px' }} />
                    </Form.Item>
                    <div className="row mt-5 align-items-center pt-3">
                        <div className="col-12 col-md-3">
                            <Form.Item name="deadline" label="Deadline">
                                <DatePicker showTime onChange={handleDateChange} />
                            </Form.Item>
                        </div>
                        <div className="col-12 col-md-3">
                            <Form.Item name="pages" label="Pages">
                                <InputNumber />
                            </Form.Item>
                        </div>
                        <div className="col-12 col-md-3">
                            <Form.Item name="cpp" label="Cost Per Page">
                                <InputNumber />
                            </Form.Item>
                        </div>
                        <div className="col-12 col-md-3">
                            <Form.Item name="amount" label="Budget">
                                <Input />
                            </Form.Item>
                        </div>
                    </div>
                    <Form.Item name="sources" label="Sources Number">
                        <Select options={sources} />
                    </Form.Item>
                    <Form.Item name="duration" label="Duration">
                        <Input value={newOrder.duration} readOnly />
                    </Form.Item>
                    <Form.Item name="additionalNotes" label="Additional Information">
                        <Input />
                    </Form.Item>
                </Form>
            )}
        </Modal>
    );
};

export default EditJob;
