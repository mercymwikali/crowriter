import React, { useEffect } from 'react';
import { Button, Modal, Table, Typography, Rate, message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { getInvoiceDetails } from '../actions/invoiceActions';

const InvoiceModal = ({ visible, onOk, onCancel, selectedInvoice }) => {
  const dispatch = useDispatch();

  const invoiceDetails = useSelector((state) => state.invoiceDetails);
  const { error, loading, success, invoice } = invoiceDetails;

  useEffect(() => {
    if (selectedInvoice) {
      dispatch(getInvoiceDetails(selectedInvoice.id));
    }
  }, [dispatch, selectedInvoice]);

  const columns = [
    {
      title: 'Order ID',
      dataIndex: 'orderId',
      key: 'orderId',
      render: (text, record) => <a href={`#${record.orderId}`}>{text}</a>,
    },
    {
      title: 'Job Topic',
      dataIndex: 'topic',
      key: 'topic',
    },
    {
      title: 'Claiming Amount',
      dataIndex: 'amount',
      key: 'budget',
      render: (text) => `Ksh ${text}`,
    },
    {
      title: 'Invoice Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text) => new Date(text).toLocaleDateString(),
    },
    {
      title: 'Fine',
      dataIndex: 'fine',
      key: 'fine',
      render: (text, record) => {
        const fine = invoice.fines.find((f) => f.orderId === record.id);
        return fine ? `Ksh ${fine.amount}` : 'No fine';
      },
    },
    {
      title: 'Amount to be paid',
      dataIndex: 'finalAmount',
      key: 'finalAmount',
      render: (text, record) => {
        const fine = invoice.fines.find((f) => f.orderId === record.id)?.amount || 0;
        return `Ksh ${record.amount - fine}`;
      },
    },
  ];

  return (
    <Modal
      title={
        selectedInvoice && invoice && invoice.user ? (
          <div>
            <Typography.Title level={4}>
              {invoice.user.fname} {invoice.user.lname} Invoice Details
            </Typography.Title>
            <Typography.Text>Email: {invoice.user.email}</Typography.Text>
            <br />
            <Rate disabled defaultValue={invoice.reviews.rating} />
          </div>
        ) : (
          'Invoice Details Not Available'
        )
      }
      visible={visible}
      onOk={onOk}
      onCancel={onCancel}
      footer={
        <div className="d-flex justify-content-end gap-3">
          <Button onClick={onCancel}>Cancel</Button>
          <Button type="primary" onClick={() =>message.success('Approved')} loading={loading}>
            Approve Invoice
          </Button>
        </div>
      }
      width="80%"
      destroyOnClose
      
      confirmLoading={loading}
      maskClosable
      closable
      style={{ top: 20 }}
    >
      {invoice && (
        <Table
          columns={columns}
          dataSource={invoice.orders}
          pagination={false}
          scroll={{ x: 'max-content' }}
        />
      )}
    </Modal>
  );
};

export default InvoiceModal;
