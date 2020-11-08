import React from "react";
import { Card, Typography } from "antd";
import moment from "moment";
import { SettingOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";

const { Paragraph } = Typography;

const LinkCard = (props) => {
    const {title, currentPeople, expectedPeople, availablePeople, lastCheckedTime, link, id} = props.link;
    return (
        <Card key={id}
              title={title}
              actions={[
                  <SettingOutlined key="setting" />,
                  <EditOutlined key="edit" />,
                  <DeleteOutlined key="ellipsis" />,
              ]}
        >
            <Paragraph><b>Last Updated:</b> {moment(new Date(lastCheckedTime)).format("YYYY-MM-DD, h:mm a")}</Paragraph>
            <Paragraph><b>Available:</b> {currentPeople}/{expectedPeople}</Paragraph>
            <Paragraph copyable={{text: link}}><b>When2Meet Link:</b> {link}</Paragraph>
        </Card>
    )
}

export default LinkCard;