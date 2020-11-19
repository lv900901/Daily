
import React, { useMemo, useState, useEffect, useRef } from 'react';
import { findDOMNode } from 'react-dom';
import { PageContainer } from '@ant-design/pro-layout';
import { Typography, List, Radio, Divider } from 'antd';
import { usePersistFn, useCreation } from 'ahooks';
import { Timeout } from '@/utils/utils';

import styles from './index.less';

const { Title } = Typography;

const config = {
  radioOptions: [
    {
      label: '按字母',
      value: 'normal'
    },
    {
      label: '按热度',
      value: 'hot'
    }
  ]
};

class AnimateItem {
  ele: Node | null = null;
  appendFlg = false;
  constructor(target: HTMLElement) {
    const item: Node = target.cloneNode(true);
    const bound = target.getBoundingClientRect();
    (item as HTMLElement).style.position = 'absolute';
    (item as HTMLElement).style.width = `${bound.width}px`;
    (item as HTMLElement).style.height = `${bound.height}px`;
    this.ele = item;
    this.setPosition(bound);
  }

  setPosition = (bound: DOMRect) => {
    (this.ele as HTMLElement).style.left = `${bound.left}px`;
    (this.ele as HTMLElement).style.top = `${bound.top}px`;
  }

  append = (maskNode: any) => {
    if (!this.appendFlg) {
      maskNode.appendChild(this.ele as Node);
      this.appendFlg = true;
    }
  }
  animating = (target: any) => {
    const bound = target.getBoundingClientRect();
    this.setPosition(bound);
  }
}

class PageControll {
  mask: any;
  listItems = new Map();
  timer: null | any = null;
  constructor() {

  }
  initItem = (target: any, key: number) => {
    if (this.listItems.has(key)) {
      if (target) {
        this.listItems.get(key).animating(target);
      }
    } else {
      const animateItem = new AnimateItem(target as HTMLElement);
      this.listItems.set(key, animateItem);
    }
  }
  appendItem = () => {
    for(let animateItem of this.listItems.values()) {
      animateItem.append(this.mask);
    }
  }
  appearing = () => {
    for(let animateItem of this.listItems.values()) {
      animateItem.animating();
    }
  }
}

enum STATUS { BeforeAppear, Appearing, Finished };

export default (): React.ReactNode => {
  const pageControll = useCreation(() => new PageControll(), []);
  const listData: any = useMemo(() => (new Array(100).fill({
    title: 'Ant Design Title ',
  }).map((item, index) => ({
    key: index,
    title: `${item.title}${index + 1}`,
    hot: Math.floor(Math.random() * 101)
  }))), []);
  const [sortType, setSortType] = useState('normal');
  const [status, setStatus] = useState(STATUS.Finished);
  const changeSortType = usePersistFn((e) => {
    // setSortType(e.target.value);
    pageControll.appendItem();
    setStatus(STATUS.BeforeAppear);
    // Timeout.cancel(pageControll.timer);
    pageControll.timer?.cancel();
    pageControll.timer = null;
    pageControll.timer = Timeout(() => {
      setStatus(STATUS.Appearing);
      setSortType(e.target.value);
    }, 1);
  });

  const sortData = useMemo(() => {
    const key = sortType === 'normal' ? 'title' : 'hot';
    return listData.sort((a: any, b: any) => {
      const aProptory = a[key];
      const bProptory = b[key];
      if (aProptory > bProptory) {
        return 1;
      } else if (aProptory < bProptory) {
        return -1;
      }
      return 0;
    });
  }, [sortType]);

  useEffect(() => {
    // Timeout.cancel(pageControll.timer);
    pageControll.timer?.cancel();
    pageControll.timer = null;
    pageControll.timer = Timeout(() => {
      setStatus(STATUS.Finished);
    }, 64);
  }, [sortType]);
  return (
    <PageContainer>
      <div className={styles.header}>
        <Title style={{ marginBottom: 0 }} level={3}>列表排序</Title>
        <Radio.Group
          options={config.radioOptions}
          onChange={changeSortType}
          value={sortType}
          optionType="button"
          buttonStyle="solid"
        />
      </div>
      <List
        className={`animateList ${status === STATUS.Appearing ? styles.animating : ''}`}
        itemLayout="horizontal"
        grid={{ gutter: 16, column: 4 }}
        dataSource={sortData}
        renderItem={(item: any) => (
          <List.Item className="animateListItem">
            <div ref={c => pageControll.initItem(findDOMNode(c), item.key)} className={styles.item}>
              {item.title}
              <Divider type="vertical" />
              {item.hot}
            </div>
          </List.Item>
        )}
      />
      <div ref={c => pageControll.mask = findDOMNode(c)} className={`${styles.maskContainer} ${status === STATUS.Appearing ? styles.appearing : ''}`}>
      </div>
    </PageContainer>
  )
};

