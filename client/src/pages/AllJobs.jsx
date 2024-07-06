import React, { useState, useEffect } from 'react';
import { Card, Divider, Input, Select, Button, Tabs, Skeleton, Table, message } from 'antd';
import { AppstoreOutlined, BarsOutlined, DownloadOutlined } from '@ant-design/icons';
import { BsFilterSquare } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';
import { cancelOrder, newOrdersList } from '../actions/orderActions';
import { Categories } from '../constants/Categories';
import { services } from '../constants/Services';
import ViewJob from '../components/ViewJob';
import EditJob from '../components/EditJob'; // Adjust the import path as needed
import CancelConfirmation from '../components/Cancel';
import { downloadFile } from '../actions/fileUploadAction';

const { Search } = Input;
const { Option } = Select;
const { TabPane } = Tabs;

const AllOrders = () => {
    const dispatch = useDispatch();

    const { loading, error, orders = [] } = useSelector(state => state.newOrders);
    const { success: cancelSuccess } = useSelector(state => state.cancelOrder);
    const { success: editSuccess } = useSelector(state => state.updateOrder);

    const { loading: downloadLoading, error: downloadError, success: downloadSuccess } = useSelector(state => state.downloadFile);

    const [searchText, setSearchText] = useState('');
    const [selectedCategory, setSelectedCategory] = useState([]);
    const [selectedService, setSelectedService] = useState([]);
    const [viewMode, setViewMode] = useState('Grid'); // Default view mode set to 'Grid'
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [selectedJob, setSelectedJob] = useState(null);
    const [viewModalVisible, setViewModalVisible] = useState(false);
    const [editJobVisible, setEditJobVisible] = useState(false);
    const [cancelConfirmationVisible, setCancelConfirmationVisible] = useState(false);
    const [cancelOrderId, setCancelOrderId] = useState(null);
    const [visibleOrders, setVisibleOrders] = useState(6); // Number of initially visible orders
    const [loadMoreButton, setLoadMoreButton] = useState(true); // Whether to show the Load More button

    useEffect(() => {
        dispatch(newOrdersList());
    }, [dispatch]);

    useEffect(() => {
        setFilteredOrders(orders);
    }, [orders]);

    useEffect(() => {
        filterOrders();
    }, [searchText, selectedCategory, selectedService, orders]);

    useEffect(() => {
        if (cancelSuccess || editSuccess) {
            dispatch(newOrdersList());
        }
    }, [cancelSuccess, editSuccess, dispatch]);

    const handleSearch = (value) => {
        setSearchText(value.toLowerCase());
    };

    const handleCategoryChange = (value) => {
        setSelectedCategory(value);
    };

    const handleServiceChange = (value) => {
        setSelectedService(value);
    };

    const clearFilters = () => {
        setSearchText('');
        setSelectedCategory([]);
        setSelectedService([]);
    };

    const filterOrders = () => {
        let tempOrders = orders;
        if (searchText) {
            tempOrders = tempOrders.filter(order =>
                order.orderId.toLowerCase().includes(searchText) ||
                order.topic.toLowerCase().includes(searchText)
            );
        }
        if (selectedCategory.length) {
            tempOrders = tempOrders.filter(order =>
                selectedCategory.includes(order.category)
            );
        }
        if (selectedService.length) {
            tempOrders = tempOrders.filter(order =>
                selectedService.includes(order.service)
            );
        }
        setFilteredOrders(tempOrders);
    };

    const extractInstructions = (instructions) => {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = instructions;
        return tempDiv.textContent || tempDiv.innerText || '';
    };

    const handleViewJob = (job) => {
        setSelectedJob(job);
        setViewModalVisible(true);
    };

    const handleCancel = () => {
        setViewModalVisible(false);
        setSelectedJob(null);
        setEditJobVisible(false);
        setCancelConfirmationVisible(false);
        setCancelOrderId(null);
    };

    const handleEditJob = (job) => {
        setSelectedJob(job);
        setEditJobVisible(true);
    };

    const handleCancelConfirmation = (id) => {
        setCancelOrderId(id);
        setCancelConfirmationVisible(true);
    };

    const handleCancelOrder = () => {
        dispatch(cancelOrder(cancelOrderId));
        setCancelConfirmationVisible(false);
    };

    const handleDownload = (documentId) => {
        dispatch(downloadFile(documentId));

        if (downloadSuccess) {
            message.success('Document downloaded successfully');
        } else {
            message.error('Error downloading document');
        }
    }

    const columns = [
        {
            title: 'Order ID',
            dataIndex: 'orderId',
            key: 'orderId',
            render: (text) => <span>{text}</span>,
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
            render: (text) => <span>ksh. {text}</span>,
        },
        {
            title: 'Topic',
            dataIndex: 'topic',
            key: 'topic',
            render: (text) => <span>{text}</span>,
        },
        {
            title: 'Category',
            dataIndex: 'category',
            key: 'category',
            render: (text) => <span>{text}</span>,

        },
        {
            title: 'Service',
            dataIndex: 'service',
            key: 'service',
            render: (text) => <span>{text}</span>,
        },
        {
            title:'Attachment',
            dataIndex: 'attachments',
            key: 'attachments',
            render: (attachments) => (
                <span>
                    {attachments.length > 0 && (
                        <Button type="link" onClick={() => handleDownload(attachments[0])} icon={<DownloadOutlined />}>
                            Download
                        </Button>
                    )}
                </span>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (record) => (
                <div className='d-flex align-items-center justify-content-end gap-2'>
                    <Button type="primary" ghost onClick={() => handleEditJob(record)}>Edit Order</Button>
                    <Button type="default" onClick={() => handleViewJob(record)}>View Order</Button>
                    <Button type="primary" danger onClick={() => handleCancelConfirmation(record.id)}>
                        {record.status === 'CANCELLED' ? 'Delete Order' : 'Cancel Order'}
                    </Button>
                </div>
            ),
        },
    ];

    const toggleViewMode = () => {
        setViewMode(prevMode => prevMode === 'Grid' ? 'Table' : 'Grid');
    };

    const loadMore = () => {
        setVisibleOrders(prevVisible => prevVisible + 6); // Increase visible orders by 6
    };

    return (
        <div>
            <h4>Browse Orders</h4>
            <div className="d-block d-md-flex">
                <div className="w-auto" style={{ marginTop: '20px', border: '1px solid #f3f3f3', padding: '10px', borderRadius: '5px', height: 'fit-content', marginRight: '20px' }}>
                    <div className="d-block d-md-flex fl align-items-center justify-content-between w-100 ">
                        <div className="gap-2">
                            <span className='h6 text-secondary'>Filter By:</span>
                            <BsFilterSquare className='text-secondary my-1' />
                        </div>
                        <div>
                            <span className='text-secondary text-decoration-underline text-end cursor-pointer' onClick={clearFilters}>Clear Filters</span>
                        </div>
                    </div>
                    <Divider />
                    <div className='my-3'>
                        <h6>Category</h6>
                        <Select
                            mode="multiple"
                            style={{ width: '100%' }}
                            placeholder="Select a Category"
                            onChange={handleCategoryChange}
                            value={selectedCategory}
                        >
                            {Categories.map((category) => (
                                <Option key={category.value} value={category.value}>
                                    {category.label}
                                </Option>
                            ))}
                        </Select>
                    </div>
                    <Divider />
                    <div className='my-3'>
                        <h6>Service</h6>
                        <Select
                            mode="multiple"
                            style={{ width: '100%' }}
                            placeholder="Select a Service"
                            onChange={handleServiceChange}
                            value={selectedService}
                        >
                            {services.map((service) => (
                                <Option key={service.value} value={service.value}>
                                    {service.label}
                                </Option>
                            ))}
                        </Select>
                    </div>

                </div>

                <div className="flex-grow-1 p-3">
                    <h6>Search Orders</h6>
                    <div className="mb-3 d-block justify-content-between align-items-center">
                        <Search
                            placeholder="Search by Order ID or Topic"
                            onSearch={handleSearch}
                            onChange={(e) => handleSearch(e.target.value)}
                            style={{ marginBottom: 20 }}
                        />
                        {/* <Divider /> */}
                        <div className="my-1">
                            <Button type="link" onClick={toggleViewMode}>
                                Toggle {viewMode === 'Grid' ? 'Table' : 'Grid'} View
                            </Button>
                        </div>
                    </div>
                    <div>
                        {viewMode === 'Grid' ? (
                            <div className="grid-container">
                                {filteredOrders.slice(0, visibleOrders).map(order => (
                                   //have multiple columns
                                    <div key={order.id} className="d-">
                                         <Card key={order.id} title={`Order ID: ${order.orderId}`} extra={<Button type="default" onClick={() => handleViewJob(order)}>View</Button>}>
                                        <p>Amount: {order.amount}</p>
                                        <p>Topic: {order.topic}</p>
                                        <p>Category: {order.category}</p>
                                        <p>Service: {order.service}</p>
                                        <p>Instructions: {extractInstructions(order.instructions)}</p>
                                        <div className='d-flex align-items-center justify-content-start'>
                                            <Button type="primary" ghost onClick={() => handleEditJob(order)}>Edit Order</Button>
                                            <Button type="primary" danger onClick={() => handleCancelConfirmation(order.id)}>
                                                {order.status === 'CANCELLED' ? 'Delete Order' : 'Cancel Order'}
                                            </Button>
                                        </div>
                                    </Card>
                                    </div>
                                ))}
                                {loadMoreButton && (
                                    <Button type="link" onClick={loadMore}>
                                        Load More
                                    </Button>
                                )}
                            </div>
                        ) : (
                            <Table columns={columns} dataSource={filteredOrders} loading={loading} rowKey="id" />
                        )}
                    </div>
                </div>
            </div>
            <ViewJob visible={viewModalVisible} onCancel={handleCancel} selectedJob={selectedJob} />
            <EditJob visible={editJobVisible} onCancel={handleCancel} selectedJob={selectedJob} />
            <CancelConfirmation
                visible={cancelConfirmationVisible}
                onCancel={() => setCancelConfirmationVisible(false)}
                onConfirm={handleCancelOrder}
            />
        </div>
    );
};

export default AllOrders;
