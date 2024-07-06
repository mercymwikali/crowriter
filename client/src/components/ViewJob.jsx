import { Button, Input, Modal, Typography } from 'antd';
import React from 'react';

const ViewJob = ({ onCancel, visible, selectedJob }) => {
    const extractInstructions = (instructions) => {
        if (!instructions) return '';
        return instructions.replace(/<p>/g, '').replace(/<\/p>/g, '');
    };


    return (
        <div>
            <Modal
                title={
                    selectedJob && (
                        <>
                            <Typography.Title level={4}>Job Details</Typography.Title>
                            <Typography.Title level={5}>Order ID: {selectedJob.orderId}</Typography.Title>
                        </>
                    )
                }
                visible={visible} // Corrected prop name from open to visible
                onCancel={onCancel}
                footer={[
                    <Button key="close" onClick={onCancel}>
                        Close
                    </Button>,
                ]}
                width={1000}
                style={{ top: 20, overflow: 'auto' }}
            >
                {selectedJob && ( // Added null check for selectedJob
                    <>
                        <div className="row">
                            <div className="col-12 col-md-4  gap-3 mb-3">
                                <h6 level={5}>Topic:</h6> <Input value={selectedJob.topic} />
                            </div>
                            <div className="col-12 col-md-4  gap-3 mb-3">
                                <h6 level={5}>category: </h6> <Input value={selectedJob.category} />
                            </div>
                            <div className="col-12 col-md-4  gap-3 mb-3">
                                <h6 level={5}>No of Sources:</h6> <Input value={selectedJob.sources} />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12 col-md-4 gap-3 mb-3">
                                <h6 level={5}>Citation:</h6> <Input value={selectedJob.citation} />
                            </div>
                            <div className="col-12 col-md-4  gap-3 mb-3">
                                <h6 level={5}>No of Pages:</h6> <Input value={selectedJob.pages} />
                            </div>
                            <div className="col-12 col-md-4  gap-3 mb-3">
                                <h6 level={5}>Cost per Page:</h6> <Input value={selectedJob.cpp} />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12 col-md-4  gap-3 mb-3">
                                <h6>Budget:</h6> <Input value={selectedJob.amount} />
                            </div>
                            <div className="col-12 col-md-4 gap-3 mb-3">
                            <h6 level={5}>Due in:</h6> <Input value={selectedJob.duration} />
                            </div>
                            <div className="col-12 col-md-4">
                                <h6 level={5}>Submission Date:</h6> <Input value={new Date(selectedJob.deadline).toLocaleDateString()} />
                            </div>
                            <div className="col-12  gap-3 mb-3">
                                <h6 level={5}>Job Description:</h6> <Input.TextArea value={extractInstructions(selectedJob.instructions)} />
                            </div>
                            <div className="col-12 gap-3 mb-3">
                                <h6 level={5}>Additional Information:</h6> <Input.TextArea value={selectedJob.additionalNotes} />

                            </div>
                        </div>
                    </>
                )}

            </Modal>
        </div>
    );
};

export default ViewJob;
