import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { newOrdersList } from '../actions/orderActions';
import { Card, Divider, Input, Select, Button, Tabs, Segmented, Slider, Table } from 'antd';
import { AppstoreOutlined, BarsOutlined, DownloadOutlined } from '@ant-design/icons';
import { BsFilterSquare } from 'react-icons/bs';
import { Categories } from '../constants/Categories';
import ViewBid from './ViewBid';
import FreelancerBid from '../components/FreelancerBid';
import ViewJob from '../components/ViewJob';
import useAuth from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { downloadFile } from '../actions/fileUploadAction';

const { Search } = Input;
const { Option } = Select;
const { TabPane } = Tabs;

const AvailableJobs = () => {
  const dispatch = useDispatch();
  const { loading, orders = [] } = useSelector(state => state.newOrders);
  const { success: bidSuccess } = useSelector(state => state.createBid);
  const { bids } = useSelector(state => state.freelancerBids);
  const { loading: downloadLoading, error: downloadError, success: downloadSuccess } = useSelector(state => state.downloadFile);

  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [budgetRange, setBudgetRange] = useState([0, 1000]);
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [viewMode, setViewMode] = useState('List');
  const [selectedJob, setSelectedJob] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [bidModalVisible, setBidModalVisible] = useState(false);

  const freelancerId = useAuth()?.user?.id;
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(newOrdersList());
  }, [dispatch]);

  useEffect(() => {
    setJobs(orders || []);
  }, [orders]);

  useEffect(() => {
    let filtered = [...orders];

    if (searchText) {
      filtered = filtered.filter(
        job =>
          job.orderId.toLowerCase().includes(searchText) ||
          job.topic.toLowerCase().includes(searchText)
      );
    }

    if (selectedCategory.length > 0) {
      filtered = filtered.filter(job =>
        selectedCategory.includes(job.category)
      );
    }

    filtered = filtered.filter(
      job => job.amount >= budgetRange[0] && job.amount <= budgetRange[1]
    );

    // Filter jobs that are not bid by the current freelancer
    filtered = filtered.filter(job =>
      !bids.some(bid => bid.freelancerId === freelancerId && bid.orderId === job.orderId)
    );

    setFilteredJobs(filtered);
  }, [searchText, selectedCategory, budgetRange, orders, bids, freelancerId]);

  useEffect(() => {
    if (bidSuccess) {
      setBidModalVisible(false);
      setSelectedJob(null);
    }
  }, [bidSuccess]);

  const handleSearch = value => {
    setSearchText(value.toLowerCase());
  };

  const handleCategoryChange = value => {
    setSelectedCategory(value);
  };

  const handleBudgetChange = value => {
    setBudgetRange(value);
  };

  const clearFilters = () => {
    setSearchText('');
    setSelectedCategory([]);
    setBudgetRange([0, 1000]);
  };

  const handleViewModeChange = value => {
    setViewMode(value);
  };

  const handleBid = job => {
    setSelectedJob(job);
    setBidModalVisible(true);
  };

  const handleBidSuccess = bidJob => {
    setFilteredJobs(prevJobs =>
      prevJobs.filter(job => job.orderId !== bidJob.orderId)
    );
  };

  const handleDownload = documentId => {
    dispatch(downloadFile(documentId));

    if (downloadSuccess) {
      message.success('Document downloaded successfully');
  } else {
      message.error('Error downloading document');
  }
    
  };

  const columns = [
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
      title: 'Budget',
      dataIndex: 'amount',
      key: 'amount',
      render: text => `ksh ${text}`,
    },
    {
      title: 'Due In',
      dataIndex: 'duration',
      key: 'duration',
    },
    {
      title: 'Submission Date',
      dataIndex: 'deadline',
      key: 'deadline',
      render: text => new Date(text).toLocaleDateString(),
    },
    {
      title: 'Download Attachments',
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
      render: (text, record) => (
        <span className="d-flex align-items-center justify-content-end">
          <Button type="primary" onClick={() => handleViewAvailableJobs(record)}>
            View Job
          </Button>
          <Button type="default" onClick={() => handleBid(record)}>
            Bid Job
          </Button>
        </span>
      ),
    },
  ];

  const handleViewAvailableJobs = job => {
    setSelectedJob(job);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setSelectedJob(null);
    setModalVisible(false);
  };

  return (
    <div>
      <h4>Available Jobs</h4>
      <div className="d-block d-md-flex">
        <div className="w-25" style={{ marginTop: '20px', border: '1px solid #f3f3f3', padding: '10px', borderRadius: '5px', height: 'fit-content' }}>
          <div className="d-flex align-items-center justify-content-between w-100 ">
            <div className="gap-2">
              <span className='h6 text-secondary'>Filter By:</span>
              <BsFilterSquare className='text-secondary my-1' />
            </div>
            <div>
              <Button type="primary" onClick={clearFilters}>Clear All</Button>
            </div>
          </div>
          <Divider className='my-1' />
          <Search
            placeholder='Search by Order Id or Topic'
            onSearch={handleSearch}
            style={{ width: '100%', marginTop: '10px' }}
          />
          <Divider className='my-2' />
          <Select
            placeholder='Select Category'
            style={{ width: '100%', marginBottom: '10px' }}
            onChange={handleCategoryChange}
            allowClear
            mode='multiple'
            value={selectedCategory}
          >
            {Categories.map(category => (
              <Option key={category.value} value={category.value}>
                {category.label}
              </Option>
            ))}
          </Select>


          <Divider className='my-2' />
          <span className='d-flex align-items-center justify-content-between text-secondary'>
            <p className='m-0 p-0'>Budget</p>
            <p className='m-0 p-0'>{`${budgetRange[0]}ksh-${budgetRange[1]}ksh`}</p>
          </span>
          <Slider
            range
            defaultValue={[0, 1000]}
            min={0}
            max={5000}
            onChange={handleBudgetChange}
            value={budgetRange}
          />
        </div>
        <div className="w-100 mx-md-3">
          <div className="d-flex align-items-center justify-content-between w-100 my-2">
            <h5>Available Orders</h5>
            <Segmented
              options={[
                { label: 'List', value: 'List', icon: <BarsOutlined /> },
                { label: 'Module', value: 'Module', icon: <AppstoreOutlined /> }
              ]}
              value={viewMode}
              onChange={handleViewModeChange}
            />
          </div>
          <Tabs defaultActiveKey="1">
            <TabPane tab="All Orders" key="1">
              {viewMode === 'Module' ? (
                <div className="d-flex gap-2 flex-wrap align-items-center justify-content-start w-100">
                  {orders.map(job => (
                    <Card key={job.orderId} title={`Order ID: ${job.orderId}`} className="w-100">
                      <p><strong>Topic:</strong> {job.topic}</p>
                      <p><strong>Budget:</strong> ksh {job.amount}</p>
                      <p><strong>Due In:</strong> {job.duration}</p>
                      <p><strong>Deadline:</strong> {new Date(job.deadline).toLocaleDateString()}</p>
                      <Button type="primary" onClick={() => handleBid(job)}>Place Bid</Button>
                    </Card>
                  ))}
                </div>
              ) : (
                <Table
                  dataSource={filteredJobs}
                  columns={columns}
                  rowKey="orderId"
                  loading={loading}
                />
              )}
            </TabPane>
            <TabPane tab="My Bids" key="2">
              <ViewBid />
            </TabPane>
          </Tabs>
        </div>
      </div>
      {selectedJob && (
        <ViewJob
          visible={modalVisible}
          onClose={handleCloseModal}
          job={selectedJob}
        />
      )}
      {selectedJob && (
        <FreelancerBid
          visible={bidModalVisible}
          setModalVisible={setBidModalVisible}
          job={selectedJob}
          onBidSuccess={handleBidSuccess}
        />
      )}
    </div>
  );
};

export default AvailableJobs;
