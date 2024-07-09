import axios from "axios";
import { API_URL as API } from "../config";
import { DOWNLOAD_FILE_FAIL, DOWNLOAD_FILE_REQUEST, DOWNLOAD_FILE_SUCCESS } from "../constants/FileUpload";

export const downloadFile = (documentId) => async (dispatch, getState) => {
  try {
    dispatch({ type: DOWNLOAD_FILE_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.accessToken}`,
      },
      responseType: 'blob', // Ensure responseType is set to blob to handle binary data correctly
    };

    const response = await axios.get(`${API}uploads/downloadFile/${documentId}`, config);

    // Extract filename from the response headers
    const contentDisposition = response.headers['content-disposition'];
    let fileName = 'downloaded_file';
    if (contentDisposition) {
      const fileNameMatch = contentDisposition.match(/filename="(.+)"/);
      if (fileNameMatch && fileNameMatch.length === 2) {
        fileName = fileNameMatch[1];
      }
    }

    // Directly handle file download in browser
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();

    // Clean up
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    // Dispatch success action with metadata
    dispatch({ type: DOWNLOAD_FILE_SUCCESS, payload: { fileName } });
  } catch (error) {
    dispatch({ type: DOWNLOAD_FILE_FAIL, payload: error.response.data.message });

    // Handle error message display or logging
    console.error(error);
    message.error(error.response.data.message || 'Failed to download file. Please try again later.', 5);
  }
};