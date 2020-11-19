
import React, { useMemo, useState, useEffect, useRef, useCallback } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Typography, Table, Input, Divider, Modal, Form } from 'antd';
import { usePersistFn } from 'ahooks';
import { Timeout, delay } from '@/utils/utils';

import styles from './index.less';

const { Title } = Typography;

interface ConfigItem {
  label: string;
  name: string;
  render?: Function;
  rules?: any
};

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const detailConfig: Array<ConfigItem> = [{
  label: 'Title',
  name: 'title',
}, {
  label: 'Hot',
  name: 'hot'
}];

const Update = (props: { data: any; formConfig: Array<ConfigItem>, initFormRef: Function }) => {
  const { data, formConfig, initFormRef } = props;
  const [form] = Form.useForm();
  useEffect(() => {
    initFormRef(form);
  }, []);
  return <Form
    name="update"
    form={form}
    {...layout}
    initialValues={data || {}}
  >
    {
      formConfig.map(item => {
        const value = data && data[item.name];
        return (<Form.Item key={item.name} label={item.label} name={item.name}>
          {
            item.render ? item.render(value, data) : value
          }
        </Form.Item>)
      })
    }
  </Form>
}

const Detail = (props: { data: any; formConfig: Array<ConfigItem> }) => {
  const { data, formConfig } = props;
  return <Form
    name="detail"
    {...layout}
  >
    {
      formConfig.map(item => {
        const value = data && data[item.name];
        return (<Form.Item key={item.name} label={item.label}>
          {
            item.render ? item.render(value, data) : value
          }
        </Form.Item>)
      })
    }
  </Form>
}

const UseModal = (props: any) => {
  const { children, modalProps, data, editable, updateCell } = props;
  const [ visible, setVisible ] = useState(false);
  const initRef = useRef<boolean>();
  const formRef = useRef<any>();

  const updateConfig: Array<ConfigItem> = useMemo(() => {
    if (!editable) {
      return [];
    }
    return detailConfig.map(item => {
      return {
        ...item,
        rules: [{ required: true, message: `Please input ${item.name}!` }],
        render: () => {
          return <Input placeholder={`Please input ${item.name}`}/>
        }
      }
    });
  }, []);

  const onShow = useCallback(() => {
    if (!initRef.current) {
      initRef.current = true;
    }
    setVisible(true);
  }, [initRef.current]);

  const onHidden = useCallback(() => {
    setVisible(false);
  }, []);

  const onOk = useCallback(() => {
    formRef.current.validateFields().then((values: any) => {
      console.log('values:', values);
      Timeout(() => {
        console.log('update');
        setVisible(false);
        updateCell();
      }, 10)
    });
  }, []);

  const initFormRef = useCallback((formIns) => {
    formRef.current = formIns;
  }, []);

  return initRef.current ? <>
    <Modal
      visible={visible}
      onCancel={onHidden}
      onOk={onOk}
      destroyOnClose
      maskClosable={!editable}
      {...(modalProps || {})}
    >
      {
        !editable ? <Detail data={data} formConfig={detailConfig} /> :
        <Update data={data} formConfig={updateConfig} initFormRef={initFormRef}/>
      }
      
    </Modal>
    <span onClick={onShow}>{children}</span>
  </> : <span onClick={onShow}>{children}</span>
}

export default (): React.ReactNode => {
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);

  const getDataSource = usePersistFn(() => {
    setLoading(true);
    delay(120).then(() => {
      const listData: any = () => new Array(10).fill({
        title: 'Ant Design Title ',
      }).map((item, index) => ({
        key: index,
        title: `${item.title}${index + 1}`,
        hot: Math.floor(Math.random() * 101),
      }));
      setDataSource(listData);
      setLoading(false);
    });
  });
  const updateCell = usePersistFn(() => {
    getDataSource();
  });

  const columns: any = useMemo(() => [{
    dataIndex: 'title',
    title: '标题'
  }, {
    dataIndex: 'hot',
    title: '热度'
  }, {
    dataIndex: 'operation',
    title: '操作',
    render: (text: any, record: any) => {
      return <>
        <UseModal
          modalProps={
            {
              title: `详情 - ${record.title}`,
              footer: null
            }
          }
          data={record}
        >
          <a>详情</a>
        </UseModal>
        <Divider type="vertical" />

        <UseModal
          modalProps={
            {
              title: ` 更新 - ${record.title}`,
            }
          }
          updateCell={updateCell}
          data={record}
          editable={true}
        >
          <a>编辑</a>
        </UseModal>
      </>
    }
  }], []);

  useEffect(() => {
    getDataSource();
  }, []);
  return (
    <PageContainer>
      <div className={styles.header}>
        <Title style={{ marginBottom: 0 }} level={3}>弹窗(抽屉)使用心得</Title>
      </div>
      <Table
        loading={loading}
        dataSource={dataSource}
        pagination={false}
        columns={columns}
      />
    </PageContainer>
  )
};

