import React, { Fragment } from "react";
import './App.less';
import {Switch, Route, Link} from 'react-router-dom';

import { Layout, Menu, Row, Avatar} from 'antd';
import { UploadOutlined, UserOutlined, VideoCameraOutlined } from '@ant-design/icons';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from "react-firebase-hooks/firestore";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Error from "./pages/Error";
import Navbar from "./components/Navbar";
import * as ROUTES from "./constants/routes";

const { Content } = Layout;

function App() {
  return (
	  <Switch>
		  <Route exact path={ROUTES.LANDING} component={Home} />
		  <Fragment>
			  <Layout>
				  <Navbar />
				  <Content style={{ padding: '0 50px' }}>
					  <Route exact path={ROUTES.DASHBOARD} component={Dashboard} />
				  </Content>
			  </Layout>
		  </Fragment>
		  <Route component={Error} />
	  </Switch>

  );
}

export default App;
