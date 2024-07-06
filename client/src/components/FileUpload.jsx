import React, { useState } from 'react';
import { Upload, message } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useSelector } from 'react-redux';

const { Dragger } = Upload;

const FileUpload = ({ onFileUpload }) => {
    const [fileList, setFileList] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;
    
    const handleUpload = async (options) => {
      const { onSuccess, onError, file, onProgress } = options;
      const formData = new FormData();
      formData.append('file', file);
    
      setUploading(true);
      setProgress(0);
    
      try {
        const response = await axios.post('http://localhost:3001/uploads/fileUploads', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${userInfo.accessToken}`
          },
          onUploadProgress: progressEvent => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setProgress(percentCompleted);
            onProgress({ percent: percentCompleted });
          }
        });
    
        onSuccess("Ok");
        const uploadedFile = {
          uid: file.uid,
          name: file.name,
          status: file.status,
          documentId: response.data.documentId // Attach the document ID
        };
        setFileList(prevList => [...prevList, uploadedFile]);
        onFileUpload([...fileList, uploadedFile]); // Update parent component state with updated fileList
        setUploading(false);
        setProgress(0);
      } catch (error) {
        onError({ error });
        setUploading(false);
        setProgress(0);
      }
    };
    

    const props = {
        name: 'file',
        multiple: true,
        accept: ".jpg,.jpeg,.png,.pdf,.doc,.docx,.xlsx",
        customRequest: handleUpload,
        fileList,
        onChange(info) {
            const { status } = info.file;
            if (status === 'done') {
                message.success(`${info.file.name} file uploaded successfully.`);
            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
        onRemove(file) {
          const updatedFileList = fileList.filter(item => item.uid !== file.uid);
          setFileList(updatedFileList);
          onFileUpload(updatedFileList); // Update parent component state with updated fileList
        }
        
    };

    return (
        <Dragger {...props}>
            <p className="ant-upload-drag-icon">
                <InboxOutlined />
            </p>
            <p className="ant-upload-text">Click or drag file to this area to upload</p>
            <p className="ant-upload-hint">Support for a single or bulk upload. Strictly prohibit from uploading company data or other banned files</p>
        </Dragger>
    );
};

export default FileUpload;
