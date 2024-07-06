import React, { useState } from 'react';
import { Table, Button, Select, Input } from 'antd';

const { Option } = Select;
const { Search } = Input;

const data = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    phone: '123-456-7890',
    gender: 'Male',
    specialization: 'Academic papers',
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '987-654-3210',
    gender: 'Female',
    specialization: 'Admission papers',
  },
  {
    id: 3,
    name: 'Alice Johnson',
    email: 'alice@example.com',
    phone: '555-555-5555',
    gender: 'Female',
    specialization: 'Dissertation writing',
  },
];

const PendingWriters = () => {
  const [selectedRows, setSelectedRows] = useState([]);

  const handleRowSelectionChange = (selectedRowKeys) => {
    setSelectedRows(selectedRowKeys);
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Phone Number',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      key: 'gender',
      filters: [
        { text: 'Male', value: 'Male' },
        { text: 'Female', value: 'Female' },
      ],
      onFilter: (value, record) => record.gender === value,
    },
    {
      title: 'Specialization',
      dataIndex: 'specialization',
      key: 'specialization',
    },
    {
      title: 'Action',
      key: 'action',
      render: () => (
        <>
          <Button type="primary" style={{ marginRight: 8 }} onClick={() => console.log('View Profile')}>
            View Profile
          </Button>
          <Button type="danger" onClick={() => console.log('Delete')}>
            Delete
          </Button>
        </>
      ),
    },
  ];

  const rowSelection = {
    selectedRowKeys: selectedRows,
    onChange: handleRowSelectionChange,
  };

  return (
    <div>
      <h2>Pending Writers</h2>
      <div style={{ marginBottom: '16px' }}>
        <Search placeholder="Search by name" style={{ width: 200, marginRight: '8px' }} />
        <Select defaultValue="Sort by gender" style={{ marginRight: '8px' }}>
          <Option value="Male">Male</Option>
          <Option value="Female">Female</Option>
        </Select>
        <Select defaultValue="Sort by specialization" style={{ marginRight: '8px' }}>
          <Option value="Academic papers">Academic papers</Option>
          <Option value="Admission papers">Admission papers</Option>
          <Option value="Dissertation writing">Dissertation writing</Option>
        </Select>
      </div>
      <Table rowSelection={rowSelection} columns={columns} dataSource={data} />
    </div>
  );
};

export default PendingWriters;
