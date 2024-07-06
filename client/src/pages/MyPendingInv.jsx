import React, { useEffect, useState } from 'react';
import { Button, Modal, Table, Input, Tag } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { listInvoices } from '../actions/invoiceActions';
import { useNavigate } from 'react-router-dom';

const { Search } = Input;

const MyPendingInv = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [sortedInfo, setSortedInfo] = useState(null);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const invoiceList = useSelector(state => state.invoiceList);
    const { loading, error, invoices } = invoiceList;

    const handleViewOrders = (invoice) => {
        setSelectedInvoice(invoice);
        setModalVisible(true);
    };

    const handleCloseModal = () => {
        setModalVisible(false);
        setSelectedInvoice(null);
    };

    const handleChange = (pagination, filters, sorter) => {
        setSortedInfo(sorter);
    };

    const handleRedirectToInvoice = (invoice) => {
        navigate('/freelancer/Payments/Create-Invoice', { state: { invoice } });
    };

    const columns = [
        {
            title: 'Invoice Number',
            dataIndex: 'invoiceNumber',
            key: 'invoiceNumber',
            sorter: (a, b) => a.invoiceNumber.localeCompare(b.invoiceNumber),
            sortOrder: sortedInfo?.columnKey === 'invoiceNumber' && sortedInfo?.order,
        },
        {
            title: 'Claiming Amount',
            dataIndex: 'totalAmount',
            key: 'totalAmount',
            sorter: (a, b) => a.totalAmount - b.totalAmount,
            sortOrder: sortedInfo?.columnKey === 'totalAmount' && sortedInfo?.order,
            render: (text) => `ksh ${text}`,
        },
        {
            title: 'Date Created',
            dataIndex: 'createdAt',
            key: 'createdAt',
            sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
            sortOrder: sortedInfo?.columnKey === 'createdAt' && sortedInfo?.order,
            render: (text) => `${new Date(text).toLocaleDateString()}`,
        },
        {
            title: 'Status',
            dataIndex: 'isDraft',
            key: 'isDraft',
            sorter: (a, b) => a.isDraft - b.isDraft,
            sortOrder: sortedInfo?.columnKey === 'isDraft' && sortedInfo?.order,
            render: (isDraft) => (
                <Tag color={isDraft ? "processing" : "success"} bordered={false}>
                    {isDraft ? "Draft" : "Finalized"}
                </Tag>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <>
                    <Button type="primary" icon={<EyeOutlined />} onClick={() => handleViewOrders(record)}>
                        View Orders
                    </Button>
                    {/* {record.isDraft && (
                        <Button type="default" onClick={() => handleRedirectToInvoice(record)}>
                            Edit Draft
                        </Button>
                    )} */}
                </>
            ),
        },
    ];

    useEffect(() => {
        dispatch(listInvoices());
    }, [dispatch]);

    return (
        <div>
            <h2>My Pending Invoices</h2>
            <div style={{ marginBottom: 16 }}>
                <Search
                    placeholder="Search"
                    onChange={(e) => setSearchText(e.target.value)}
                    style={{ width: 200, marginRight: 8 }}
                />
            </div>
            <Table
                columns={columns}
                dataSource={invoices?.filter((item) =>
                    item.invoiceNumber.toLowerCase().includes(searchText.toLowerCase())
                )}
                onChange={handleChange}
                pagination={false}
                rowKey="id"
            />

            <Modal
                title="List of Unpaid Orders"
                visible={modalVisible}
                onCancel={handleCloseModal}
                footer={[
                    <Button key="close" onClick={handleCloseModal}>
                        Close
                    </Button>,
                ]}
                width={1000}
            >
                {selectedInvoice && (
                    <Table
                        columns={[
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
                                title: 'Sources',
                                dataIndex: 'sources',
                                key: 'sources',
                            },
                            {
                                title: 'Citation',
                                dataIndex: 'citation',
                                key: 'citation',
                            },
                            {
                                title: 'Pages',
                                dataIndex: 'pages',
                                key: 'pages',
                            },
                            {
                                title: 'Amount',
                                dataIndex: 'amount',
                                key: 'amount',
                                render: (text) => `ksh ${text}`,
                            },
                            {
                                title: 'Status',
                                dataIndex: 'status',
                                key: 'status',
                            },
                        ]}
                        dataSource={selectedInvoice.orders}
                        pagination={false}
                        rowKey="id"
                    />
                )}
            </Modal>
        </div>
    );
};

export default MyPendingInv;
