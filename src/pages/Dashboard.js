import React, { useState } from "react";

import { Row, Col, Typography, Button } from "antd";
import LinkCard from "../components/LinkCard";

import { withFirebase } from "../components/Firebase";
import { withAuthorization } from "../components/Session";
import CreateEventModal from "../components/CreateEventModal";

const { Title } = Typography;

const Dashboard = ({firebase}) => {
    const links = [
        {
            title: "Test1"
        },
        {
            title: "Test2"
        },
        {
            title: "Test3"
        },
        {
            title: "Test1"
        },
        {
            title: "Test2"
        },
        {
            title: "Test3"
        }
        ]
    const [visible, setModalVisible] = useState(false);

    return (
        <div style={{height: "100vh"}}>
            <Row justify="space-between" align="middle" style={{padding: "16px 0"}}>
                <Title level={2} style={{margin: "0"}}>Dashboard</Title>
                <Button type="primary" size="large" onClick={() => setModalVisible(!visible)}>Create Event</Button>
            </Row>
            <Row gutter={[16, 8]}>
                {links.map(({title}) => {
                    return (
                        <Col span={8}>
                            <LinkCard title={title} />
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