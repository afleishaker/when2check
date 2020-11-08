import React from "react";
import { Card, Typography, Skeleton, Tooltip } from "antd";
import moment from "moment";
import { SettingOutlined, CopyTwoTone, DeleteTwoTone } from "@ant-design/icons";
import {withFirebase} from "./Firebase";

const { Paragraph } = Typography;


const LinkCard = (props) => {
    const { loading, firebase } = props;
    const {title, currentPeople, expectedPeople, availablePeople, lastCheckedTime, link, id} = props.link;

    const buttons =
        [
            <Paragraph style={{margin: 0 }} copyable={{text: link}}></Paragraph>,
            <Tooltip title="Delete"><DeleteTwoTone twoToneColor="#eb2f96" onClick={() => firebase.removeUserFromEvent(id)} key="ellipsis" /></Tooltip>,
        ];

    const loadingButtons =
        [
            <Skeleton loading={true}><Paragraph copyable={{text: link}}></Paragraph></Skeleton>,
            <Skeleton loading={true}><DeleteTwoTone key="ellipsis" /></Skeleton>,
        ];

    return (
        <Card key={id}
              title={loading ? <Skeleton loading={loading}><p>{title}</p></Skeleton> : title}
              loading={loading}
              actions={loading ? loadingButtons : buttons}
        >
            <Paragraph><b>Last Updated:</b> {lastCheckedTime && moment(new Date(lastCheckedTime.toDate())).format("DD-MM-YYYY, h:mm a")}</Paragraph>
            <Paragraph><b>Available:</b> {currentPeople}/{expectedPeople}</Paragraph>
            <b>When2Meet Link:</b><a href={link}> {link}</a>
        </Card>
    )
}

export default withFirebase(LinkCard);