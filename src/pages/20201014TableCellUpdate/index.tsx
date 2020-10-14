
import React, { useMemo, useState, useEffect, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Typography, Table, Input } from 'antd';
import { LoadingOutlined, CheckCircleTwoTone, CloseCircleTwoTone } from '@ant-design/icons';
import { usePersistFn, useCreation } from 'ahooks';
import { Timeout, delay } from '@/utils/utils';

import styles from './index.less';

const { Title } = Typography;

interface DefaultKey { 
  loading: symbol;
  status: symbol;
  changeFlag: symbol;
};

const extraKey: DefaultKey = {
  loading: Symbol('loading'),
  status: Symbol('status'),
  changeFlag: Symbol('changeFlag')
};

const staticData: any[] = [];
// {
//   key: -1,
//   title: '测试123',
//   hot: 12,
//   [extraKey.loading]: true
// }, {
//   key: -2,
//   title: '测试456',
//   hot: 12,
//   [extraKey.loading]: false,
//   [extraKey.status]: 1
// }, {
//   key: -3,
//   title: '测试789',
//   hot: 12,
//   [extraKey.loading]: false,
//   [extraKey.status]: 0
// }]

const listData: any = () => staticData.concat((new Array(10).fill({
  title: 'Ant Design Title ',
}).map((item, index) => ({
  key: index,
  title: `${item.title}${index + 1}`,
  hot: Math.floor(Math.random() * 101),
  [extraKey.loading]: {},
  [extraKey.status]: {},
  [extraKey.changeFlag]: {},
}))));

const CellUpdate = (props: any) => {
  const { children, maskAble, fitMargin, position, loading, status } = props;
  const fitMarginTemp = fitMargin || [];
  const getJSX = () => {
    if (loading) {
      if (maskAble !== false) {
        return <span className={styles.mask} style={{ top: fitMarginTemp[0] || 0, right: fitMarginTemp[1] || 0, bottom: fitMarginTemp[2] || 0, left: fitMarginTemp[3] || 0 }}>
          <LoadingOutlined style={{ color: '#2196F3' }} spin />
        </span>
      } else {
        return <span className={styles.status}>
          <LoadingOutlined style={{ color: '#2196F3' }} spin />
        </span>
      }
    } else if (status !== undefined){
      return <span className={styles.status}>
        {
          status ? <CheckCircleTwoTone twoToneColor="#52c41a"/> : <CloseCircleTwoTone twoToneColor="#eb2f96"/>
        }
      </span>
    }
  }

  return <div className={styles.container}>
    {
      children
    }
    {
      getJSX()
    }
  </div>
}

export default (): React.ReactNode => {
  const [dataSource, setDataSource] = useState(listData);

  const changeCell = usePersistFn((record, key: string) => {
    record[extraKey.changeFlag][key] = true;
    setDataSource([...dataSource]);
  });

  const updateCell = usePersistFn((value, key, record) => {
    if (!record[extraKey.changeFlag][key]) {
      return;
    }
    // const oldValue = record[key];
    record[key] = value;
    record[extraKey.changeFlag][key] = false;
    record[extraKey.loading][key] = true;
    setDataSource([...dataSource]);
    delay(120).then(() => {
      const status = Math.floor(Math.random() * 2);
      record[extraKey.status][key] = status;
      // if (!status) {
      //   record[key] = oldValue;
      // }
      record[extraKey.loading][key] = false;
      setDataSource([...dataSource]);
    });
  });

  const columns: any = useMemo(() => [{
    dataIndex: 'title',
    title: '标题',
    render: (text: string, record: any) => {
      const loading = !!record[extraKey.loading]['title'];
      return <CellUpdate
        fitMargin={[-16, -16, -16, -16]}
        loading={loading}
        maskAble={false}
        status={record[extraKey.status]['title']}
      >
        <Input
          key={Number(loading)}
          defaultValue={text}
          placeholder="请输入"
          onChange={() => changeCell(record, 'title')}
          onBlur={(e) => updateCell(e.target.value, 'title', record)}
        />
      </CellUpdate>;
    }
  }, {
    dataIndex: 'hot',
    title: '热度',
    render: (text: string, record: any) => {
      const loading = !!record[extraKey.loading]['hot'];
      return <CellUpdate
        fitMargin={[-16, -16, -16, -16]}
        loading={loading}
        status={record[extraKey.status]['hot']}
      >
        <Input
          key={Number(loading)}
          defaultValue={text}
          placeholder="请输入"
          onChange={() => changeCell(record, 'hot')}
          onBlur={(e) => updateCell(e.target.value, 'hot', record)}
        />
      </CellUpdate>;
    }
  }], []);
  return (
    <PageContainer>
      <div className={styles.header}>
        <Title style={{ marginBottom: 0 }} level={3}>表格单元格更新效果</Title>
      </div>
      <Table
        dataSource={dataSource}
        pagination={false}
        columns={columns}
      />
    </PageContainer>
  )
};

