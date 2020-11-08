import React from "react";
import { Card, Typography, Skeleton } from "antd";
import moment from "moment";
import { SettingOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";

const { Paragraph } = Typography;


const LinkCard = (props) => {
    const { loading } = props;
    const {title, currentPeople, expectedPeople, availablePeople, lastCheckedTime, link, id} = props.link;

    const buttons =
        [
            <SettingOutlined key="setting" />,
            <EditOutlined key="edit" />,
            <DeleteOutlined key="ellipsis" />,
        ];

    const loadingButtons =
        [
            <Skeleton loading={true}><SettingOutlined key="setting" /></Skeleton>,
            <Skeleton loading={true}><EditOutlined key="edit" /></Skeleton>,
            <Skeleton loading={true}><DeleteOutlined key="ellipsis" /></Skeleton>,
        ];

    return (
        <Card key={id}
              title={loading ? <Skeleton loading={loading}><p>{title}</p></Skeleton> : title}
              loading={loading}
              actions={loading ? loadingButtons : buttons}
        >
            <Paragraph><b>Last Updated:</b> {lastCheckedTime && moment(new Date(lastCheckedTime.toDate())).format("YYYY-MM-DD, h:mm a")}</Paragraph>
            <Paragraph><b>Available:</b> {currentPeople}/{expectedPeople}</Paragraph>
            <Paragraph copyable={{text: link}}><b>When2Meet Link:</b> {link}</Paragraph>
        </Card>
    )
}

export default LinkCard;