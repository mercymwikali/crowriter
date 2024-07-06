import axios from "axios";
import { API_URL as API } from "../config";
import { DELETE_SUBMISSION_FAIL, DELETE_SUBMISSION_REQUEST, DELETE_SUBMISSION_RESET, DELETE_SUBMISSION_SUCCESS, DOWNLOAD_SUBMISSION_FAIL, DOWNLOAD_SUBMISSION_REQUEST, DOWNLOAD_SUBMISSION_RESET, DOWNLOAD_SUBMISSION_SUCCESS, SUBMISSION_LIST_FAIL, SUBMISSION_LIST_FAIL_BY_FREELANCER, SUBMISSION_LIST_REQUEST, SUBMISSION_LIST_REQUEST_BY_FREELANCER, SUBMISSION_LIST_RESET, SUBMISSION_LIST_RESET_BY_FREELANCER, SUBMISSION_LIST_SUCCESS, SUBMISSION_LIST_SUCCESS_BY_FREELANCER } from "../constants/submissionConstants";
import { message } from "antd";

export const getSubmissions = () => async (dispatch, getState) => {
    try {
        dispatch({ type: SUBMISSION_LIST_REQUEST });

        const {
            userLogin: { userInfo },
        } = getState();

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userInfo.accessToken}`,
            },
        };

        const { data } = await axios.get(`${API}uploads/submissions`, config);

        dispatch({ type: SUBMISSION_LIST_SUCCESS, payload: data });

        console.log(data);
    } catch (error) {
        dispatch({
            type: SUBMISSION_LIST_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });

        await message.error(error.response.data.message, 5);

        dispatch({ type: SUBMISSION_LIST_RESET });
    }
}

export const freelancerSubList = (freelancerId) => async (dispatch, getState) => {
    try {
        dispatch({ type: SUBMISSION_LIST_REQUEST_BY_FREELANCER });

        const {
            userLogin: { userInfo },
        } = getState();

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userInfo.accessToken}`,
            },
        };

        const { data } = await axios.get(`${API}uploads/submissions/freelancer/${freelancerId}`, config);

        dispatch({ type: SUBMISSION_LIST_SUCCESS_BY_FREELANCER, payload: data });

        console.log(data);

    } catch (error) {
        dispatch({
            type: SUBMISSION_LIST_FAIL_BY_FREELANCER,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });

         await message.error(error.response.data.message, 5);

        dispatch({ type:SUBMISSION_LIST_RESET_BY_FREELANCER });
    }
}


export const downloadSubmission = (submissionId) => async (dispatch, getState) => {
    try {
        dispatch({ type: DOWNLOAD_SUBMISSION_REQUEST });

        const {
            userLogin: { userInfo },
        } = getState();

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.accessToken}`,
            },
            responseType: 'blob',
        };

        const response = await axios.get(`${API}uploads/submissions/download/${submissionId}`, config);

        // Extract filename from the response headers
        const contentDisposition = response.headers['content-disposition'];
        let fileName = 'downloaded_file';
        if (contentDisposition) {
            const fileNameMatch = contentDisposition.match(/filename="(.+)"/);
            if (fileNameMatch.length === 2) {
                fileName = fileNameMatch[1];
            }
        }

        // Create a link element to trigger the download
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName); // Use the extracted file name
        document.body.appendChild(link);
        link.click();

        dispatch({ type: DOWNLOAD_SUBMISSION_SUCCESS });
    } catch (error) {
        dispatch({
            type: DOWNLOAD_SUBMISSION_FAIL,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message,
        });

        await message.error(error.response.data.message, 5);

        dispatch({ type: DOWNLOAD_SUBMISSION_RESET });
    }
};


export const deleteSubmission = (submissionId) => async (dispatch, getState) => {
    try {
        dispatch({ type: DELETE_SUBMISSION_REQUEST });

        const {
            userLogin: { userInfo },
        } = getState();

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userInfo.accessToken}`,
            },
        };

        const { data } = await axios.delete(`${API}uploads/submissions/delete/${submissionId}`, config);

        dispatch({ type: DELETE_SUBMISSION_SUCCESS, payload: data });

        await message.success(data.message, 5);

        console.log(data);

    } catch (error) {
        dispatch({
            type: DELETE_SUBMISSION_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });

        await message.error(error.response.data.message, 5);

        dispatch({ type:DELETE_SUBMISSION_RESET });

    }
}