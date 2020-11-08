import React, { useState } from "react";

import { Row, Col, Typography, Button } from "antd";
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
    return (
        <div style={{height: "100vh"}}>
            <Row justify="space-between" align="middle" style={{padding: "16px 0"}}>
                <Title level={2} style={{margin: "0"}}>Dashboard</Title>
                <Button type="primary" size="large" onClick={() => setModalVisible(!visible)}>Create Event</Button>
            </Row>
            <Row gutter={[16, 8]}>
                {links && links.map(link => {
                    return (
                        <Col span={12} key={link.id}>
                            <LinkCard link={link} />
                        </Col>
                    )
                })
                }
            </Row>
            <CreateEventModal visible={visible} setModalVisible={setModalVisible}/>
        </div>
    );
}

const condition = authUser => !!authUser;

export default withAuthorization(condition)(withFirebase(Dashboard));