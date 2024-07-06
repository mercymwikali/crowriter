import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { listInvoices, createInvoice, updateInvoice, deleteInvoice } from '../actions/invoiceActions';
import { Typography, Table, Button, InputNumber, Input, Popconfirm, message as antdMessage } from 'antd'; // Alias to avoid conflict
import useAuth from '../hooks/useAuth';
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';

const { Title, Text } = Typography;

const InvoiceComponent = () => {
  const dispatch = useDispatch();

  const invoiceList = useSelector(state => state.invoiceList);
  const { loading, error: listError, invoices } = invoiceList;

  const invoiceCreate = useSelector(state => state.invoiceCreate);
  const { success: successCreate, invoice, error: errorCreate } = invoiceCreate;

  const invoiceUpdate = useSelector(state => state.invoiceUpdate);
  const { success: successUpdate, error: errorUpdate } = invoiceUpdate;

  const invoiceDelete = useSelector(state => state.invoiceDelete);
  const { success: successDelete, error: errorDelete } = invoiceDelete;

  const [invoiceItems, setInvoiceItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [invoiceDate, setInvoiceDate] = useState('');
  const [isDraft, setIsDraft] = useState(false);

  const user = useAuth();

  useEffect(() => {
    dispatch(listInvoices());

    const generatedInvoiceNumber = getNextInvoiceNumber();
    const generateInvoiceDate = () => {
      const currentDate = new Date();
      return currentDate.toISOString().split('T')[0];
    };

    setInvoiceNumber(generatedInvoiceNumber);
    setInvoiceDate(generateInvoiceDate());
  }, [dispatch, successCreate, successUpdate, successDelete, user.user.id, errorCreate, errorUpdate, errorDelete]);

  const getNextInvoiceNumber = () => {
    const latestInvoiceNumber = localStorage.getItem('latestInvoiceNumber') || '0000';
    const nextInvoiceNumber = (parseInt(latestInvoiceNumber, 10) + 1).toString().padStart(4, '0');
    localStorage.setItem('latestInvoiceNumber', nextInvoiceNumber);
    return `INV-${nextInvoiceNumber}`;
  };

  const calculateTotalAmount = (items) => {
    return items.reduce((acc, item) => acc + item.total, 0);
  };

  const handleAddRow = () => {
    const newKey = (invoiceItems.length + 1).toString();
    const newItem = { key: newKey, OrderId: '', 'No-of-Pages': 0, 'Cost Per Page': 0, total: 0 };
    setInvoiceItems([...invoiceItems, newItem]);
  };

  const handleDeleteRow = (key) => {
    const newItems = invoiceItems.filter(item => item.key !== key);
    setInvoiceItems(newItems);
    setTotalAmount(calculateTotalAmount(newItems));
  };

  const handleInputChange = (key, field, value) => {
    const newItems = invoiceItems.map(item => {
      if (item.key === key) {
        const updatedItem = { ...item, [field]: value };
        if (field === 'No-of-Pages' || field === 'Cost Per Page') {
          updatedItem.total = updatedItem['No-of-Pages'] * updatedItem['Cost Per Page'];
        }
        return updatedItem;
      }
      return item;
    });
    setInvoiceItems(newItems);
    setTotalAmount(calculateTotalAmount(newItems));
  };

  const handleRequestPayment = () => {
    const newInvoice = {
      invoiceNumber,
      userId: user.user.id,
      orders: invoiceItems.map(item => item.OrderId).filter(orderId => orderId), 
      payments: [],
      isDraft: false,
      totalAmount: totalAmount, // Include total amount in the invoice data
    };
    dispatch(createInvoice(newInvoice));
    clearInvoiceForm();
  };

  const handleSaveDraft = () => {
    const newInvoice = {
      invoiceNumber,
      userId: user.user.id,
      orders: invoiceItems.map(item => item.OrderId).filter(orderId => orderId), // Ensure non-empty OrderId
      payments: [],
      isDraft: true,
    };
    dispatch(createInvoice(newInvoice));
    clearInvoiceForm();
    antdMessage.success('Invoice saved as draft!');
  };

  const clearInvoiceForm = () => {
    setInvoiceItems([]);
    setTotalAmount(0);
    setInvoiceNumber(getNextInvoiceNumber());
  };

  const handlePrintOrDownload = () => {
    const doc = new jsPDF();
    doc.text(`Invoice Number: ${invoiceNumber}`, 10, 10);
    doc.text(`Invoice Date: ${invoiceDate}`, 10, 20);
    doc.text(`User: ${user.user.fname} (${user.user.email})`, 10, 30);

    autoTable(doc, {
      head: [['Order ID', 'Topic', 'No. of Pages', 'Cost Per Page', 'Total']],
      body: invoiceItems.map(item => [
        item.OrderId,
        item.Topic || '',
        item['No-of-Pages'],
        item['Cost Per Page'],
        item.total,
      ]),
    });

    doc.text(`Total Amount: ksh ${totalAmount.toFixed(2)}`, 10, 80);
    doc.save(`Invoice_${invoiceNumber}.pdf`);
  };

  const columns = [
    {
      title: 'Order ID',
      dataIndex: 'OrderId',
      key: 'OrderId',
      render: (text, record) => (
        <Input
          value={text}
          onChange={(e) => handleInputChange(record.key, 'OrderId', e.target.value)}
        />
      ),
    },
    {
      title: 'Topic',
      dataIndex: 'Topic',
      key: 'Topic',
      render: (text, record) => (
        <Input
          value={text}
          onChange={(e) => handleInputChange(record.key, 'Topic', e.target.value)}
        />
      ),
    },
    {
      title: 'No. of Pages',
      dataIndex: 'No-of-Pages',
      key: 'No-of-Pages',
      render: (text, record) => (
        <InputNumber
          min={0}
          value={text}
          onChange={(value) => handleInputChange(record.key, 'No-of-Pages', value)}
        />
      ),
    },
    {
      title: 'Cost Per Page',
      dataIndex: 'Cost Per Page',
      key: 'Cost Per Page',
      render: (text, record) => (
        <InputNumber
          min={0}
          value={text}
          onChange={(value) => handleInputChange(record.key, 'Cost Per Page', value)}
        />
      ),
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      render: (text) => `ksh ${text.toFixed(2)}`,
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <Popconfirm title="Sure to delete?" onConfirm={() => handleDeleteRow(record.key)}>
          <Button type="link" danger>Delete</Button>
        </Popconfirm>
      ),
    },
  ];

  // useEffect(() => {
  //   if (errorCreate) {
  //     antdMessage.error(errorCreate);
  //   }
  // }, [errorCreate]);

  return (
    <div className="inv-container mt-5">
      <div className="inv-header">
        <div className="invoice-info">
          <Title level={2}>Invoice</Title>
          <Text>Invoice Number: {invoiceNumber}</Text><br />
          <Text>Invoice Date: {invoiceDate}</Text><br />
        </div>

        <div className="user-info">
          <Text strong>{user.user.fname}</Text><br />
          <Text>{user.user.email}</Text>
        </div>
      </div>

      {loading ? (
        <Text>Loading...</Text>
      ) : listError ? (
        <Text type="danger">{listError}</Text>
      ) : (
        <Table
          dataSource={invoiceItems}
          columns={columns}
          pagination={false}
          bordered
          footer={() => (
            <div className="text-right">
              <Text strong>Total: ksh {totalAmount.toFixed(2)}</Text>
            </div>
          )}
        />
      )}

      <div className="actions">
        <Button type="primary" onClick={handleAddRow}>Add Item</Button>
        <Button type="primary" disabled={!invoiceItems.length} onClick={handleRequestPayment}>
          Request Payment
        </Button>
        <Button type="default" disabled={!invoiceItems.length} onClick={handleSaveDraft}>
          Save Draft
        </Button>
        <Button type="default" disabled={!invoiceItems.length} onClick={handlePrintOrDownload}>
          Print/Download PDF
        </Button>
      </div>
    </div>
  );
};

export default InvoiceComponent;
