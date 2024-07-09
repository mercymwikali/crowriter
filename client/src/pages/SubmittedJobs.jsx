import React, { useEffect, useState } from 'react';
import { Avatar, List, Typography, Input, Select, DatePicker, Button, Dropdown, Menu, Table, message } from 'antd';
import { AppstoreOutlined, BarsOutlined, EllipsisOutlined } from '@ant-design/icons';
import { Segmented } from 'antd';
import AddReviewModal from '../components/AddReview';
import FineOrderModal from '../components/FineOrder'; // Make sure this import is correct
import { useDispatch, useSelector } from 'react-redux';
import { downloadSubmission, getSubmissions } from '../actions/submissionActions';
import ReassignJob from '../components/ReassignJob';
import ReDoOrder from '../components/ReDoOrder';

const { Option } = Select;
const { RangePicker } = DatePicker;

const SubmittedJobs = () => {
    const dispatch = useDispatch();
    const { loading, error, submissions } = useSelector(state => state.submissionList);
    const { error: downloadError, success: downloadSuccess } = useSelector(state => state.downloadSub);
    const [viewMode, setViewMode] = useState('List');
    const [addReviewVisible, setAddReviewVisible] = useState(false);
    const [fineOrderVisible, setFineOrderVisible] = useState(false);
const [reassignOrderVisible, setReassignOrderVisible] = useState(false);
const [reDoOrderVisible, setReDoOrderVisible] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        dispatch(getSubmissions());
    }, [dispatch]);

    useEffect(() => {
        if (downloadError) {
            message.error(downloadError);
        } else if (downloadSuccess) {
            message.success('File downloaded successfully');
        }
    }, [downloadError, downloadSuccess]);

    const checkDeadline = (submissionDate, deadline) => {
        const submission = new Date(submissionDate);
        const deadlineDate = new Date(deadline);
        return submission > deadlineDate;
    };

    const handleMenuClick = (e, record) => {
        switch (e.key) {
            case 'add-review':
                setAddReviewVisible(true);
                setSelectedOrder(record); // Set selectedOrder state with the record
                break;
            case 're-assign-order':
              setReassignOrderVisible(true);
              setSelectedOrder(record);
                break;
            case 're-do-order':
                setReDoOrderVisible(true);
                setSelectedOrder(record);
                break;
            case 'fine-order':
                setFineOrderVisible(true);
                setSelectedOrder(record);
                break;
            default:
                break;
        }
    };

    const menu = (record) => (
        <Menu onClick={(e) => handleMenuClick(e, record)}>
            <Menu.Item key="add-review">Add Review</Menu.Item>
            <Menu.Item key="re-assign-order">Re-Assign Order</Menu.Item>
            <Menu.Item key="re-do-order">Re-Do Order</Menu.Item>
            <Menu.Item key="fine-order">Fine Order</Menu.Item>
        </Menu>
    );

    const columns = [
        {
            title: 'Order ID',
            dataIndex: ['order', 'orderId'],
            key: 'orderId',
            render: (text, record) => <a href={`#${record.order.orderId}`}>{text}</a>,
        },
        {
            title: 'Topic',
            dataIndex: ['order', 'topic'],
            key: 'topic',
        },
        {
            title: 'Budget',
            dataIndex: ['order', 'amount'],
            key: 'budget',
            render: (text) => `Ksh ${text}`,
        },
        {
            title: 'Deadline',
            dataIndex: ['order', 'deadline'],
            key: 'deadline',
            render: (text) => `${new Date(text).toLocaleDateString()}`,
        },
        {
            title: 'Submitted By',
            dataIndex: ['freelancer', 'fname'],
            key: 'submittedBy',
        },
        {
            title: 'Submission Date',
            dataIndex: 'createdAt',
            key: 'submissionDate',
            render: (text) => `${new Date(text).toLocaleDateString()}`,
        },
        {
            title: 'Is Late',
            key: 'isLate',
            render: (text, record) => {
                const isLate = checkDeadline(record.createdAt, record.order.deadline);
                return (
                    <span>
                        {isLate ? (
                            <Button type="primary" danger ghost>
                                Late
                            </Button>
                        ) : (
                            <Button type="primary" ghost>
                                On Time
                            </Button>
                        )}
                    </span>
                );
            },
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (text, record) => (
                <span className='d-flex align-items-center justify-content-start gap-2'>
                    <Button type="link" onClick={() => handleDownload(record.id)}>
                        Download
                    </Button>
                    <Dropdown overlay={menu(record)} trigger={['click']}>
                        <Button type="default" icon={<EllipsisOutlined />} />
                    </Dropdown>
                </span>
            ),
        },
    ];

    const handleViewModeChange = (value) => {
        setViewMode(value);
    };

    const handleAddReviewCancel = () => {
        setAddReviewVisible(false);
    };

    const handleReassignOrderCancel = () => {
        setReassignOrderVisible(false);
    }

    const handleReDoOrderCancel = () => {
        setReDoOrderVisible(false);
    }

    const handleFineOrderCancel = () => {
        setFineOrderVisible(false);
    };

    const handleDownload = (submissionId) => {
        dispatch(downloadSubmission(submissionId));
    };

    const handleFineOrderSubmit = (fineAmount, fineReason) => {
        // Handle fine order submission logic
        console.log('Fine Amount:', fineAmount);
        console.log('Fine Reason:', fineReason);
        setFineOrderVisible(false); // Close modal after submission
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <Typography.Title level={2} style={{ textAlign: 'center' }}>Submitted Jobs</Typography.Title>
                <div className='d-flex align-items-center justify-content-end'>
                    <Typography.Title level={5} style={{ marginRight: '16px', color: '#ff4500' }}>View Mode:</Typography.Title>
                    <Segmented
                        options={[
                            { value: 'List', icon: <BarsOutlined /> },
                            { value: 'Table', icon: <AppstoreOutlined /> },
                        ]}
                        value={viewMode}
                        onChange={handleViewModeChange}
                        style={{ marginRight: '16px' }}
                    />
                </div>
            </div>
            <div style={{ display: 'flex', marginBottom: '16px' }}>
                <Input placeholder="Search by topic" style={{ marginRight: '16px' }} />
                <Select placeholder="Filter by user" style={{ marginRight: '16px' }}>
                    <Option value="John Doe">John Doe</Option>
                    <Option value="Jane Smith">Jane Smith</Option>
                    <Option value="Alice Johnson">Alice Johnson</Option>
                </Select>
                <RangePicker style={{ flex: 'auto' }} />
            </div>
            {viewMode === 'List' ? (
                <Table
                    columns={columns}
                    dataSource={submissions}
                    pagination={false}
                />
            ) : (
                <List
                    itemLayout="horizontal"
                    dataSource={submissions}
                    renderItem={(item, index) => (
                        <List.Item>
                            <List.Item.Meta
                                avatar={<Avatar>{index + 1}</Avatar>}
                                title={<Typography.Text strong>Order ID: {item.order.orderId}</Typography.Text>}
                                description={
                                    <div>
                                        <Typography.Text strong>Topic:</Typography.Text> {item.order.topic}<br />
                                        <Typography.Text strong>Budget:</Typography.Text> {item.order.amount}<br />
                                        <Typography.Text strong>Deadline:</Typography.Text> {new Date(item.order.deadline).toLocaleDateString()}<br />
                                        <Typography.Text strong>Submitted By:</Typography.Text> {item.freelancer.fname}
                                    </div>
                                }
                                style={{ cursor: 'pointer' }}
                            />
                            <div className="d-flex gap-3">
                                <Button type="primary" onClick={() => handleDownload(item.id)}>Download</Button>
                                <Dropdown overlay={menu} trigger={['click']}>
                                    <Button type="default" icon={<EllipsisOutlined />} />
                                </Dropdown>
                            </div>
                        </List.Item>
                    )}
                />
            )}
            <AddReviewModal
                visible={addReviewVisible}
                onCancel={handleAddReviewCancel}
                selectedOrder={selectedOrder} // Pass selectedOrder state to modal
            />

            <FineOrderModal
                visible={fineOrderVisible}
                onCancel={handleFineOrderCancel}
                onSubmit={handleFineOrderSubmit}
                selectedOrder={selectedOrder}
            />
            <ReassignJob
                visible={reassignOrderVisible}
                onCancel={handleReassignOrderCancel}
                selectedOrder={selectedOrder}
            />
            <ReDoOrder
                visible={reDoOrderVisible}
                onCancel={handleReDoOrderCancel}
                selectedOrder={selectedOrder}
            />
        </div>
    );
};

export default SubmittedJobs;
