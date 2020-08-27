import React, { useEffect } from 'react';
// import { Typography } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { useCreation, usePersistFn } from 'ahooks';

import { CanvasManager } from './classes';

import styles from './index.less';

export default (): React.ReactNode => {
  let cm: CanvasManager | any = useCreation(() => new CanvasManager(), []);
  const initRef = usePersistFn((c: HTMLCanvasElement) => {
    if (!cm.ele) {
      cm.init(c);
      cm.setWH(cm.domWidth, cm.domHeight);
      cm.drawStart();
    }
  });
  // useEffect(() => {
  //   return () => {
  //     cm = null;
  //   }
  // });
  return (
    <PageContainer>
      <p>七夕快乐</p>
      <canvas className={styles.canvas} ref={(c: HTMLCanvasElement) => initRef(c)}/>
    </PageContainer>
  )
};
