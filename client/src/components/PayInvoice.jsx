import React, { useEffect, useState } from 'react';
import { Button, Modal, Form, Input, Select, DatePicker, message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { getInvoiceDetails } from '../actions/invoiceActions';
import moment from 'moment';
import { postPayment } from '../actions/paymentActions';

const { Option } = Select;

const PaymentModal = ({ visible, onCancel, selectedInvoice }) => {
    const [paymentMethod, setPaymentMethod] = useState('');
    const [paymentDate, setPaymentDate] = useState(moment().format('YYYY-MM-DD'));
    const [amount, setAmount] = useState('');

    const dispatch = useDispatch();

    const invoiceDetails = useSelector((state) => state.invoiceDetails);
    const { error: invoiceError, loading: invoiceLoading, success: invoiceSuccess, invoice } = invoiceDetails;

    const paymentDetails = useSelector((state) => state.postPayment);
    const { error: payError, loading: payLoading, success: paySuccess } = paymentDetails;

    useEffect(() => {
        if (selectedInvoice) {
            dispatch(getInvoiceDetails(selectedInvoice.id));
        }
    }, [dispatch, selectedInvoice]);

    useEffect(() => {
        if (paySuccess) {
            message.success('Payment successful');
            // Additional logic if needed upon payment success
            // Reset form or navigate to another page, etc.
            onCancel(); // Close modal on success
        }
    }, [paySuccess, onCancel]);

    useEffect(() => {
        if (payError) {
            onCancel();
        }
    }, [payError]);

    const handlePaymentMethodChange = (value) => {
        setPaymentMethod(value);
    };

    const handleDateChange = (date, dateString) => {
        setPaymentDate(dateString);
    };

    const handleCancel = () => {
        onCancel();
    };

    const handleSubmit = () => {
        const paymentData = {
            invoiceId: selectedInvoice.id,
            modeOfPayment: paymentMethod.toUpperCase().split(' ').join('_'), 
            paymentDate,
            amount: selectedInvoice.totalAmount,
            userId: selectedInvoice.userId,
        };
        dispatch(postPayment(paymentData));

        // Reset form
        setPaymentMethod('');
        setPaymentDate(moment().format('YYYY-MM-DD'));
        setAmount('');
    };

    return (
        <Modal
            title="Make Payment"
            visible={visible}
            onCancel={handleCancel}
            footer={[
                <Button key="cancel" onClick={handleCancel}>
                    Cancel
                </Button>,
                <Button key="submit" type="primary" onClick={handleSubmit}>
                    Submit Payment
                </Button>,
            ]}
            style={{ top: '20px' }}
            destroyOnClose
        >
            {selectedInvoice && invoice && invoice.user && (
                <div style={{ marginBottom: '16px' }}>
                    <p>First Name: {invoice.user.fname}</p>
                    <p>Last Name: {invoice.user.lname}</p>
                    <p>Email: {invoice.user.email}</p>
                </div>
            )}
            {invoice && (
                <Form layout="vertical">
                    <div className="row">
                        <div className="col-6 gap-3">
                            <Form.Item label="Invoice Number">
                                <Input value={invoice.invoiceNumber} type="link" disabled />
                            </Form.Item>
                        </div>
                        <div className="col-6 gap-3">
                            <Form.Item label="Payment Method">
                                <Select value={paymentMethod} onChange={handlePaymentMethodChange}>
                                    <Option value="cash">Cash</Option>
                                    <Option value="mpesa">M-Pesa</Option>
                                    <Option value="paypal">PayPal</Option>
                                </Select>
                            </Form.Item>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-6 gap-3">
                            <Form.Item label="Amount">
                                <Input value={invoice.totalAmount} onChange={(e) => setAmount(e.target.value)} />
                            </Form.Item>
                        </div>
                        <div className="col-6 gap-3">
                            <Form.Item label="Payment Date">
                                <DatePicker
                                    className="w-100"
                                    onChange={handleDateChange}
                                    value={moment(paymentDate, 'YYYY-MM-DD')}
                                    defaultValue={moment()}
                                />
                            </Form.Item>
                        </div>
                    </div>
                </Form>
            )}
        </Modal>
    );
};

export default PaymentModal;
