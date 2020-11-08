import React, {useState} from "react";
import {Link} from "react-router-dom";
import {Avatar, Layout, Menu, Row, Dropdown} from "antd";
import {FormOutlined, UnorderedListOutlined, UserOutlined} from "@ant-design/icons";
import {withFirebase} from "./Firebase";
import {useAuthState} from "react-firebase-hooks/auth";
import * as ROUTES from "../constants/routes";
import CreateEventModal from "./CreateEventModal";

const { Header } = Layout;

const Navbar = ({firebase}) => {
    const [user] = useAuthState(firebase.auth);
    const [visible, setModalVisible] = useState(false);
    return (
        <Header>
            <Row justify="space-between" align="middle">
                <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']}>
                    <Menu.Item key="2"><Link to={ROUTES.DASHBOARD}>Dashboard <UnorderedListOutlined /></Link></Menu.Item>
                    <Menu.Item key="3" onClick={() => setModalVisible(!visible)}>Create Event <FormOutlined /></Menu.Item>
                </Menu>
                <Dropdown overlay={
                    <Menu>
                        <Menu.Item onClick={() => firebase.signOut()}>
                            Sign Out
                        </Menu.Item>
                    </Menu>
                } placement="bottomRight" arrow >
                    <Avatar size="large" icon={<UserOutlined />} src={user && user.photoURL}/>
                </Dropdown>
            </Row>
            <CreateEventModal visible={visible} setModalVisible={setModalVisible}/>
        </Header>
    );
};

export default withFirebase(Navbar);