import React, { useState } from "react";

import{ Result, Row, Col, Typography, Button } from "antd";
import { FrownOutlined } from "@ant-design/icons";
import LinkCard from "../components/LinkCard";

import { withFirebase } from "../components/Firebase";
import { withAuthorization } from "../components/Session";
import CreateEventModal from "../components/CreateEventModal";
import {useCollectionData} from "react-firebase-hooks/firestore";
import {useAuthState} from "react-firebase-hooks/auth";

const { Title } = Typography;

const Dashboard = ({firebase}) => {
    const [user] = useAuthState(firebase.auth);
    const [visible, setModalVisible] = useState(false);
    const linksRef = firebase.firestore.collection('links');
    const query = linksRef.where('subscribers', 'array-contains', user.uid);
    const [links, loading, error] = useCollectionData(query, {idField: 'id'});
    console.log(error);
    const fakeLinks = [
        {
            title: "Event 1",
            id: 1
         },
        {
            title: "Event 2",
            id: 2
        },
        {
            title: "Event 3",
            id: 3
        },
        {
            title: "Event 4",
            id: 4
        }
    ]
    return (

        <div style={{minHeight: 'calc(100vh - 64px)'}}>
            <Row justify="space-between" align="middle" style={{padding: "16px 0"}}>
                <Title level={2} style={{margin: "0"}}>Dashboard</Title>
                <Button type="primary" size="large" onClick={() => setModalVisible(!visible)}>Create Event</Button>
            </Row>
            <Row gutter={[16, 8]}>
                {loading && fakeLinks.map(link => {
                    return (
                        <Col span={12} key={link.id}>
                            <LinkCard loading={loading} link={link} />
                        </Col>
                    )
                })
                }
                {
                    links && links.length > 0 ? links.map(link => {
                        return (
                            <Col span={12} key={link.id}>
                                <LinkCard loading={loading} link={link} />
                            </Col>
                        )
                    }) : <Col span={24}>
                        <Result
                            icon={<FrownOutlined />}
                            title="No events found. Create an event now!"
                            extra={<Button type="primary" onClick={() => setModalVisible(!visible)}>Create Event</Button>}
                        />
                    </Col>
                }
            </Row>
            <CreateEventModal visible={visible} setModalVisible={setModalVisible}/>
        </div>
    );
}

const condition = authUser => !!authUser;

export default withAuthorization(condition)(withFirebase(Dashboard));