
import React, { useMemo, useState, useEffect, useRef, useCallback } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Typography, Collapse } from 'antd';
import { usePersistFn, useCreation } from 'ahooks';

const { Panel } = Collapse;

import styles from './index.less';

const { Title } = Typography;

const lines = Math.floor(Math.random() * 11) + 5;
const getPanelData = (panelKey: string, lines: number) => {
  return {
    panelKey,
    dataList: new Array(lines).fill({ title: 'Line' }).map((item, index) => ({
      key: `${panelKey}_${index}`,
      title: `${item.title} ${index + 1}`,
      content: new Array((Math.floor(Math.random() * 10) + 10)).fill(0).map((item, index) => `第 ${index + 1} 行`).join('\n'),
    }))
  }
};

const PANEL_KEYS = {
  LEFT: 'left',
  RIGHT: 'right'
};

class PanelList {

  leftPanel: any = null;

  rightPanel: any = null;

  dataList: any = [];

  stopTimer: any = null;

  startTop: any = 0;

  scrollKey: string = '';

  scrollTopMap: any = new Map([
    [PANEL_KEYS.LEFT, 0],
    [PANEL_KEYS.RIGHT, 0],
  ]);

  constructor() {
  }

  initPanel = () => {
    this.scrollTopMap = new Map([
      [PANEL_KEYS.RIGHT, 0],
      [PANEL_KEYS.LEFT, 0],
    ]);
    this.leftPanel.scrollTo(0, 0);
    this.rightPanel?.scrollTo(0, 0);
  };

  setDataSource = (dataList: any) => {
    this.dataList = dataList;
  };

  isStop = () => {
    this.stopTimer = setTimeout(() => {
      this.scrollKey = '';
    }, 100);
  };

  otherPanelLinkage = (panelKey: string, index: number, deltaY: number) => {
    const panelTarget = panelKey === PANEL_KEYS.RIGHT ? this.leftPanel : this.rightPanel;
    if (!panelTarget) {
      return;
    }
    const currentPanelKey = panelKey === PANEL_KEYS.RIGHT ? PANEL_KEYS.LEFT : PANEL_KEYS.RIGHT;
    const {scrollTop} = panelTarget;
    const panelTargetTop = panelTarget.offsetTop + 1;
    const target: any = document.getElementById(`${currentPanelKey}_${index}`);
    const nextTarget: any = document.getElementById(
      `${currentPanelKey}_${index + 1}`,
    );
    const top = target?.offsetTop || 0;
    const bottom = nextTarget?.offsetTop || 0;
    const min = top ? top - (scrollTop + panelTargetTop) : 0;
    const max = bottom ? bottom - (scrollTop + panelTargetTop) : 0;
    let newScrollTop = 0;
    if (deltaY > 0 && max && max < deltaY) {
      newScrollTop = scrollTop + max;
    } else if (deltaY < 0 && min && min > deltaY) {
      newScrollTop = scrollTop + min;
    } else if ((deltaY > 0 && max) || (deltaY < 0 && min)) {
      newScrollTop = scrollTop + deltaY;
    } else {
      newScrollTop = scrollTop;
    }
    this.scrollTopMap.set(currentPanelKey, newScrollTop);
    panelTarget.scrollTo(0, newScrollTop);
  };

  onScroll = (e: any, panelKey: string) => {
    const {scrollTop} = e.target;
    const targetTop = e.target.offsetTop + 1;
    if (!this.scrollKey) {
      this.scrollKey = panelKey;
    }

    if (this.scrollKey !== panelKey) {
      return;
    }
    clearTimeout(this.stopTimer);
    const deltaY = scrollTop - this.scrollTopMap.get(panelKey);
    this.scrollTopMap.set(panelKey, scrollTop);

    const overIndex =
      this.dataList[panelKey].findIndex((item: any, index: number) => {
        const target: any = document.getElementById(item.key);
        return target.offsetTop > scrollTop + targetTop;
      }) || 1;
    this.otherPanelLinkage(panelKey, overIndex - 1, deltaY);
    this.isStop();
  };
}

export default (): React.ReactNode => {
  const [activePanelKeys, setActivePanelKeys] = useState([]);
  const panelList = useCreation(() => new PanelList(), []);
  const leftPanelData = useMemo(() => getPanelData(PANEL_KEYS.LEFT, lines), []);
  const rightPanelData = useMemo(() => getPanelData(PANEL_KEYS.RIGHT, lines), []);

  const scrollPanel = usePersistFn((e, panelKey, panelListIns) => {
    panelListIns.onScroll(e, panelKey);
  });

  const changeActivePanel = usePersistFn((activeKeys: any) => {
    setActivePanelKeys(activeKeys);
  });

  useEffect(() => {
    panelList.setDataSource({
      [PANEL_KEYS.LEFT]: leftPanelData.dataList,
      [PANEL_KEYS.RIGHT]: rightPanelData.dataList
    });
  }, []);
  return (
    <PageContainer>
      <div className={styles.header}>
        <Title style={{ marginBottom: 0 }} level={3}>左右折叠框联动(展开&滚动)</Title>
      </div>
      <div className={styles.panelContainer}>
        <div className={styles.panelItem} style={{ marginRight: 20 }}>
          <div className={styles.title}>Left</div>
          <div
            ref={(c: any) => {
              panelList.leftPanel = c;
            }}
            onScroll={(e) => scrollPanel(e, PANEL_KEYS.LEFT, panelList)}
            className={styles.panelContent}
          >
            <Collapse activeKey={activePanelKeys} onChange={changeActivePanel}>
              {leftPanelData.dataList.map((item, index) => {
                return <Panel
                  key={index}
                  id={item.key}
                  header={item.title}
                >
                  <div className={styles.json}>
                    <pre>
                      {item.content}
                    </pre>
                  </div>
                </Panel>
              })}
            </Collapse>
          </div>
        </div>
        <div className={styles.panelItem}>
          <div className={styles.title}>Right</div>
          <div
            ref={(c: any) => {
              panelList.rightPanel = c;
            }}
            onScroll={(e) => scrollPanel(e, PANEL_KEYS.RIGHT, panelList)}
            className={styles.panelContent}
          >
            <Collapse activeKey={activePanelKeys} onChange={changeActivePanel}>
              {rightPanelData.dataList.map((item, index) => {
                return <Panel
                  key={index}
                  id={item.key}
                  header={item.title}
                >
                  <div className={styles.json}>
                    <pre>
                      {item.content}
                    </pre>
                  </div>
                </Panel>
              })}
            </Collapse>
          </div>
        </div>
      </div>
    </PageContainer>
  )
};

