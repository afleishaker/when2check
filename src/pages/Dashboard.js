import React from "react";
import {withFirebase} from "../components/Firebase";
import { withAuthorization } from "../components/Session";

const Dashboard = ({firebase}) => {
    return (
        <h1>Dashboard</h1>
    );
}

const condition = authUser => !!authUser;

export default withAuthorization(condition)(withFirebase(Dashboard));