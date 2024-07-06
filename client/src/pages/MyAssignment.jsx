import { Card, Divider, Input, Select, Button, Tabs, Segmented, Slider, Table, Modal, Flex, Tooltip } from 'antd';
import { AppstoreOutlined, BarsOutlined, CheckOutlined, EyeOutlined, DeleteTwoTone } from '@ant-design/icons';
import React, { useState, useEffect } from 'react';
import { BsFilterSquare } from 'react-icons/bs';
import { Categories } from '../constants/Categories'; // Adjust the import path as needed
import ViewBid from './ViewBid'; // Import the ViewBid component
import { useDispatch, useSelector } from 'react-redux';
import { freelancerAssignments } from '../actions/assignmentActions';
import useAuth from '../hooks/useAuth';
import ViewJob from '../components/ViewJob';
import SubmitJob from '../components/SubmitJob';
import { deleteSubmission, freelancerSubList } from '../actions/submissionActions';

const { Search } = Input;
const { Option } = Select;
const { TabPane } = Tabs;

const MyAssignment = () => {
    const dispatch = useDispatch();
    const { loading, error, success, orders } = useSelector(state => state.freelancerAssignments);

    const { loading: submitLoading, error: submitError, success: submitSuccess, submissions } = useSelector(state => state.freelancerSubList);
    const { error: deleteSubError, success: deleteSubSuccess } = useSelector(state => state.deleteSub);

    const [searchText, setSearchText] = useState('');
    const [selectedCategory, setSelectedCategory] = useState([]);
    const [budgetRange, setBudgetRange] = useState([0, 1000]);
    const [filteredJobs, setFilteredJobs] = useState([]);
    const [viewMode, setViewMode] = useState('List');
    const [selectedJob, setSelectedJob] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [submitModalVisible, setSubmitModalVisible] = useState(false);

    const freelancerId = useAuth()?.user?.id;

    useEffect(() => {
        dispatch(freelancerAssignments(freelancerId));
    }, [dispatch, freelancerId]);

    useEffect(() => {
        dispatch(freelancerSubList(freelancerId));
    }, [orders, freelancerId]);

    useEffect(() => {
        setFilteredJobs(orders || []);
    }, [orders]);

    useEffect(() => {
        let filtered = orders || [];

        if (searchText) {
            filtered = filtered.filter(
                (order) =>
                    order.order.topic.toLowerCase().includes(searchText) ||
                    order.order.orderId.toLowerCase().includes(searchText)
            );
        }

        if (selectedCategory.length > 0) {
            filtered = filtered.filter((order) => selectedCategory.includes(order.order.category));
        }

        filtered = filtered.filter(
            (order) => order.order.amount >= budgetRange[0] && order.order.amount <= budgetRange[1]
        );

        //after submitting job filter using orderId
        if (submitSuccess) {
            filtered = filtered.filter((order) => order.order.orderId !== submitSuccess);
        }
        setFilteredJobs(filtered);
    }, [searchText, selectedCategory, budgetRange, orders]);

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

    const handleViewJob = (job) => {
        setSelectedJob(job);
        setModalVisible(true);
    };

    const handleDeclineJob = (jobId) => {

        Modal.useModal({
            title: 'Are you sure you want to decline this job?',
            body: <p>This action cannot be undone.</p>,
            onOk: () => {
                setFilteredJobs(filteredJobs.map(job => job.order.id === jobId ? { ...job, status: 'Declined' } : job));
            },
        })
    };

    const handleSubmitJob = (job) => {
        setSelectedJob(job);
        setSubmitModalVisible(true);
    };

    const handleCloseSubmitModal = () => {
        setSelectedJob(null);
        setSubmitModalVisible(false);
    };

    const handleCloseModal = () => {
        setSelectedJob(null);
        setModalVisible(false);
    };

    const handleDelete = (submissionId) => {
        Modal.confirm({
            title: 'Are you sure you want to delete this submission?',
            content: 'This action cannot be undone.',
            onOk: () => {
                dispatch(deleteSubmission(submissionId)).then(() => {
                    dispatch(freelancerSubList(freelancerId));
                });
            },
        });
    };

    const calculateTimeRemaining = (deadline) => {
        const duration = moment.duration(moment(deadline).diff(moment()));
        return `${duration.days()} days and ${duration.hours()} hours`;
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
            title: 'Budget',
            dataIndex: ['order', 'amount'],
            key: 'amount',
            render: (text) => `Ksh ${text}`,
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, job) => (
                <div>
                    <Button type="primary" onClick={() => handleViewJob(job)}>View Job</Button>
                    <Button
                        type="default"
                        style={{ marginLeft: '10px' }}
                        onClick={() => handleDeclineJob(job.order.id)}
                    >
                        Decline Job
                    </Button>
                    <Button
                        type="primary"
                        icon={<CheckOutlined />}
                        style={{ marginLeft: '10px' }}
                        onClick={() => handleSubmitJob(job)}
                    >
                        Submit Job
                    </Button>
                </div>
            ),
        },
    ];


    const subColumns = [
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
            title: 'Budget',
            dataIndex: ['order', 'amount'],
            key: 'amount',
            render: (text) => `Ksh ${text}`,
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, submissions) => (
                <div>
                    <Button type="primary" onClick={() => handleViewJob(submissions.id)}>
                        <Tooltip title="View Job">
                            <EyeOutlined />
                        </Tooltip>
                    </Button>
                    <Button
                        type="default"
                        style={{ marginLeft: '10px' }}
                        onClick={() => handleDelete(submissions.id)}
                    >
                        <Tooltip title="Delete" color="red">
                            <DeleteTwoTone twoToneColor="red" />
                        </Tooltip>
                    </Button>
                </div>
            ),
        },
    ];


    return (
        <div>
            <h4>My Assignments</h4>
            <div className="d-block d-md-flex">
                <div className="w-25" style={{ marginTop: '20px', border: '1px solid #f3f3f3', padding: '10px', borderRadius: '5px', height: 'fit-content' }}>
                    <div className="d-flex align-items-center justify-content-between w-100 ">
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
                    <h6>Search My Assignments</h6>
                    <Search
                        placeholder="Search by Order ID or Topic"
                        onSearch={handleSearch}
                        onChange={(e) => handleSearch(e.target.value)}
                        style={{ marginBottom: 20 }}
                    />
                    <Segmented
                        options={[
                            {
                                value: 'List',
                                icon: <BarsOutlined />,
                            },
                            {
                                value: 'Grid',
                                icon: <AppstoreOutlined />,
                            },
                        ]}
                        onChange={(value) => setViewMode(value)}
                        style={{ marginBottom: 20 }}
                    />
                    <Tabs defaultActiveKey="1">
                        <TabPane tab="Active Assignments" key="1">
                            {viewMode === 'Grid' ? (
                                <div className="row">
                                    {filteredJobs.map((job) => (
                                        <div key={job.order.id} className="col-md-6">
                                            <Card
                                                title={[
                                                    <div className='d-flex flex-row justify-content-between mt-2'>
                                                        <p>Order ID:{job.order.orderId}</p>
                                                        <p>Budget: ksh {job.order.amount}</p>
                                                    </div>,
                                                ]}
                                                // extra={<Button type="link">Details</Button>}
                                                style={{ marginBottom: 20 }}
                                            >
                                                <p><strong>Topic:</strong> {job.order.topic}</p>
                                                <p><strong>Instructions:</strong> {job.order.instructions.slice(0, 100)}...</p>
                                                <div className="d-flex gap-2 flex-wrap justify-content-between mt-3">
                                                    <Button type="primary" onClick={() => handleViewJob(job)}>View Job</Button>
                                                    <Button
                                                        type="default"
                                                        onClick={() => handleDeclineJob(job.order.id)}
                                                    >
                                                        Decline Job
                                                    </Button>
                                                    <Button
                                                        type="primary"
                                                        icon={<CheckOutlined />}
                                                        onClick={() => handleSubmitJob(job.order.id)}
                                                    >
                                                        Submit Job
                                                    </Button>
                                                </div>
                                            </Card>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <Table
                                    dataSource={orders}
                                    columns={columns}
                                    rowKey="order.id"
                                />
                            )}
                        </TabPane>
                        <TabPane tab="Submitted Assignments" key="2">
                            {viewMode === 'Grid' ? (
                                <div className="row">
                                    {submissions.length > 0 && submissions.map((submission) => (
                                        <div key={submission.order.id} className="col-md-6">
                                            <Card
                                                title={`${submission.order.orderId} -  ksh ${submission.order.amount}`}
                                                extra={<Button type="link">Due In</Button>}
                                                style={{ marginBottom: 20 }}
                                            >
                                                <p><strong>Topic:</strong> {submission.order.topic}</p>
                                                <p><strong>Deadline:</strong> {new Date(submission.order.deadline).toLocaleDateString()}</p>
                                                <div className="d-block d-md-flex justify-content-between mt-3">
                                                    <Button type="primary" onClick={() => handleViewJob(job)}>View </Button>
                                                    <Button
                                                        type="default"
                                                        onClick={() => handleDeclineJob(job.order.id)}
                                                    >
                                                        Delete
                                                    </Button>

                                                </div>
                                            </Card>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <Table
                                    dataSource={submissions}
                                    columns={subColumns}
                                    rowKey="order.id"
                                />
                            )}
                        </TabPane>
                    </Tabs>
                </div>
            </div>
            {selectedJob && (
                <ViewJob
                    selectedJob={selectedJob.order}
                    open={modalVisible}
                    onCancel={handleCloseModal}
                />
            )}

            {selectedJob && (
                <SubmitJob
                    selectedJob={selectedJob.order}
                    open={submitModalVisible}
                    onCancel={handleCloseSubmitModal}
                    handleSubmit={handleSubmitJob}
                />
            )}

        </div>
    );
};

export default MyAssignment;
