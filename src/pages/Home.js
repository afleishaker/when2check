import React from "react";
import Particles from 'react-particles-js';
import { Row, Typography } from 'antd';

const { Title } = Typography;

const Home = () => {
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
                <Title>Welcome to when2check</Title>
                <br />
                <Title level={2}>The new way to check your when2meets</Title>
            </Row>
        </div>
    )
}

export default Home;