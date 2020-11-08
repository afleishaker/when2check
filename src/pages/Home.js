import React from "react";
import Particles from 'react-particles-js';
import { Col, Row, Typography, Divider, Button } from 'antd';
import {withFirebase} from "../components/Firebase";
import { withRouter } from "react-router-dom";
import * as ROUTES from '../constants/routes';
import {useAuthState} from "react-firebase-hooks/auth";

const { Title } = Typography;

const Home = ({firebase, history}) => {

    const [user] = useAuthState(firebase.auth);

    return (
        <div>
            <Particles
                style={{ position: "absolute" }}
                height="100%"
                width="100%"
                params={{
                    particles: {
                        color: {
                            value: "#000000"
                        },
                        line_linked: {
                            color: {
                                value: "#000000"
                            }
                        },
                        number: {
                            value: 50
                        },
                        size: {
                            value: 3
                        }
                    }
                }}
            />
            <Row style={{height: "100vh", width: "100vw"}} justify="center" align="middle">
                <Row justify="center">
                    <Col span={24}>
                        <Title style={{textAlign: "center"}}>Welcome to when2check</Title>
                    </Col>
                    <Col span={24}>
                        <Title level={3} style={{fontWeight: "lighter", textAlign: "center"}}>The new way to be updated about your when2meets</Title>
                    </Col>
                    <Col span={24}>
                        <Row justify="center">
                            <Col xs={20} sm={12}>
                                <Divider>Sign In</Divider>
                            </Col>
                        </Row>
                    </Col>
                    <Col xs={20} md={12} lg={8}>
                        { user ? <Button type="primary" block onClick={() => {
                            history.push(ROUTES.DASHBOARD)
                        }}>Go to Dashboard</Button> : <Row gutter={8} style={{flexDirection: "column"}}>
                            <Col span={24}>
                                <Button type="primary" block onClick={() => {
                                    firebase.signInWithGoogle().then(user => {
                                        history.push(ROUTES.DASHBOARD)
                                    });
                                }}>Sign In With Google</Button>
                            </Col>
                        </Row>}
                    </Col>
                </Row>
            </Row>
        </div>
    )
}

export default withRouter(withFirebase(Home));