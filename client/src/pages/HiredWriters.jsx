import React, { useEffect, useState } from 'react';
import { Button, Typography, Input, Select, DatePicker, List, Avatar, Table, Modal } from 'antd';
import { AppstoreOutlined, BarsOutlined, DeleteOutlined } from '@ant-design/icons';
import { Segmented } from 'antd';
import { FaUserAlt } from 'react-icons/fa';
import { deleteAssignment, extendDeadline, listAssignments } from '../actions/assignmentActions';
import { useDispatch, useSelector } from 'react-redux';

const { Option } = Select;
const { RangePicker } = DatePicker;

const HiredWriters = () => {
    const [viewMode, setViewMode] = useState('Table');
    const dispatch = useDispatch();
    const { loading, error, orders, success } = useSelector(state => state.assignmentList);
    const { error: extendError, success: extendSuccess } = useSelector(state => state.extendDeadline);

    useEffect(() => {
        dispatch(listAssignments());
    }, [dispatch]);

    const handleViewModeChange = (value) => {
        setViewMode(value);
    };

    const handleHire = (order, freelancer) => {
        let newDeadline = null;
        let message = '';

        Modal.confirm({
            title: `Extend Deadline for ${freelancer.fname} with (Order ID: ${order.orderId})`,
            width: 500,
            content: (
                <div className='d-flex flex-column'>
                    <DatePicker showTime onChange={(date) => newDeadline = date} />
                    <Typography.Title className='mt-3' level={5}>Add Message:</Typography.Title>
                    <Input.TextArea style={{ width: '100%', overflow: 'auto' }} onChange={(e) => message = e.target.value} />
                </div>
            ),
            onOk() {
                dispatch(extendDeadline(order.id, newDeadline, message));
                // message.success('Deadline extended successfully', 5);

            },

            

            onCancel() {
                console.log('Cancel');
            },
        });
    };

    const handleViewDetails = (orderId) => {
        console.log(`Viewing details for order with ID: ${orderId}`);
    };

    const handleDeleteAssignment = (assignmentId) => {
        Modal.confirm({
            title: 'Are you sure you want to delete this assignment?',
            onOk() {
                dispatch(deleteAssignment(assignmentId)).then(() => {
                    // Handle UI update as needed
                });

                dispatch(listAssignments());
            },
        });
    };

    const columns = [
        {
            title: 'Order ID',
            dataIndex: ['order', 'orderId'],
            key: 'orderId',
            render: (text, record) => <a href={`#${record.orderId}`} onClick={() => handleViewDetails(record.orderId)}>{text}</a>,
        },
        {
            title: 'Topic',
            dataIndex: ['order', 'topic'],
            key: 'topic',
        },
        {
            title: 'Writer',
            dataIndex: ['freelancer', 'fname'],
            key: 'freelancer_fname',
        },
        {
            title: 'Amount',
            dataIndex: ['order', 'amount'],
            key: 'amount',
            render: (text) => `Ksh ${text}`,
        },
        {
            title: 'Due In',
            dataIndex: ['order', 'duration'],
            key: 'duration',
        },
        {
            title: 'Deadline',
            dataIndex: ['order', 'deadline'],
            key: 'deadline',
            render: (text) => new Date(text).toLocaleDateString(),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <div className='d-flex align-items-center justify-content-start'>
                    <Button type="primary" onClick={() => handleHire(record.order, record.freelancer)}>Extend Deadline</Button>
                    <Button
                        type="danger"
                        icon={<DeleteOutlined />}
                        style={{ marginLeft: '10px' }}
                        onClick={() => handleDeleteAssignment(record.id)}
                    >
                        Delete Assignment
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <Typography.Title level={2} style={{ textAlign: 'center' }}>Hired Writers</Typography.Title>
                <div className='d-flex align-items-center justify-content-end'>
                    <Typography.Title level={5} style={{ marginRight: '16px', color: '#ff4500' }}>View Mode:</Typography.Title>
                    <Segmented
                        options={[
                            { value: 'Table', icon: <BarsOutlined /> },
                            { value: 'List', icon: <AppstoreOutlined /> },
                        ]}
                        value={viewMode}
                        onChange={handleViewModeChange}
                        style={{ marginRight: '16px' }}
                    />
                </div>
            </div>
            <div style={{ display: 'flex', marginBottom: '16px' }}>
                <Input placeholder="Search by topic" style={{ marginRight: '16px' }} />
                <Select placeholder="Filter by writer" style={{ marginRight: '16px' }}>
                    {orders && orders.map(order => (
                        <Option key={order.freelancer.fname} value={order.freelancer.fname}>{order.freelancer.fname}</Option>
                    ))}
                </Select>
                <RangePicker style={{ flex: 'auto' }} />
            </div>
            {viewMode === 'Table' ? (
                <Table
                    dataSource={orders}
                    columns={columns}
                    rowKey="orderId"
                    loading={loading}
                />
            ) : (
                <List
                    className="demo-loadmore-list"
                    itemLayout="horizontal"
                    dataSource={orders}
                    loading={loading}
                    renderItem={order => (
                        <List.Item
                            actions={[
                                <Button type="primary" onClick={() => handleHire(order.order, order.freelancer)}>Extend Deadline</Button>,
                                <Button type="default" onClick={() => handleViewDetails(order.order.orderId)}>View Details</Button>
                            ]}
                        >
                            <List.Item.Meta
                                avatar={<Avatar icon={<FaUserAlt />} />}
                                title={<a href={`#${order.orderId}`}>{order.topic}</a>}
                                description={`Writer: ${order.freelancer.fname}`}
                            />
                            <div>
                                <p><strong>Budget</strong>: ksh {order.amount}</p>
                                <p><strong>Deadline</strong>: {new Date(order.deadline).toLocaleDateString()}</p>
                                <p><strong>Due In</strong>: {order.duration}</p>
                            </div>
                        </List.Item>
                    )}
                />
            )}
        </div>
    );
};

export default HiredWriters;
