import React, { useState } from "react";

import { Modal, Form, Input } from 'antd';
import {withFirebase} from "./Firebase";

const AddPhoneModal = ({phoneModalVisible, showPhoneModal, firebase}) => {

    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    function submitForm() {
        console.log("submiited");
        form.validateFields().then(values => {
            setLoading(true);
            console.log(values);
            firebase.addPhoneNumber(values.phoneNumber);
            setTimeout(() => {
                setLoading(false);
                showPhoneModal(!phoneModalVisible)
            }, 2000);
        })
    }

    return (
        <Modal
            title="Add Phone Number"
            visible={phoneModalVisible}
            confirmLoading={loading}
            okText="Add Phone Number"
            onOk={submitForm}
            onCancel={() => showPhoneModal(false)}
            centered
        >
            <Form
                form={form}
                name="addPhoneNumber"
                layout="vertical"
            >
                <Form.Item
                    label="Phone Number"
                    name="phoneNumber"
                    rules={[
                        {  required: true,
                            message: 'Please add your phone number!'
                        },
                        {
                            pattern: new RegExp(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im),
                            message: "Wrong format!"
                        }
                        ]}
                >
                    <Input placeholder="1234567890" />
                </Form.Item>
            </Form>
        </Modal>
    );
}

export default withFirebase(AddPhoneModal);