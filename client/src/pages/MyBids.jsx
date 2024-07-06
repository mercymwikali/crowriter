import React, { useState, useEffect } from 'react';
import { Card, Divider, Input, Select, Button, Tabs, Segmented, Slider, Table, Modal } from 'antd';
import { AppstoreOutlined, BarsOutlined, DownloadOutlined, DeleteOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { BsFilterSquare } from 'react-icons/bs';
import { Categories } from '../constants/Categories';
import ViewBid from './ViewBid';
import { deleteBid, freelancerBids } from '../actions/BidsAction';
import useAuth from '../hooks/useAuth';
import ViewJob from '../components/ViewJob';

const { Search } = Input;
const { Option } = Select;

const MyBids = () => {
    const dispatch = useDispatch();
    const { loading, error, bids = [] } = useSelector((state) => state.freelancerBids);

    const { success: deleteSuccess, error: deleteError } = useSelector(state => state.deleteBid);

    const [searchText, setSearchText] = useState('');
    const [selectedCategory, setSelectedCategory] = useState([]);
    const [budgetRange, setBudgetRange] = useState([0, 1000]);
    const [filteredJobs, setFilteredJobs] = useState([]);
    const [viewMode, setViewMode] = useState('List');
    const [selectedJob, setSelectedJob] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);



    const handleViewJob = (job) => {
        setSelectedJob(job);
        setModalVisible(true);
    };
    const freelancer = useAuth()?.user?.id;

    // console.log(freelancer);
    const handleDeleteBid = (jobId) => {
        Modal.confirm({
            title: 'Are you sure you want to delete this bid?',
            onOk: () => {
                dispatch(deleteBid(jobId)).then(() => {
                    setFilteredJobs(filteredJobs.filter(job => job.id !== jobId));
                });
            },
        });
    };

    const handleCloseModal = () => {
        setSelectedJob(null);
        setModalVisible(false);
    };

    useEffect(() => {
        dispatch(freelancerBids(freelancer));
    }, [dispatch]);

    useEffect(() => {
        setFilteredJobs(bids || []);
    }, [bids]);

    useEffect(() => {
        let filtered = bids

        if (searchText) {
            filtered = filtered.filter(
                (job) =>
                    job.order.orderId.toLowerCase().includes(searchText) ||
                    job.order.topic.toLowerCase().includes(searchText)
            );
        }

        if (selectedCategory.length > 0) {
            filtered = filtered.filter((job) =>
                selectedCategory.includes(job.order.category)
            );
        }

        filtered = filtered.filter(
            (job) => job.order.amount >= budgetRange[0] && job.order.amount <= budgetRange[1]
        );

        setFilteredJobs(filtered);
    }, [searchText, selectedCategory, budgetRange, bids]);

    const handleSearch = (value) => {
        setSearchText(value.toLowerCase());
    };

    const handleCategoryChange = (value) => {
        setSelectedCategory(value);
    };

    const handleBudgetChange = (value) => {
        setBudgetRange(value);
    };

    const clearFilters = () => {
        setSearchText('');
        setSelectedCategory([]);
        setBudgetRange([0, 1000]);
    };




    const columns = [
        {
            title: 'Order ID',
            dataIndex: ['order', 'orderId'],
            key: 'orderId',
        },
        {
            title: 'Topic',
            dataIndex: ['order', 'topic'],
            key: 'topic',
        },
        {
            title: 'Category',
            dataIndex: ['order', 'category'],
            key: 'category',
        },
        {
            title: 'Duration',
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

            title: 'Attachment',
            key: 'attachment',

            render: (_, job) => (
                <div>
                    <Button type="link" icon={<DownloadOutlined />}>
                        Download Attachments
                    </Button>
                </div>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, job) => (
                <div className='d-flex align-items-center justify-content-end'>
                    <Button type="primary" onClick={() => handleViewJob(job)}>View Job</Button>
                    <Button
                        type="danger"
                        icon={<DeleteOutlined />}
                        style={{ marginLeft: '10px' }}
                        onClick={() => handleDeleteBid(job.id)}
                    >
                        Delete Bid
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <div>
            <h4>My Bids</h4>
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
                        <h6>Budget</h6>
                        <Slider
                            range
                            defaultValue={[0, 1000]}
                            max={1000}
                            onChange={handleBudgetChange}
                            value={budgetRange}
                        />
                    </div>
                    <Divider />
                </div>

                <div className="flex-grow-1 p-3">
                    <h6>Search My Bids</h6>
                    <Search
                        placeholder="Search by Order ID or Topic"
                        onSearch={handleSearch}
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                    <div className="d-flex justify-content-between align-items-center mt-4">
                        <Segmented
                            options={[
                                { label: 'Card View', value: 'Card', icon: <BarsOutlined /> },
                                { label: 'List View', value: 'List', icon: <AppstoreOutlined /> },
                            ]}
                            value={viewMode}
                            onChange={setViewMode}
                        />
                    </div>
                    <Divider />
                    {viewMode === 'Card' ? (
                        <div className="row">
                            {filteredJobs.map((job) => (
                                <div key={job.order.orderId} className="col-md-4">
                                    <Card
                                        key={job.order.orderId}
                                        title={`Order ID: ${job.order.orderId}`}
                                        style={{ margin: '10px' }}
                                        extra={
                                            <Button type="link" icon={<DownloadOutlined />}>Download</Button>

                                        }
                                    >
                                        <p><strong>Topic:</strong> {job.order.topic}</p>
                                        <p><strong>Category:</strong> {job.order.category}</p>
                                        <p><strong>Duration:</strong> {job.order.duration}</p>
                                        <p><strong>Deadline:</strong> {new Date(job.order.deadline).toLocaleDateString()}</p>
                                        <div className="d-flex justify-content-between align-items-center mt-3">
                                            <Button type="primary" onClick={() => handleViewJob(job)}>
                                                View Job
                                            </Button>
                                            <Button
                                                type="primary"
                                                icon={<DeleteOutlined />}
                                                onClick={() => handleDeleteBid(job.id)}
                                                danger
                                                ghost
                                            >
                                                Delete Bid
                                            </Button>
                                        </div>
                                    </Card>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <Table
                            columns={columns}
                            dataSource={filteredJobs}
                            pagination={false}
                        />
                    )}
                </div>
            </div>
            {
                selectedJob && (
                    <ViewJob open={modalVisible} onCancel={handleCloseModal} selectedJob={selectedJob.order} />

                )
            }

        </div>
    );
};

export default MyBids;
