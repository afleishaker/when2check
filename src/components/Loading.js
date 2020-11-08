import React from "react";
import { Row, Spin, Typography } from "antd";
import Particles from "react-particles-js";

const { Title } = Typography;

const Loading = () => {
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
            <Row style={{width: "100vw", height: "100vh"}} justify="center" align="middle">
                <Title style={{fontWeight: "lighter", textAlign: "center"}}>Loading... <Spin size="large"/></Title>
            </Row>
        </div>
    )
}

export default Loading;