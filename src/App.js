import React, { Fragment, useState } from "react";
import './App.less';
import {Switch, Route} from 'react-router-dom';

import { Layout, Menu, Row, Avatar} from 'antd';
import { UploadOutlined, UserOutlined, VideoCameraOutlined } from '@ant-design/icons';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from "react-firebase-hooks/firestore";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Error from "./pages/Error";
import Navbar from "./components/Navbar";
import * as ROUTES from "./constants/routes";
import {withFirebase} from "./components/Firebase";
import Loading from "./components/Loading";

const { Content } = Layout;

function App({firebase}) {
  const [user, loading] = useAuthState(firebase.auth);
  const [ready, setReady] = useState(false);
  if(!loading) {
  	setTimeout(() => {
  		setReady(true)
	}, 1500)
  }
     if(ready) {
		  return (
			  <Switch>
				  <Route exact path={ROUTES.LANDING} component={Home}/>
				  <Fragment>
					  <Layout>
						  <Navbar/>
						  <Content style={{padding: '0 50px'}}>
							  <Route exact path={ROUTES.DASHBOARD} component={Dashboard}/>
						  </Content>
					  </Layout>
				  </Fragment>
				  <Route component={Error}/>
			  </Switch>
		  )
	  } else {
  	  	return <Loading />
	  }
}

export default withFirebase(App);
