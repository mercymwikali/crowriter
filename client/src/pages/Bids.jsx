import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Select, Input, Tabs, Card, Table, Modal, Divider } from 'antd';
import { BsFilterSquare } from 'react-icons/bs';
import { Categories } from '../constants/Categories'; // Adjust the import path as needed
import { services } from '../constants/Services'; // Adjust the import path as needed
import { bidsList } from '../actions/BidsAction';
import ViewBid from './ViewBid';

const { Search } = Input;
const { Option } = Select;
const { TabPane } = Tabs;

const Bids = () => {
    const dispatch = useDispatch();
    const { success, error, bids } = useSelector(state => state.bidsList);
    const { loading: assignLoading, success: assignSuccess, error: assignError } = useSelector(state => state.assignOrder);

    const [searchText, setSearchText] = useState('');
    const [selectedCategory, setSelectedCategory] = useState([]);
    const [selectedService, setSelectedService] = useState([]);
    const [filteredJobs, setFilteredJobs] = useState([]);
    const [viewMode, setViewMode] = useState('List');
    const [selectedJob, setSelectedJob] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [pageSize, setPageSize] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        dispatch(bidsList());
    }, [dispatch]);

    useEffect(() => {
        if (bids && bids.length > 0) {
            setFilteredJobs(bids);
        }
    }, [bids]);

    // Filter jobs based on search text, category, and service and assigned or hired status
    useEffect(() => {
        let filtered =bids && bids.filter(job => {
            const titleMatch = job.topic.toLowerCase().includes(searchText.toLowerCase());
            const categoryMatch = selectedCategory.length === 0 || selectedCategory.includes(job.category);
            const serviceMatch = selectedService.length === 0 || selectedService.includes(job.service);
            return titleMatch && categoryMatch && serviceMatch;
        });

        // Hide bids that have been assigned or hired
        filtered =filtered && filtered.filter(job => !job.freelancerId || job.freelancerId === null);

        // Apply pagination
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const paginatedJobs =filtered && filtered.slice(startIndex, endIndex);
        setFilteredJobs(paginatedJobs);
    }, [searchText, selectedCategory, selectedService, bids, currentPage, pageSize]);

    useEffect(() => {
        if (assignSuccess) {
            dispatch(bidsList()); // Refresh the bids list after successful assignment
        }
    }, [assignSuccess, dispatch]);

    const handleViewBids = (job) => {
        setSelectedJob(job);
        setModalVisible(true);
    };

    const handleCloseModal = () => {
        setSelectedJob(null);
        setModalVisible(false);
    };

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

    const loadMoreData = () => {
        setCurrentPage(currentPage + 1);
    };

    const columns = [
        {
            title: 'Order ID',
            dataIndex: 'orderId',
            key: 'orderId',
        },
        {
            title: 'Budget',
            dataIndex: 'amount',
            key: 'amount',
            render: (amount) => `ksh ${amount}`,
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
            title: 'Bid Count',
            dataIndex: 'bidCount',
            key: 'bidCount',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, job) => (
                <Button type="primary" onClick={() => handleViewBids(job)}>
                    View Bids
                </Button>
            ),
        },
    ];

    return (
        <div>
            <h4>Bids List</h4>
            <div className="d-block d-md-flex">
                <div className="w-25" style={{ marginTop: '20px', border: '1px solid #f3f3f3', padding: '10px', borderRadius: '5px', height: 'fit-content' }}>
                    <div className="d-flex align-items-center justify-content-between w-100">
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
                    <Divider />
                </div>

                <div className="flex-grow-1 p-3">
                    <h6>Search Bids</h6>
                    <Search
                        placeholder="Search by Order ID or Topic"
                        onSearch={handleSearch}
                        onChange={(e) => handleSearch(e.target.value)}
                        style={{ marginBottom: 20 }}
                    />
                    <Tabs defaultActiveKey="1">
                        <TabPane tab="All Bids" key="1">
                            {viewMode === 'Grid' ? (
                                <div className="row">
                                    {filteredJobs.map((job) => (
                                        <div key={job.orderId} className="col-md-6">
                                            <Card
                                                title={job.orderId}
                                                extra={<Button type="link">Details</Button>}
                                                style={{ marginBottom: 20 }}
                                            >
                                                <p><strong>Topic:</strong> {job.topic}</p>
                                                <p><strong>Category:</strong> {job.category}</p>
                                                <p><strong>Service:</strong> {job.service}</p>
                                                <p><strong>Budget:</strong> ksh {job.amount}</p>
                                                <p><strong>Bid Count:</strong> {job.bidCount}</p>
                                                <Button type="primary" onClick={() => handleViewBids(job)}>
                                                    View Bids
                                                </Button>
                                            </Card>
                                        </div>
                                    ))}
                                    {filteredJobs.length < bids.length && (
                                        <div style={{ textAlign: 'center', marginTop: 20 }}>
                                            <Button onClick={loadMoreData}>Load More</Button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <>
                                    <Table
                                        columns={columns}
                                        dataSource={filteredJobs}
                                        pagination={false}
                                        rowKey="orderId"
                                    />
                                    {filteredJobs && filteredJobs.length <bids && bids.length && (
                                        <div style={{ textAlign: 'center', marginTop: 20 }}>
                                            <Button onClick={loadMoreData}>Load More</Button>
                                        </div>
                                    )}
                                </>
                            )}
                        </TabPane>
                        <TabPane tab="Cancelled Bids" key="2">
                            {viewMode === 'Grid' ? (
                                <div className="row">
                                    {filteredJobs.filter(job => job.status === 'CANCELLED').map((job) => (
                                        <div key={job.orderId} className="col-md-6">
                                            <Card
                                                title={`${job.orderId} - $${job.amount}`}
                                                extra={<Button type="link">Details</Button>}
                                                style={{ marginBottom: 20 }}
                                            >
                                                <p><strong>Topic:</strong> {job.topic}</p>
                                                <p><strong>Instructions:</strong> {job.instructions.slice(0, 100)}...</p>
                                                <div className="d-flex justify-content-between mt-3">
                                                    <Button type="primary" onClick={() => handleViewBids(job)}>View Bids</Button>
                                                    <Button type="default">Edit Job</Button>
                                                    <Button type="primary" ghost danger>Cancel Job</Button>
                                                </div>
                                            </Card>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <>
                                    <Table
                                        columns={columns}
                                        dataSource={filteredJobs && filteredJobs.filter(job => job.status === 'CANCELLED')}
                                        pagination={false}
                                        rowKey="orderId"
                                    />
                                </>
                            )}
                        </TabPane>
                    </Tabs>
                </div>
            </div>

            <ViewBid
                selectedJob={selectedJob}
                handleCloseModal={handleCloseModal}
                filteredJobs={filteredJobs}
                setFilteredJobs={setFilteredJobs} // Make sure setFilteredJobs is passed correctly
            />
        </div>
    );
};

export default Bids;
