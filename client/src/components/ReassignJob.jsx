import { Button, Input, Modal } from 'antd';
import React from 'react';

const ReassignJob = ({ visible, onCancel, selectedOrder }) => {
  return (
    <Modal
      title={`Reassign Job ${selectedOrder?.order?.orderId} to:`}
      visible={visible}
      onOk={onCancel}
      onCancel={onCancel}
      footer={[
        <Button key="back" onClick={onCancel}>Back</Button>,
        <Button key="submit" type="primary">Submit</Button>,
      ]}
    >
      {selectedOrder && selectedOrder.freelancer && selectedOrder.order && (
        <>
        <p>Topic: {selectedOrder.order.topic}</p>
        <Input
          value={selectedOrder.freelancerName || ''}
          readOnly
        />
        </>
      )}
    </Modal>
  );
}

export default ReassignJob;
