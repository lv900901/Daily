import React, { useMemo, useState, useEffect, useRef } from 'react';
// import { Typography } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { Typography, List, Avatar } from 'antd';
import { usePersistFn } from 'ahooks';
import { Timeout } from '@/utils/utils';

import styles from './index.less';

const { Title } = Typography;


export default (): React.ReactNode => {
  const data: any = useMemo(() => (new Array(5).fill({
    title: 'Ant Design Title ',
  }).map((item, index) => ({
    title: `${item.title}${index + 1}`
  }))), []);
  const dataLen: number = useMemo(() =>data.length, []);
  const [listData, setListData] = useState([]);
  const cursor = useRef(1);

  useEffect(() => {
    const listDataLen = listData.length;
    if (cursor.current - 1 === listDataLen && dataLen !== listDataLen) {
      Timeout(() => {
        setListData(data.slice(0, cursor.current));
        cursor.current = cursor.current + 1;
      }, 16)
    }
  });

  return (
    <PageContainer>
      <Title level={3}>列表滑入</Title>
      <List
        itemLayout="horizontal"
        dataSource={listData}
        renderItem={(item: any) => (
          <List.Item className={styles.item}>
            <List.Item.Meta
              avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
              title={<a>{item.title}</a>}
              description="Ant Design, a design language for background applications, is refined by Ant UED Team"
            />
          </List.Item>
        )}
      />
    </PageContainer>
  )
};