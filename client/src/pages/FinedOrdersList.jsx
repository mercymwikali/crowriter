import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Popconfirm, message, Modal, Form, Input } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { deleteFine, finesList, updateFine } from '../actions/fineActions';

const FinedOrdersList = () => {
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedFine, setSelectedFine] = useState(null);
  const [fineAmount, setFineAmount] = useState('');
  const [fineReason, setFineReason] = useState('');

  const dispatch = useDispatch();
  const { loading, error, success, fines } = useSelector((state) => state.fines);
  const { error: deleteError, success: deleteSuccess } = useSelector((state) => state.deleteFine);
  const { error: editError, success: editSuccess } = useSelector((state) => state.editFine);

  useEffect(() => {
    dispatch(finesList());
    
  }, [dispatch, deleteSuccess, editSuccess]);

  const handleDelete = (fineId) => {
    dispatch(deleteFine(fineId)).then(() => {
      message.success('Fine deleted successfully');
      fines.filter((fine) => fine.id !== fineId);
    })
  };

  const handleEdit = (fine) => {
    setSelectedFine(fine);
    setFineAmount(fine.amount);
    setFineReason(fine.reason);
    setEditModalVisible(true);
  };

  const handleEditSubmit = () => {
    const updatedFine = {
      amount: parseInt(fineAmount),
      reason: fineReason,
    };
    dispatch(updateFine(selectedFine.id, updatedFine));
    setEditModalVisible(false);
  };

  const columns = [
    {
      title: 'Order ID',
      dataIndex: ['order', 'orderId'],
      key: 'orderId',
      render: (text, record) => <a href={`#${record.order.orderId}`}>{text}</a>,
    },
    {
      title: 'Topic',
      dataIndex: ['order', 'topic'],
      key: 'topic',
    },
    {
      title: 'Initial Budget',
      dataIndex: ['order', 'amount'],
      key: 'initialBudget',
      render: (text) => `ksh ${text}`,
    },
    {
      title: 'Writer Name',
      dataIndex: ['freelancer', 'fname'],
      key: 'writerName',
    },
    {
      title: 'Fine Amount',
      dataIndex: 'amount',
      key: 'fineAmount',
    },
    {
      title: 'Fine Reason',
      dataIndex: 'reason',
      key: 'fineReason',
    },
    {
      title: 'Date of Fine',
      dataIndex: 'createdAt',
      key: 'dateOfFine',
      render: (text) => `${new Date(text).toLocaleDateString()}`,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <Space size="middle">
          <Button type="primary" onClick={() => handleEdit(record)}>Edit</Button>
          <Popconfirm
            title="Are you sure to delete this fined order?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="danger">Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h2>Fined Orders</h2>
      <Table columns={columns} dataSource={fines} />

      <Modal
        title="Edit Fine"
        visible={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setEditModalVisible(false)}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleEditSubmit}>
            Submit
          </Button>,
        ]}
      >
        <Form layout="vertical">
          <Form.Item label="Fine Amount" required>
            <Input
              type="number"
              value={fineAmount}
              onChange={(e) => setFineAmount(e.target.value)}
            />
          </Form.Item>
          <Form.Item label="Fine Reason" required>
            <Input
              type="text"
              value={fineReason}
              onChange={(e) => setFineReason(e.target.value)}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default FinedOrdersList;
