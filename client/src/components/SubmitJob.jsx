import React, { useRef, useState } from 'react';
import { Modal, Button, Divider, message, Upload, Progress } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useSelector } from 'react-redux';

const { Dragger } = Upload;

const SubmitJob = ({ onCancel, handleSubmit, selectedJob, open }) => {
    const [fileList, setFileList] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [errMsg, setErrMsg] = useState('');
    const dropRef = useRef(null);

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    const handleUpload = async (options) => {
        const { onSuccess, onError, file, onProgress } = options;

        const formData = new FormData();
        formData.append('file', file);
        formData.append('orderId', selectedJob?.id);
        formData.append('freelancerId', selectedJob?.freelancerId);

        console.log('orderId:', selectedJob?.id);
        console.log('freelancerId:', selectedJob?.freelancerId);
        setUploading(true);
        setProgress(0);

        try {
            const response = await axios.post('http://localhost:3001/uploads/submissionUploads', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${userInfo.accessToken}`,
                },
                onUploadProgress: progressEvent => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setProgress(percentCompleted);
                    onProgress({ percent: percentCompleted });
                },
            });
            if (response.status === 200) {
                onSuccess("Ok");
                // message.success('File uploaded successfully.');
                setUploading(false);
                setProgress(0);
                onCancel();  // Close the modal on success
            } else {
                setUploading(false);
                setProgress(0);
                onError({ error: 'Failed to upload file.' });
            }

           
        } catch (error) {
            console.error('Error uploading files:', error);
            setUploading(false);
            setProgress(0);
            onError({ error });
            message.error('Failed to upload files. Please try again.');
        }
    };

    const props = {
        name: 'file',
        multiple: true,
        customRequest: handleUpload,
        headers: {
            Authorization: `Bearer ${userInfo.accessToken}`,
        },
        beforeUpload(file) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => {
                    resolve(file);
                };
                reader.onerror = (error) => {
                    reject(error);
                };
            });
        },
        onChange: info => {
            const { status } = info.file;
            if (status === 'done') {
                message.success(`${info.file.name} file uploaded successfully.`);
            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
            setFileList(info.fileList);
        },
        onDrop: e => {
            const uploadedFiles = Array.from(e.dataTransfer.files);
            setFileList([...fileList, ...uploadedFiles]);
        },
    };

    return (
        <Modal
            title={`Submit Job Order: ${selectedJob?.orderId || ''}`}
            visible={open}
            onCancel={onCancel}
            footer={[
                <Button key="cancel" onClick={onCancel}>
                    Cancel
                </Button>,
                // <Button
                //     key="submit"
                //     type="primary"
                //     onClick={() => handleSubmit(selectedJob?.orderId)}
                //     disabled={fileList.length === 0 || uploading}
                // >
                //     Submit
                // </Button>,
            ]}
            width={850}
            style={{ top: 20 }}
        >
            <div className="row">
                <div className="col-12 col-md-6">
                    <p>Order Topic: {selectedJob?.topic || ''}</p>
                    <p>Order Service: {selectedJob?.service || ''}</p>
                </div>
                <div className="col-12 col-md-6">
                    <p>Order Budget:<strong> ksh {selectedJob?.amount || ''}</strong></p>
                    <p>Deadline: {new Date(selectedJob?.deadline).toLocaleDateString()}</p>
                </div>
                <Divider />
                <div className='my-4'>
                    <Dragger {...props} ref={dropRef}>
                        <p className="ant-upload-drag-icon">
                            <InboxOutlined />
                        </p>
                        <p className="ant-upload-text">Click or drag file to this area to upload</p>
                    </Dragger>

                    {errMsg && <p style={{ color: 'red' }}>{errMsg}</p>}

                    {uploading && (
                        <Progress
                            // type="line"
                            percent={progress}
                            // format={percent => `${percent.toFixed(2)}%`}
                            // strokeColor="#87d068" // Green color for progress bar
                        />
                    )}
                </div>
            </div>
        </Modal>
    );
};

export default SubmitJob;
