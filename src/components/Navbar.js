import React, {useState} from "react";
import {Avatar, Layout, Menu, Row, Dropdown} from "antd";
import {UserOutlined} from "@ant-design/icons";
import {withFirebase} from "./Firebase";
import {useAuthState} from "react-firebase-hooks/auth";
import Logo from "./Logo";
import AddPhoneModal from "./AddPhoneModal";

const { Header } = Layout;

const Navbar = ({firebase}) => {
    const [user] = useAuthState(firebase.auth);
    const [phoneModalVisible, showPhoneModal] = useState(false);
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
                        <Menu.Item onClick={() => showPhoneModal(true)}>
                            Add Phone Number
                        </Menu.Item>
                    </Menu>
                } placement="bottomRight" arrow >
                    <Avatar size="large" icon={<UserOutlined />} src={user && user.photoURL} />
                </Dropdown>
            </Row>
            <AddPhoneModal phoneModalVisible={phoneModalVisible} showPhoneModal={showPhoneModal} />
        </Header>
    );
};

export default withFirebase(Navbar);