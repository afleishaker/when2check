import React from "react";
import {Link} from "react-router-dom";
import {Avatar, Layout, Menu, Row} from "antd";
import {UserOutlined} from "@ant-design/icons";

const { Header } = Layout;

const Navbar = () => {
    return (
        <Header>
            <Row justify="space-between" align="middle">
                <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']}>
                    <Menu.Item key="1"><Link to="/">Home </Link></Menu.Item>
                    <Menu.Item key="2"><Link to="/dashboard">Dashboard</Link></Menu.Item>
                    <Menu.Item key="3">Create Event</Menu.Item>
                </Menu>
                <Avatar icon={<UserOutlined />} />
            </Row>
        </Header>
    );
};

export default Navbar;