import React from "react";
import './App.less';
import {Switch, Route, Link} from 'react-router-dom';

import { Layout, Menu, Row, Avatar} from 'antd';
import { UploadOutlined, UserOutlined, VideoCameraOutlined } from '@ant-design/icons';

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Error from "./pages/Error";
import Navbar from "./components/Navbar";

const { Content } = Layout;

function App() {
  return (
	  <Switch>
		  <Route exact path='/' component={Home} />
		  <Layout>
			  <Navbar />
			  <Content style={{ padding: '0 50px' }}>
				  <Route exact path='/dashboard' component={Dashboard} />
			  </Content>
		  </Layout>
		  <Route component={Error} />
	  </Switch>

  );
}

export default App;
