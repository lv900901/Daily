
import React, { useMemo, useState, useEffect, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Typography, Table, Input, Tooltip, Divider } from 'antd';
import { LoadingOutlined, CheckCircleTwoTone, CloseCircleTwoTone } from '@ant-design/icons';
import { usePersistFn, useCreation } from 'ahooks';
import { Timeout, delay } from '@/utils/utils';

import styles from './index.less';

const { Title } = Typography;

interface DefaultKey { 
  loading: symbol;
  status: symbol;
  changeFlag: symbol;
  errorMsg: symbol;
};

const extraKey: DefaultKey = {
  loading: Symbol('loading'),
  status: Symbol('status'),
  changeFlag: Symbol('changeFlag'),
  errorMsg: Symbol('errorMsg')
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
  [extraKey.errorMsg]: {},
}))));

const ErrorTootip = (props: any) => {
  const { errorMsg, autoCloseSec } = props;
  const timer: any = useRef(null);
  const [ visible, setVisible ] = useState(true);
  const [ closeSec, setCloseSec ] = useState(autoCloseSec || 3);
  const onVisibleChange = usePersistFn((visible) => {
    if (!visible) {
      clearTimeout(timer.current);
      setTimeout(() => {
        setCloseSec(0);
      }, 100);
    }
    setVisible(visible);
  });

  const judgeClose = usePersistFn((count) => {
    timer.current = setTimeout(() => {
      const newCount = count - 1;
      if (newCount !== 0) {
        setCloseSec(newCount);
        judgeClose(newCount);
      } else {
        setVisible(false);
        setTimeout(() => {
          setCloseSec(newCount);
        }, 100);
      }
    }, 1000);
  });

  useEffect(() => {
    judgeClose(closeSec)
  }, []);
return <Tooltip title={<span>
    {errorMsg}
    {
      closeSec ? <>
        <Divider style={{ borderLeft: 'solid 1px rgba(255, 255, 255, .6)' }} type="vertical"/>
        {`${closeSec}s`}
      </>: null
    }
    
    </span>
  } color="#eb2f96" onVisibleChange={(newVisible) => onVisibleChange(newVisible)} visible={visible} arrowPointAtCenter placement="topRight">
  <CloseCircleTwoTone twoToneColor="#eb2f96"/>
</Tooltip>
}

const CellUpdate = (props: any) => {
  const { children, maskAble, fitMargin, position, loading, status, errorMsg } = props;
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
          status ? <CheckCircleTwoTone twoToneColor="#52c41a"/> : <ErrorTootip errorMsg={errorMsg} />
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
      if (!status) {
        record[extraKey.errorMsg][key] = "错误信息！";
        // record[key] = oldValue;
      }
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
        errorMsg={record[extraKey.errorMsg]['title']}
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
        errorMsg={record[extraKey.errorMsg]['hot']}
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

