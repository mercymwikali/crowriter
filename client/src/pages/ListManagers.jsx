import React, { useState, useEffect } from 'react';
import { Table, Button, Popconfirm, message, Input, Card, Row, Col, Switch, Modal, Avatar, InputNumber } from 'antd';
import { AppstoreOutlined, BarsOutlined, UserOutlined } from '@ant-design/icons';
import { FaUserAlt } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { managersList, } from '../actions/userActions'; // Adjust import paths as per your project structure

const ListManagers = () => {
  const [filteredManagers, setFilteredManagers] = useState([]);
  const [viewMode, setViewMode] = useState('List');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedManager, setSelectedManager] = useState(null);
  const dispatch = useDispatch();

  const { loading, error, managers } = useSelector(state => state.managersList);

  useEffect(() => {
    dispatch(managersList()); // Dispatch action to fetch managers
  }, [dispatch]);

  useEffect(() => {
    if (managers) {
      setFilteredManagers(managers); // Set filtered managers initially
    }
  }, [managers]);

  const handleDeactivate = (id) => {
    // dispatch(deactivateManager(id)); // Dispatch action to deactivate manager
    message.success('Manager deactivated successfully');
  };

  const handleDelete = (id) => {
    // dispatch(deleteManager(id)); // Dispatch action to delete manager
    message.success('Manager deleted successfully');
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    const filtered = managers.filter(
      manager =>
        manager.fname.toLowerCase().includes(value) ||
        manager.lname.toLowerCase().includes(value) ||
        manager.email.toLowerCase().includes(value)
    );
    setFilteredManagers(filtered);
  };

  const handleStatusChange = (checked, managerId) => {
    // Update manager status locally and dispatch action to update in backend
    const updatedManagers = filteredManagers.map(manager =>
      manager.id === managerId ? { ...manager, active: checked } : manager
    );
    setFilteredManagers(updatedManagers);
    message.success(`Manager ${checked ? 'activated' : 'deactivated'} successfully`);
  };

  const handleViewDetails = (manager) => {
    setSelectedManager(manager);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const modalFooter = [
    <Button key="close" onClick={closeModal}>
      Close
    </Button>
  ];

  const columns = [
    {
      title: 'ID',
      key: 'index',
      render: (text, record, index) => index + 1,
    },
    {
      title: 'First Name',
      dataIndex: 'fname',
      key: 'firstName',
    },
    {
      title: 'Last Name',
      dataIndex: 'lname',
      key: 'lastName',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <span>
          <Button type="link" onClick={() => handleViewDetails(record)}>
            View Details
          </Button>
          <Popconfirm
            title="Are you sure you want to deactivate this manager?"
            onConfirm={() => handleDeactivate(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" disabled={!record.active}>
              {record.active ? 'Deactivate' : 'Activate'}
            </Button>
          </Popconfirm>
          <Popconfirm
            title="Are you sure you want to delete this manager?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger>
              Delete
            </Button>
          </Popconfirm>
        </span>
      ),
    },
  ];

  return (
    <div style={{ padding: '40px', background: '#fff', borderRadius: '8px' }}>
      <h2>List of Managers</h2>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <Input.Search
          placeholder="Search managers"
          onChange={handleSearch}
          style={{ width: '300px' }}
        />
        <Button
          type="primary"
          icon={viewMode === 'List' ? <AppstoreOutlined /> : <BarsOutlined />}
          onClick={() => setViewMode(viewMode === 'List' ? 'Grid' : 'List')}
        >
          {viewMode === 'List' ? 'Grid View' : 'List View'}
        </Button>
      </div>
      {viewMode === 'List' ? (
        <Table columns={columns} dataSource={filteredManagers} rowKey="id" onRow={(record, rowIndex) => ({
          onClick: () => handleViewDetails(record),
        })} />
      ) : (
        <Row gutter={[16, 16]}>
          {filteredManagers.map(manager => (
            <Col key={manager.id} xs={24} sm={12} md={8} lg={6}>
              <Card
                title={`${manager.fname} ${manager.lname}`}
              >
                <div className="text-center">
                  <Avatar size={100} icon={<FaUserAlt />} />
                  <p>Email: {manager.email}</p>
                  <p>Status: <span style={{ color: manager.active ? 'green' : 'red' }}>{manager.active ? 'Active' : 'Inactive'}</span></p>
                </div>
                <div>
                  <Button type="primary" onClick={() => handleViewDetails(manager)} style={{ width: '100%', marginBottom: '10px' }}>
                    View Details
                  </Button>
                  <Popconfirm
                    title="Are you sure you want to deactivate this manager?"
                    onConfirm={() => handleDeactivate(manager.id)}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button type="primary" disabled={!manager.active} style={{ marginRight: '10px', width: '100%', }} ghost>
                      Deactivate
                    </Button>
                  </Popconfirm>
                  <Popconfirm
                    title="Are you sure you want to delete this manager?"
                    onConfirm={() => handleDelete(manager.id)}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button type="primary" danger style={{ width: '100%', marginTop: '10px' }}>
                      Delete
                    </Button>
                  </Popconfirm>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Modal for displaying additional details */}
      <Modal
  title="Manager Details"
  visible={modalVisible}
  footer={modalFooter}
  onCancel={closeModal}
  style={{ maxWidth: '1000px', top: 20 }}
>
  {selectedManager && (
    <div style={{ padding: '20px' }}>
      <p className='mb-3 d-flex flex-column align-items-center'>
        <strong>Profile Picture:</strong> 
        <Avatar shape="square" icon={<UserOutlined />} size={100} src={selectedManager.profilePic} />
      </p>

      <p><strong>Full Name:</strong> {`${selectedManager.fname} ${selectedManager.lname}`}</p>
      <p><strong>Email:</strong> {selectedManager.email}</p>
      <p><strong>Status:</strong> <Switch checked={selectedManager.active} onChange={(checked) => handleStatusChange(checked, selectedManager.id)} /></p>

      <p className='mb-3'>
        <strong>Experience:</strong>
        <Input value={selectedManager.experience || 'Not applicable'} readOnly />
      </p>
      <p className='mb-3'>
        <strong>Leadership Style:</strong>
        <Input value={selectedManager.leadershipStyle || 'Not applicable'} readOnly />
      </p>
      <p className='mb-3'>
        <strong>Team Size:</strong>
        <InputNumber value={selectedManager.teamSize || 0} readOnly style={{ width: '100px' }} />
      </p>
      <p className='mb-3'>
        <strong>Achievements:</strong>
        <Input value={selectedManager.achievements || 'Not applicable'} readOnly />
      </p>
      <p className='mb-3'>
        <strong>Professional Development:</strong>
        <Input value={selectedManager.professionalDevelopment || 'Not applicable'} readOnly />
      </p>
    </div>
  )}
</Modal>

    </div>
  );
};

export default ListManagers;
