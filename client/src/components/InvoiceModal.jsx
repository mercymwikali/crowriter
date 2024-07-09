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

  const calculateTotalRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;

    const total = reviews.reduce((acc, review) => acc + review.rating, 0);
    return total / reviews.length;
  };

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
      key: 'amount',
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
        const fine = record.fines.length > 0 ? `Ksh ${record.fines[0].amount}` : 'No fine';
        return fine;
      },
    },
    {
      title: 'Amount to be paid',
      dataIndex: 'finalAmount',
      key: 'finalAmount',
      render: (text, record) => {
        const fine = record.fines.length > 0 ? record.fines[0].amount : 0;
        return `Ksh ${record.amount - fine}`;
      },
    },
  ];

  // Calculate total amount to be paid across all orders
  const calculateTotalAmountToBePaid = () => {
    if (!invoice || !invoice.orders) return 0;

    let totalAmount = 0;
    invoice.orders.forEach((order) => {
      const fine = order.fines.length > 0 ? order.fines[0].amount : 0;
      totalAmount += order.amount - fine;
    });

    return totalAmount;
  };

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
            <Rate disabled defaultValue={calculateTotalRating(invoice.orders.reviews)} />
          </div>
        ) : (
          'Invoice Details Not Available'
        )
      }
      visible={visible}
      onOk={onOk}
      onCancel={onCancel}
      footer={
        <div className="d-flex justify-content-between">
          <Typography.Title level={5} className="mt-3 text-end">Total Amount to be Paid: Ksh {calculateTotalAmountToBePaid()}</Typography.Title>
          <div className='d-flex gap-3'>
            <Button onClick={onCancel}>Cancel</Button>
            <Button type="primary" onClick={() => message.success('Approved')} loading={loading}>
              Approve Invoice
            </Button>
          </div>
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
        <Table columns={columns} dataSource={invoice.orders} pagination={false} scroll={{ x: 'max-content' }} />
      )}
    </Modal>
  );
};

export default InvoiceModal;
