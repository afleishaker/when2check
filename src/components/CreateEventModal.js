import React, { useState } from "react";
import moment from "moment";
import { Modal, Form, Input, DatePicker, InputNumber, TimePicker } from "antd";
import {withFirebase} from "./Firebase";
import {useAuthState} from "react-firebase-hooks/auth";
require('moment-timezone');


const CreateEventModal = ({visible, setModalVisible, firebase}) => {

    const [loading, setLoading] = useState(false);
    const [user] = useAuthState(firebase.auth);

    function disabledDate(current) {
        // Can not select days before start of this week and end of 4 weeks out
        const endDate = moment().endOf('week').add(4, 'week');
        const startDate = moment().startOf('week')
        return current < startDate || current >= endDate
    }

    function disabledNotifications(current) {
        const endDate = moment().endOf('week').add(4, 'week').add(1, 'day');
        return current <= moment().startOf('day') || current >= endDate
    }

    const [form] = Form.useForm();

    function submitForm(){
        form.validateFields().then(values => {
            const transformedValues = {
                uid: user.uid,
                title: values.eventTitle,
                startDate: values.potentialDates[0].tz("America/New_York").format('YYYY-MM-DD'),
                endDate: values.potentialDates[1].tz("America/New_York").format('YYYY-MM-DD'),
                startTime: values.times[0].tz("America/New_York").format('HH'),
                endTime: values.times[1].tz("America/New_York").format('HH'),
                notifyUntil: values.notifyUntil.format('YYYY-MM-DD'),
                expectedPeople: values.expectedPeople
            };
            setLoading(true);
            firebase.createEvent(transformedValues);
            setTimeout(() => {
                setLoading(false);
                setModalVisible(!visible)
            }, 2000);
        });
    }
    return (
        <Modal
            title="Create Event"
            visible={visible}
            confirmLoading={loading}
            onCancel={() => setModalVisible(!visible)}
            onOk={submitForm}
            okText="Submit"
            centered
        >
            <Form
                form={form}
                name="createEvent"
                layout="vertical"
            >
                <Form.Item
                    label="Event Title"
                    name="eventTitle"
                    rules={[{ required: true, message: 'Please input the event title!' }]}
                >
                    <Input placeholder="My Event" />
                </Form.Item>
                <Form.Item
                    label="Potential Dates"
                    name="potentialDates"
                    rules={[{ required: true, message: 'Please input the range of dates your event will be in!' }]}
                >
                    <DatePicker.RangePicker
                        disabledDate={disabledDate}
                        style={{width: "100%"}}
                    />
                </Form.Item>
                <Form.Item
                    label="Start and End Time"
                    name="times"
                    rules={[{ required: true, message: 'Please include the time options for your event'}]}
                >
                    <TimePicker.RangePicker
                        style={{width: "100%"}}
                        use12Hours
                        format="h a"
                    />
                </Form.Item>
                <Form.Item
                    label="Number of expected attendees"
                    name="expectedPeople"
                    rules={[{ required: true, message: 'Please input the number of expected attendees' }]}
                >
                    <InputNumber
                        min={1}
                        style={{width: "100%"}}
                    />
                </Form.Item>
                <Form.Item
                    label="Notifications"
                    name="notifyUntil"
                    rules={[{ required: true, message: 'Please input the date in which you want to get notifications until' }]}
                >
                    <DatePicker
                        disabledDate={disabledNotifications}
                        style={{width: "100%"}}
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
}

export default withFirebase(CreateEventModal);