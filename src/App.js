import React from "react";
import './App.less';
import {Switch, Route, Link} from 'react-router-dom';

import { Layout, Menu, Row, Avatar} from 'antd';
import { UploadOutlined, UserOutlined, VideoCameraOutlined } from '@ant-design/icons';

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Error from "./pages/Error";
import Navbar from "./components/Navbar";

const { Header, Content, Footer, Sider } = Layout;

function App() {
  return (
	  <Layout>
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
		  <Content style={{ padding: '0 50px' }}>
			  <Switch>
				  <Route exact path='/' component={Home} />
				  <Route path='/dashboard' component={Dashboard} />
				  <Route component={Error} />
			  </Switch>
		  </Content>
	  </Layout>
  );
}

export default App;
