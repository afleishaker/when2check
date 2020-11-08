import React, {useState} from "react";
import {Avatar, Layout, Menu, Row, Dropdown} from "antd";
import {UserOutlined} from "@ant-design/icons";
import {withFirebase} from "./Firebase";
import {useAuthState} from "react-firebase-hooks/auth";
import Logo from "./Logo";

const { Header } = Layout;

const Navbar = ({firebase}) => {
    const [user] = useAuthState(firebase.auth);
    return (
        <Header>
            <Row style={{height: "100%"}} justify="space-between" align="middle">
                <Menu theme="dark" style={{height: "100%"}}>
                    <Logo />
                </Menu>
                <Dropdown overlay={
                    <Menu>
                        <Menu.Item onClick={() => firebase.signOut()}>
                            Sign Out
                        </Menu.Item>
                    </Menu>
                } placement="bottomRight" arrow >
                    <Avatar size="large" icon={<UserOutlined />} src={user && user.photoURL} />
                </Dropdown>
            </Row>
        </Header>
    );
};

export default withFirebase(Navbar);