import React from "react";
import { Card } from "antd";
import { SettingOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";

const LinkCard = ({title, link}) => {
    return (
        <Card title={title}
              actions={[
                  <SettingOutlined key="setting" />,
                  <EditOutlined key="edit" />,
                  <DeleteOutlined key="ellipsis" />,
              ]}
        >
            Card content
        </Card>
    )
}

export default LinkCard;