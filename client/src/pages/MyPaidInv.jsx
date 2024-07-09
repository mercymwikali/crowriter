import React, { useState, useEffect } from 'react';
import { Button, Modal, Table, Input } from 'antd';
import { EyeOutlined, SearchOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { paymentDetails } from '../actions/paymentActions';
import useAuth from '../hooks/useAuth';

const MyPaidInv = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [filteredPayments, setFilteredPayments] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);

    const dispatch = useDispatch();
    const id = useAuth()?.user?.id;

    useEffect(() => {
        if (id) {
            dispatch(paymentDetails(id));
        }
    }, [dispatch, id]);

    const { loading, error, payment } = useSelector(state => state.paymentDetails);

    useEffect(() => {
        setFilteredPayments(payment);
    }, [payment]);

    const handleViewOrders = (payment) => {
        setSelectedPayment(payment);
        setModalVisible(true);
    };

    const handleCloseModal = () => {
        setModalVisible(false);
    };

    const handleSearch = (e) => {
        const value = e.target.value.toLowerCase();
        setSearchText(value);
        const filteredData = payment.filter(item => 
            item.paymentRef.toLowerCase().includes(value) ||
            item.modeOfPayment.toLowerCase().includes(value)
        );
        setFilteredPayments(filteredData);
    };

    const getOrderDateRange = (orders) => {
        if (!orders || orders.length === 0) return null;
        const dates = orders.map(order => new Date(order.createdAt));
        const minDate = new Date(Math.min(...dates));
        const maxDate = new Date(Math.max(...dates));
        return { minDate, maxDate };
    };

    const columns = [
        {
            title: '#',
            dataIndex: 'index',
            key: 'index',
            render: (text, record, index) => (currentPage - 1) * 10 + index + 1,
        },
        {
            title: 'Invoice Number',
            dataIndex: 'paymentRef',
            key: 'paymentRef',
            sorter: (a, b) => a.paymentRef.localeCompare(b.paymentRef),
        },
        {
            title: 'Amount Paid',
            dataIndex: 'amount',
            key: 'amount',
            sorter: (a, b) => a.amount - b.amount,
        },
        {
            title: 'Payment Method',
            dataIndex: 'modeOfPayment',
            key: 'modeOfPayment',
            filters: [
                { text: 'MPESA', value: 'MPESA' },
                { text: 'PayPal', value: 'PayPal' },
                { text: 'Bank Transfer', value: 'Bank Transfer' },
            ],
            onFilter: (value, record) => record.modeOfPayment.includes(value),
        },
        {
            title: 'Date Paid',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: date => new Date(date).toLocaleDateString(),
            sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <Button type="primary" icon={<EyeOutlined />} onClick={() => handleViewOrders(record)}>
                    View Orders
                </Button>
            ),
        },
    ];

    const modalColumns = [
        {
            title: '#',
            dataIndex: 'index',
            key: 'index',
            render: (text, record, index) => index + 1,
        },
        {
            title: 'Order ID',
            dataIndex: 'orderId',
            key: 'orderId',
        },
        {
            title: 'Topic',
            dataIndex: 'topic',
            key: 'topic',
        },
        {
            title: 'Category',
            dataIndex: 'category',
            key: 'category',
        },
        {
            title: 'Service',
            dataIndex: 'service',
            key: 'service',
        },
        {
            title: 'Fine Amount',
            key: 'fineAmount',
            render: (_, record) => {
                return record.fines.reduce((total, fine) => total + fine.amount, 0);
            }
        },
        {
            title: 'Fine Reasons',
            key: 'fineReasons',
            render: (_, record) => {
                return record.fines.map(fine => fine.reason).join(', ');
            }
        },
    ];

    const orderDateRange = selectedPayment ? getOrderDateRange(selectedPayment.invoice.orders) : null;

    return (
        <div>
            <h4>My Paid Invoices</h4>
            <Input 
                placeholder="Search by Invoice Number or Payment Method" 
                prefix={<SearchOutlined />} 
                value={searchText}
                onChange={handleSearch}
                style={{ marginBottom: 20 }}
            />
            <Table 
                columns={columns} 
                dataSource={filteredPayments} 
                pagination={{ 
                    pageSize: 10, 
                    onChange: page => setCurrentPage(page),
                }} 
                rowKey="id" 
                loading={loading}
            />

            <Modal
                title={`List of Paid Orders${orderDateRange ? ` from ${orderDateRange.minDate.toLocaleDateString()} to ${orderDateRange.maxDate.toLocaleDateString()}` : ''}`}
                visible={modalVisible}
                onCancel={handleCloseModal}
                footer={[
                    <Button key="close" onClick={handleCloseModal}>
                        Close
                    </Button>,
                ]}
                width={1000}
            >
                <Table
                    columns={modalColumns}
                    dataSource={selectedPayment?.invoice?.orders || []}
                    pagination={{ pageSize: 5 }}
                    rowKey="id"
                />
            </Modal>
        </div>
    );
};

export default MyPaidInv;
