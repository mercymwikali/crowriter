import { Button, Modal, message } from 'antd';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createBid } from '../actions/BidsAction';
import useAuth from '../hooks/useAuth';

const FreelancerBid = ({ visible, setModalVisible, job, onBidSuccess }) => {
    const dispatch = useDispatch();
    const { loading, error, success } = useSelector(state => state.createBid);
    const { user } = useAuth();
    const freelancerId = user.id;

    const handleBid = () => {
        if (job && freelancerId) {
            dispatch(createBid(job.id, freelancerId)).then(() => {
                if (success) {
                    // message.success('Bid created successfully');
                    onBidSuccess(job);
                    setModalVisible(false);
                } else if (error) {
                    message.error('Error creating bid');
                }
            });
        }
    };

    return (
        <Modal
            title={job ? `Order ID: ${job.orderId}` : 'No order ID'}
            visible={visible}
            onOk={() => setModalVisible(false)}
            onCancel={() => setModalVisible(false)}
            footer={[
                <Button type="primary" loading={loading} onClick={handleBid} key="place-bid" disabled={loading}>
                    Place Bid
                </Button>,
                <Button type="primary" onClick={() => setModalVisible(false)} ghost key="close">
                    Close
                </Button>
            ]}
        >
            {job ? (
                <div>
                    <p><strong>Topic:</strong> {job.topic}</p>
                    <p><strong>Budget:</strong> ksh {job.amount}</p>
                    <p><strong>Due In:</strong> {job.duration}</p>
                    <p><strong>Deadline:</strong> {new Date(job.deadline).toLocaleDateString()}</p>
                </div>
            ) : (
                <p>No job details available</p>
            )}
        </Modal>
    );
};

export default FreelancerBid;
