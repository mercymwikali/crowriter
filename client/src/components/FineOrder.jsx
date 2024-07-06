import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { fineOrder } from '../actions/fineActions';

const FineOrderModal = ({ visible, onCancel, selectedOrder }) => {
    const [fineAmount, setFineAmount] = useState('');
    const [fineReason, setFineReason] = useState('');

    const dispatch = useDispatch();

    const { error, success, loading } = useSelector(state => state.fineOrder);

    useEffect(() => {
        if (success) {
            message.success('Fine submitted successfully');
        }
        if (error) {
            message.error(error);
        }
    }, [success, error]);

    const handleCancel = () => {
        onCancel();
    };

    const handleFineAmountChange = (e) => {
        setFineAmount(e.target.value);
    };

    const handleFineReasonChange = (e) => {
        setFineReason(e.target.value);
    };

    const handleSubmit = () => {
        const payload = {
            orderId: selectedOrder.orderId,
            freelancerId: selectedOrder.freelancer.id, // Adjust the property name if it's different
         //parseInt(fineAmount)  
          amount: parseInt(fineAmount),
            reason: fineReason
        };

        dispatch(fineOrder(payload));
 if (success) {
            message.success('Fine submitted successfully');
            setFineAmount('');
            selectedOrder = null;
            setFineReason('');
        }
        onCancel();
    };

    return (
        <Modal
            title="Fine Order"
            visible={visible}
            onCancel={handleCancel}
            footer={[
                <Button key="cancel" onClick={handleCancel}>
                    Cancel
                </Button>,
                <Button key="submit" type="primary" onClick={handleSubmit}>
                    Submit
                </Button>,
            ]}
            style={{ top: 20 }}
        >
            {selectedOrder && (
                <div>
                    <p><strong>Order ID:</strong> {selectedOrder.order.orderId}</p>
                    <p><strong>Freelancer:</strong> {selectedOrder.freelancer.fname}</p>
                    <Form
                        layout="vertical"
                        onFinish={handleSubmit}
                    >
                        <Form.Item
                            label="Fine Amount"
                            name="fineAmount"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please enter fine amount',
                                },
                            ]}
                        >
                            <Input
                                type="number"
                                value={fineAmount}
                                onChange={handleFineAmountChange}
                            />
                        </Form.Item>
                        <Form.Item
                            label="Fine Reason"
                            name="fineReason"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please enter fine reason',
                                },
                            ]}
                        >
                            <Input
                                type="text"
                                value={fineReason}
                                onChange={handleFineReasonChange}
                            />
                        </Form.Item>
                    </Form>
                </div>
            )}
        </Modal>
    );
};

export default FineOrderModal;
