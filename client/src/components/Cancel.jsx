import React from 'react';
import { Modal, Button } from 'antd';

const CancelConfirmation = ({ visible, onCancel, onConfirm }) => {
  return (
    <Modal
      title="Confirm Order Cancellation"
      visible={visible}
      onCancel={onCancel}
      footer={[
        <Button key="back" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={onConfirm}>
          Confirm
        </Button>,
      ]}
    >
      <p>Are you sure you want to cancel this order?</p>
    </Modal>
  );
};

export default CancelConfirmation;
