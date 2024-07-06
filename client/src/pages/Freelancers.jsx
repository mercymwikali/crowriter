import React, { useEffect, useState } from 'react';
import { Typography, Input, Select, Button, Rate, Table, Switch, Badge, Card, Modal, Row, Col } from 'antd';
import { UserOutlined, BarsOutlined, AppstoreOutlined } from '@ant-design/icons';
import { Segmented } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { freelancerList } from '../actions/userActions';

const { Option } = Select;

const Freelancers = () => {
  const [viewMode, setViewMode] = useState('table');
  const [searchValue, setSearchValue] = useState('');
  const [sortValue, setSortValue] = useState(null); // null for no sorting, 'asc' for ascending, 'desc' for descending
  const [currentPage, setCurrentPage] = useState(1); // For pagination
  const [itemsPerPage, setItemsPerPage] = useState(5); // Number of items per page
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedFreelancer, setSelectedFreelancer] = useState(null);
  const dispatch = useDispatch();

  const { loading, error, freelancers } = useSelector(state => state.freelancersList);

  useEffect(() => {
    dispatch(freelancerList());
  }, [dispatch]);

  const handleViewModeChange = (value) => {
    setViewMode(value);
  };

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleSortChange = (value) => {
    setSortValue(value);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleStatusChange = (id, status) => {
    console.log(`Freelancer ${id} is now ${status ? 'active' : 'inactive'}`);
    // You can dispatch an action here to update the active status
  };

  const handleViewProfile = (freelancer) => {
    setSelectedFreelancer(freelancer);
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
  };

  const loadMore = () => {
    setItemsPerPage(itemsPerPage + 5);
  };

  const filteredData = freelancers && freelancers.filter((freelancer) =>
    freelancer.fname.toLowerCase().includes(searchValue.toLowerCase()) ||
    freelancer.lname.toLowerCase().includes(searchValue.toLowerCase())
  );

  const sortedData = sortValue
    ? [...filteredData].sort((a, b) => {
      if (sortValue === 'asc') {
        return a.totalAmountPaid - b.totalAmountPaid;
      } else {
        return b.totalAmountPaid - a.totalAmountPaid;
      }
    })
    : filteredData;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedData.slice(indexOfFirstItem, indexOfLastItem);

  const columns = [
    {
      title: '#',
      dataIndex: 'index',
      key: 'index',
      render: (text, record, index) => index + 1,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => <a onClick={() => handleViewProfile(record)}>{record.fname} {record.lname}</a>,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Total Amount Paid',
      dataIndex: 'totalAmountPaid',
      key: 'totalAmountPaid',
      render: (amount) => <>{amount}</>,
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
      render: (rating) => <Rate disabled defaultValue={rating} />,
    },
    {
      title: 'Active Status',
      dataIndex: 'active',
      key: 'active',
      render: (active, record) => (
        <Switch
          checked={active}
          onChange={() => handleStatusChange(record.id, !active)}
          style={{ backgroundColor: active ? 'green' : 'red' }}
        />
      ),
    },
    {
      title: 'Online Status',
      dataIndex: 'online',
      key: 'online',
      render: (online) => (
        <Badge dot color={online ? 'green' : 'red'}>{online ? 'Online' : 'Offline'}</Badge>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => <Button type="primary" onClick={() => handleViewProfile(record)}>View Profile</Button>,
    },
  ];

  return (
    <div>
      <Typography.Title level={2}>Freelancers</Typography.Title>
      <Input placeholder="Search by name" value={searchValue} onChange={handleSearchChange} style={{ marginBottom: '16px' }} />
      <div style={{ marginBottom: '16px', gap: '8px', display: 'flex', justifyContent: 'flex-end' }}>
        <label style={{ marginRight: '8px', fontWeight: 'bold', textAlign: 'right', padding: '8px' }}>Sort by amount paid:</label>
        <Select defaultValue="Sort by amount paid" onChange={handleSortChange} style={{ width: 160, marginRight: '8px' }}>
          <Option value="asc">Ascending</Option>
          <Option value="desc">Descending</Option>
        </Select>
        <Segmented
          options={[
            {
              value: 'list',
              icon: <BarsOutlined />,
            },
            {
              value: 'table',
              icon: <AppstoreOutlined />,
            },
          ]}
          value={viewMode}
          onChange={handleViewModeChange}
        />
      </div>
      {viewMode === 'list' ? (
        <div style={{ display: 'flex', flexGrow: 1, flexWrap: 'wrap' }}>
          {currentItems.map(freelancer => (
            <Card key={freelancer.id} style={{ width: 300, margin: '16px' }}
              title={
                <div className='d-flex justify-content-between align-items-center p-2'>
                  <a href="#" >{freelancer.email}</a>
                  <Badge dot color={freelancer.online ? 'green' : 'red'} style={{ marginLeft: '2px' }}>{freelancer.online ? 'Online' : 'Offline'}</Badge>
                </div>
              }
            >
              <Card.Meta
                avatar={<UserOutlined />}
                description={<p>{freelancer.fname} {freelancer.lname}</p>}
              />
              <div style={{ marginTop: '8px' }}>
                <span style={{ marginRight: '8px' }}>Rating:</span> <Rate disabled defaultValue={freelancer.rating} />
              </div>
              <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'start', alignItems: 'center' }}>
                <span style={{ marginRight: '8px' }}>Status:</span>
                <Switch
                  checked={freelancer.active}
                  onChange={() => handleStatusChange(freelancer.id, !freelancer.active)}
                  style={{ backgroundColor: freelancer.active ? 'green' : 'red' }}
                />
              </div>
              <div style={{ marginTop: '8px' }}>
                <Button type="primary" onClick={() => handleViewProfile(freelancer)} width="100%">View Profile</Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Table columns={columns} dataSource={sortedData} rowKey="id" pagination={false} />
      )}

      <Modal
        title="Freelancer Profile"
        visible={modalVisible}
        onCancel={handleModalClose}
        footer={[
          <Button key="back" onClick={handleModalClose}>
            Close
          </Button>,
        ]}
      >
        {selectedFreelancer && (
          <div className="container">
            <div className="row justify-content-center mb-4">
              <div className="col-12 ">
                <div className="text-center">
                  <Badge count={<img src={selectedFreelancer.profilePic} alt="Profile" style={{ width: '100%', height: 'auto', objectFit: 'cover' }} />} />
                  <h4 className="mt-2">{selectedFreelancer.fname} {selectedFreelancer.lname}</h4>
                  <p>{selectedFreelancer.email}</p>
                </div>
                <div className="d-flex flex-column">
                  <div className="card mb-3">
                    <div className="card-body">
                      <h5 className="card-title">Amount Paid</h5>
                      <p className="card-text">Total Amount Paid: ksh {selectedFreelancer.totalAmountPaid}</p>
                    </div>
                  </div>
                  <div className="card mb-3">
                    <div className="card-body">
                      <h5 className="card-title">Jobs Done</h5>
                      <p className="card-text">Total Jobs Done: {selectedFreelancer.totalSubmittedJobs}</p>
                    </div>
                  </div>
                  <div className="card mb-3">
                    <div className="card-body">
                      <h5 className="card-title">Submitted Jobs</h5>
                      <p className="card-text">Number of Submitted Jobs: {selectedFreelancer.SubmittedJobs.length}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        )}
      </Modal>
      {viewMode === 'list' && (
        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <Button onClick={loadMore}>Load More</Button>
        </div>
      )}
    </div>
  );
};

export default Freelancers;
