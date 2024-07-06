import React, { useEffect, useState } from 'react';
import { Table, Input } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { paymentList } from '../actions/paymentActions';

const { Search } = Input;

const columns = [
  {
    title: 'Writer Name',
    dataIndex: 'writerName',
    key: 'writerName',
    render: (text, record) => `${record.user.fname} ${record.user.lname}`,
  },
  {
    title: 'Invoice',
    dataIndex: 'invoice',
    key: 'invoice',
    render: (text, record) => record.paymentRef,
  },
  {
    title: 'Amount Paid',
    dataIndex: 'amountPaid',
    key: 'amountPaid',
    render: (text, record) => `ksh ${record.amount}`,
  },
  {
    title: 'Payment Method',
    dataIndex: 'paymentMethod',
    key: 'paymentMethod',
    render: (text, record) => record.modeOfPayment,
  },
  {
    title: 'Date Paid',
    dataIndex: 'datePaid',
    key: 'datePaid',
    render: (text, record) => record.createdAt.split('T')[0],
  },
];

const PaidInvoices = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  const dispatch = useDispatch();
  const paidInvoices = useSelector(state => state.paymentList);
  const { loading: paidInvoicesLoading, error, payments } = paidInvoices;

  useEffect(() => {
    dispatch(paymentList());
  }, [dispatch]);

  useEffect(() => {
    setFilteredData(payments); // Set initial data to payments from Redux store
  }, [payments]);

  const handleSearch = (value) => {
    setSearchQuery(value);
    const filtered = payments.filter(item =>
      item.user.fname.toLowerCase().includes(value.toLowerCase()) ||
      item.paymentRef.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(filtered);
  };

  return (
    <div>
      <h2>Paid Invoices</h2>
      <Search
        placeholder="Search by writer name or invoice number"
        allowClear
        enterButton="Search"
        onSearch={handleSearch}
        style={{ marginBottom: 16 }}
      />
      <Table columns={columns} dataSource={filteredData} />
    </div>
  );
};

export default PaidInvoices;
