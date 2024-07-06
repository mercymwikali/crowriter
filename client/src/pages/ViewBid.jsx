import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Modal, Button, Divider, Input } from 'antd';
import { bidsList } from '../actions/BidsAction';
import { assignOrder } from '../actions/assignmentActions';

const PAGE_SIZE = 5;

const ViewBid = ({ selectedJob, handleCloseModal, filteredJobs, setFilteredJobs }) => {
    const dispatch = useDispatch();
    const { loading: assignLoading, success: assignSuccess, error: assignError } = useSelector(state => state.assignOrder);
    const [visible, setVisible] = useState(false);
    const [page, setPage] = useState(1);
    const [dataSource, setDataSource] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (selectedJob) {
            setVisible(true);
            fetchBids();
        }
    }, [selectedJob]);

    // useEffect(() => {
    //     if (assignSuccess) {
    //         if (filteredJobs) {
    //             const updatedJobs = filteredJobs.filter(job => job.id !== selectedJob?.id);
    //             setFilteredJobs(updatedJobs);
    //         }
    //         setVisible(false);
    //         handleCloseModal();
    //     } else if (assignError) {
    //         setVisible(false);
    //         handleCloseModal();
    //     }
    // }, [assignSuccess, assignError, filteredJobs, selectedJob, setFilteredJobs, handleCloseModal]);

    const fetchBids = () => {
        if (selectedJob && selectedJob.freelancer) {
            setLoading(true);
            dispatch(bidsList()).then(() => {
                const bidsData = selectedJob.freelancer.slice(0, PAGE_SIZE * page);
                setDataSource(bidsData);
                setLoading(false);
            });
        }
    };

    const handleCancel = () => {
        setVisible(false);
        handleCloseModal();
    };

    const loadMore = () => {
        setPage(prevPage => prevPage + 1);
        fetchBids();
    };

    const handleHire = (orderId, freelancerId) => {
        dispatch(assignOrder(orderId, freelancerId))
            .then(() => {
                if (assignSuccess) {
                    if (filteredJobs) {
                        const updatedJobs = filteredJobs.filter(job => job.id !== selectedJob?.id);
                        setFilteredJobs(updatedJobs);
                    }
                    setVisible(false);
                    handleCloseModal();
                } else if (assignError) {
                    setVisible(false);
                    handleCloseModal();
                }
            });
    };

    const renderBidCards = () => {
        if (!dataSource || dataSource.length === 0) {
            return <p>No bids available for this job.</p>;
        }

        return dataSource.map(freelancer => (
            <div key={freelancer.id} className="col-12 col-md-4" style={{ padding: '10px' }}>
                <Card style={{ marginBottom: 20 }}>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
                        <img src={freelancer.profilePic} alt="Profile" style={{ width: 50, height: 50, borderRadius: '50%' }} />
                    </div>
                    <p><strong>Username:</strong> {freelancer.fname} {freelancer.lname}</p>
                    <p><strong>Email:</strong> {freelancer.email}</p>
                    <div style={{ textAlign: 'center', marginTop: 10 }}>
                        <Button
                            type="primary"
                            style={{ marginRight: 10 }}
                            onClick={() => handleHire(selectedJob?.id, freelancer.id)}
                            loading={assignLoading}
                        >
                            Hire Them
                        </Button>
                        <Button type="default">View Profile</Button>
                    </div>
                </Card>
            </div>
        ));
    };

    return (
        <Modal
            title={
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>Bids for Job: {selectedJob ? selectedJob.orderId : ''}</div>
                    <div style={{ fontSize: '0.9em', color: 'gray', paddingRight: '10px' }}>
                        Deadline in: {selectedJob ? selectedJob.duration : 'Duration not specified'}
                    </div>
                </div>
            }
            visible={visible}
            onCancel={handleCancel}
            footer={
                <div style={{ display: 'flex', justifyContent: 'end', alignItems: 'center' }}>
                    <Button type="primary" onClick={handleCancel} style={{ marginRight: 10 }}>
                        Close
                    </Button>
                </div>
            }
            width={1000}
            style={{ top: 10, overflow: 'auto' }}
        >
            <div>
                <h4>Order Details</h4>
                <div className="row">
                    <div className="col-12 col-md-6">
                        <p><strong>Service:</strong> <Input readOnly value={selectedJob ? selectedJob.service : ''} /></p>
                    </div>
                    <div className="col-12 col-md-6">
                        <p><strong>Category:</strong> <Input readOnly value={selectedJob ? selectedJob.category : ''} /></p>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 col-md-6">
                        <p><strong>Pages:</strong> <Input readOnly value={selectedJob ? selectedJob.pages : ''} /></p>
                    </div>
                    <div className="col-12 col-md-6">
                        <p><strong>Total Cost:</strong> <Input readOnly value={selectedJob ? selectedJob.amount : ''} /></p>
                    </div>
                </div>
            </div>
            <Divider />
            <h4>Writers Who Sent Bids</h4>
            <div className="d-flex flex-wrap justify-content-start align-items-center">
                {renderBidCards()}
            </div>
            {selectedJob && selectedJob.freelancer && selectedJob.freelancer.length > dataSource.length && (
                <div style={{ textAlign: 'center', marginTop: 20 }}>
                    <Button onClick={loadMore} loading={loading}>
                        Load More
                    </Button>
                </div>
            )}
        </Modal>
    );
};

export default ViewBid;
