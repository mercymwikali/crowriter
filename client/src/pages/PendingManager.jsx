import React, { useState, useEffect } from 'react';
import { Table, Button, Popconfirm, message, Checkbox, Input } from 'antd'; // Import Input component
import { useNavigate } from 'react-router-dom';

const ListPendingManagers = () => {
  const [pendingManagers, setPendingManagers] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQuery, setSearchQuery] = useState(''); // State for search query
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch pending managers from the API or any data source
    // For now, we'll use a static list for demonstration
    const initialPendingManagers = [
      { id: 1, firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com' },
      { id: 2, firstName: 'Jane', lastName: 'Smith', email: 'jane.smith@example.com' },
      // Add more pending managers as needed
    ];
    setPendingManagers(initialPendingManagers);
  }, []);

  const handleViewProfile = (id) => {
    navigate(`/manager/profile/${id}`);
  };

  const handleApprove = (id) => {
    // Logic to approve the pending manager with the given id
    message.success('Manager approved successfully');
  };

  const handleApproveSelected = () => {
    // Logic to approve all selected pending managers
    message.success('Selected managers approved successfully');
  };

  const handleDeleteSelected = () => {
    // Logic to delete all selected pending managers
    setPendingManagers((prevManagers) =>
      prevManagers.filter((manager) => !selectedRows.includes(manager.id))
    );
    setSelectedRows([]);
    message.success('Selected managers deleted successfully');
  };

  const handleSelectionChange = (selectedRowKeys) => {
    setSelectedRows(selectedRowKeys);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredManagers = pendingManagers.filter(manager =>
    manager.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    manager.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    manager.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const rowSelection = {
    selectedRowKeys: selectedRows,
    onChange: handleSelectionChange,
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'First Name',
      dataIndex: 'firstName',
      key: 'firstName',
    },
    {
      title: 'Last Name',
      dataIndex: 'lastName',
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
          <Button type="link" onClick={() => handleViewProfile(record.id)}>
            View Profile
          </Button>
          <Popconfirm
            title="Are you sure you want to approve this manager?"
            onConfirm={() => handleApprove(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link">Approve</Button>
          </Popconfirm>
        </span>
      ),
    },
  ];

  return (
    <div style={{ padding: '40px', background: '#fff', borderRadius: '8px' }}>
      <h2>List of Pending Managers</h2>
      <Input 
        placeholder="Search managers"
        value={searchQuery}
        onChange={handleSearch}
        style={{ marginBottom: '20px', width: '200px' }}
      />
      <div style={{ marginBottom: '20px', flexDirection: 'row', display: 'flex', justifyContent: 'space-between' }}>
        <Checkbox
          indeterminate={selectedRows.length > 0 && selectedRows.length < pendingManagers.length}
          checked={selectedRows.length === pendingManagers.length}
          onChange={(e) => {
            const checked = e.target.checked;
            setSelectedRows(checked ? pendingManagers.map(manager => manager.id) : []);
          }}
        >
          Select All
        </Checkbox>
        <Button type="primary" onClick={handleApproveSelected} disabled={selectedRows.length === 0}>
          Approve Selected
        </Button>
        <Popconfirm
          title="Are you sure you want to delete selected managers?"
          onConfirm={handleDeleteSelected}
          okText="Yes"
          cancelText="No"
          disabled={selectedRows.length === 0}
        >
          <Button danger disabled={selectedRows.length === 0}>Delete Selected</Button>
        </Popconfirm>
      </div>
      <Table columns={columns} dataSource={filteredManagers} rowSelection={rowSelection} rowKey="id" />
    </div>
  );
};

export default ListPendingManagers;
