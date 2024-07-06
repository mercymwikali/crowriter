import React, { useState, useEffect } from 'react';
import { Button, Modal, Table } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { paymentDetails } from '../actions/paymentActions';
import useAuth from '../hooks/useAuth';

const MyPaidInv = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [data, setData] = useState([]);

    const dispatch = useDispatch();
    const id = useAuth()?.user?.id;

    useEffect(() => {
        if (id) {
            dispatch(paymentDetails(id));
        }
    }, [dispatch, id]);

    const payments = useSelector(state => state.paymentDetails);
    const { loading, error, payments: paymentList } = payments;

    const handleViewOrders = () => {
        setModalVisible(true);
    };

    const handleCloseModal = () => {
        setModalVisible(false);
    };

    const columns = [
        {
            title: 'Invoice Number',
            dataIndex: 'paymentRef',
            key: 'paymentRef',
        },
        {
            title: 'Amount Paid',
            dataIndex: 'amount',
            key: 'amount',
        },
        {
            title: 'Payment Method',
            dataIndex: 'modeOfPayment',
            key: 'modeOfPayment',
        },
        {
            title: 'Date Paid',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: date => new Date(date).toLocaleDateString(),
        },
        {
            title: 'Action',
            key: 'action',
            render: () => (
                <Button type="primary" icon={<EyeOutlined />} onClick={handleViewOrders}>
                    View Orders
                </Button>
            ),
        },
    ];

    return (
        <div>
            <h4>My Paid Invoices</h4>
            <Table columns={columns} dataSource={paymentList} pagination={false} />

            <Modal
                title="List of Paid Orders"
                visible={modalVisible}
                onCancel={handleCloseModal}
                footer={[
                    <Button key="close" onClick={handleCloseModal}>
                        Close
                    </Button>,
                ]}
            >
                <Table
                    columns={[
                        {
                            title: 'Order ID',
                            dataIndex: 'orderId',
                            key: 'orderId',
                        },
                        {
                            title: 'Rating',
                            dataIndex: 'rating',
                            key: 'rating',
                        },
                        {
                            title: 'Fine',
                            dataIndex: 'fine',
                            key: 'fine',
                        },
                    ]}
                    dataSource={[
                        {
                            key: '1',
                            orderId: 'ORD001',
                            rating: 4.5,
                            fine: '$50',
                        },
                        {
                            key: '2',
                            orderId: 'ORD002',
                            rating: 5.0,
                            fine: null,
                        },
                    ]}
                    pagination={false}
                />
            </Modal>
        </div>
    );
};

export default MyPaidInv;
