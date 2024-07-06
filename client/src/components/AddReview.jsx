import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Rate, Button, Avatar, message } from 'antd';
import { FaUserAlt } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { rateFreelancer } from '../actions/ratingActions';
import useAuth from '../hooks/useAuth';

const AddReviewModal = ({ visible, onCancel, selectedOrder }) => {
    const [review, setReview] = useState('');
    const [rating, setRating] = useState(0);
    const dispatch = useDispatch();

    const { error, success, loading } = useSelector(state => state.review);
    const auth = useAuth();

    // useEffect(() => {
    //     if (success || error) {
    //         setReview('');
    //         setRating(0);
    //         message.success('Review added successfully');
    //     }
    // }, [success]);

    const handleCancel = () => {
        onCancel();
    };

    const handleReviewChange = (e) => {
        setReview(e.target.value);
    };

    const handleRatingChange = (value) => {
        setRating(value);
    };

    const handleSubmit = () => {
        if (selectedOrder && selectedOrder.freelancer && selectedOrder.order) {
            const reviewData = {
                orderId: selectedOrder.orderId,
                reviewerId: auth.user.id,
                freelancerId: selectedOrder.freelancer.id,
                rating,
                comment: review,
            };
            dispatch(rateFreelancer(reviewData));

        }

        if (success || error) {
            setReview('');
            setRating(0);
            setReview('');

        }

        onCancel();
    };

    const modalTitle = selectedOrder && selectedOrder.order
        ? `Add Review for Order ${selectedOrder.order.orderId}: ${selectedOrder.order.topic}`
        : 'Add Review';

    return (
        <Modal
            title={modalTitle}
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
            {selectedOrder && selectedOrder.freelancer && (
                <Form layout="vertical">
                    <div className="text-center">
                        <Avatar
                            src={selectedOrder.freelancer.profilePic || ''}
                            size="large"
                            style={{ width: '70px', height: '70px' }}
                            icon={<FaUserAlt />}
                        />
                        <h5>{`${selectedOrder.freelancer.fname} ${selectedOrder.freelancer.lname}`}</h5>
                        <p>{selectedOrder.freelancer.email}</p>
                    </div>
                    <Form.Item label="Star Rating">
                        <Rate value={rating} onChange={handleRatingChange} />
                    </Form.Item>
                    <Form.Item label="Review">
                        <Input.TextArea rows={4} value={review} onChange={handleReviewChange} />
                    </Form.Item>
                </Form>
            )}
        </Modal>
    );
};

export default AddReviewModal;
