import React, { useEffect, useState } from 'react';
import { Avatar, List, Typography, Input, Select, DatePicker, Button, Table, Segmented } from 'antd';
import { AppstoreOutlined, BarsOutlined } from '@ant-design/icons';
import InvoiceModal from '../components/InvoiceModal';
import PaymentModal from '../components/PayInvoice';
import { useDispatch, useSelector } from 'react-redux';
import { listInvoices } from '../actions/invoiceActions';

const { Option } = Select;
const { RangePicker } = DatePicker;

const ViewInvoices = () => {
  const [viewMode, setViewMode] = useState('Table');
  const [invoiceModalVisible, setInvoiceModalVisible] = useState(false);
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const dispatch = useDispatch();
  const invoiceList = useSelector(state => state.invoiceList);
  const { loading, error, invoices } = invoiceList;

  const handleViewModeChange = value => {
    setViewMode(value);
  };

  const handleViewInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setInvoiceModalVisible(true);
  };

  const handlePayInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setPaymentModalVisible(true);
  };

  const handleCancel = () => {
    setInvoiceModalVisible(false);
    setPaymentModalVisible(false);
    setSelectedInvoice(null); // Clear selected invoice
  };

  useEffect(() => {
    dispatch(listInvoices());
  }, [dispatch]);

  const columns = [
    {
      title: 'First Name',
      dataIndex: ['user', 'fname'],
      key: 'fname',
    },
    {
      title: 'Last Name',
      dataIndex: ['user', 'lname'],
      key: 'lname',
    },
    {
      title: 'Invoice Number',
      dataIndex: 'invoiceNumber',
      key: 'invoiceNumber',
      render: (text, record) => <a href={`#${record.orderId}`}>{text}</a>,
    },
    {
      title: 'Amount',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: text => `Ksh ${text}`,
    },
    {
      title: 'Submission Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: text => new Date(text).toLocaleDateString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <span>
          <Button type="primary" onClick={() => handleViewInvoice(record)}>View Invoice</Button>
          <Button type="default" onClick={() => handlePayInvoice(record)}>Pay Invoice</Button>
        </span>
      ),
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
        <Typography.Title level={2} style={{ textAlign: 'center' }}>View Invoice List</Typography.Title>
        <div className='d-flex align-items-center justify-content-end'>
          <Typography.Title level={5} style={{ marginRight: '16px', color: '#ff4500' }}>View Mode:</Typography.Title>
          <Segmented
            options={[
              { value: 'List', icon: <BarsOutlined /> },
              { value: 'Table', icon: <AppstoreOutlined /> },
            ]}
            value={viewMode}
            onChange={handleViewModeChange}
            style={{ marginRight: '16px' }}
          />
        </div>
      </div>
      <div style={{ display: 'flex', marginBottom: '16px' }}>
        <Input placeholder="Search by name" style={{ marginRight: '16px' }} />
        <Select placeholder="Filter by user" style={{ marginRight: '16px' }}>
          <Option value="test">test</Option>
        </Select>
        <RangePicker style={{ flex: 'auto' }} />
      </div>
      {viewMode === 'List' ? (
        <List
          itemLayout="horizontal"
          dataSource={invoices}
          renderItem={(item, index) => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar>{index + 1}</Avatar>}
                title={<Typography.Text strong>Order ID: {item.orderId}</Typography.Text>}
                description={
                  <div>
                    <Typography.Text strong>Name:</Typography.Text> {item.user.fname} {item.user.lname}<br />
                    <Typography.Text strong>Amount:</Typography.Text> {item.totalAmount}<br />
                    <Typography.Text strong>Submission Date:</Typography.Text> {new Date(item.createdAt).toLocaleDateString()}
                  </div>
                }
                style={{ cursor: 'pointer' }}
              />
              <div className="d-flex justify-content-end gap-3">
                <Button type="primary" onClick={() => handleViewInvoice(item)}>View Invoice</Button>
                <Button type="default" onClick={() => handlePayInvoice(item)}>Pay Invoice</Button>
              </div>
            </List.Item>
          )}
        />
      ) : (
        <Table
          columns={columns}
          dataSource={invoices}
          pagination={false}
        />
      )}
      <InvoiceModal visible={invoiceModalVisible} onOk={handleCancel} onCancel={handleCancel} selectedInvoice={selectedInvoice} />
      <PaymentModal visible={paymentModalVisible} onOk={handleCancel} onCancel={handleCancel}  selectedInvoice={selectedInvoice} />
    </div>
  );
};

export default ViewInvoices;
