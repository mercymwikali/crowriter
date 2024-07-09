import { Button, DatePicker, Input, Modal } from 'antd';
import React from 'react';

const ReDoOrder = ({ visible, onCancel, selectedOrder }) => {
  return (
    <Modal
      title={`${selectedOrder?.freelancer?.fname} needs to re-Do Order ${selectedOrder?.order?.orderId}:`}
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
        <label className='mt-3'>Submit By:</label>
        <DatePicker showTime value={selectedOrder.freelancerName || ''}  className='w-100' />
        <br></br>
        <label className='mt-3'>Additional Notes: </label>
        <Input.TextArea
          rows={4}
          value={selectedOrder.freelancerName || ''}
          readOnly
        />
        </>
      )}
    </Modal>
  );
}

export default ReDoOrder;
