import React from 'react';
// import { Typography } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { useCreation, usePersistFn } from 'ahooks';

import styles from './index.less';

import {CanvasBase, TextBaseControl} from '@/classes/Base';
import {Timeout} from '@/utils/utils';

class TextControl extends TextBaseControl {
  letterSpaces: number = 60;
  constructor(ctx: CanvasRenderingContext2D, text: string, position?: Classes.Position) {
    super(ctx, text, position);
    this.sumWidth = this.words.reduce((prev, curr) => {
      prev = prev + curr.width + this.letterSpaces;
      return prev;
    }, -1 * this.letterSpaces);

  }

  drawAnimate: Function = (totalCount: number) => {
    this.drawWordByAnimate(1, totalCount)
  }

  drawWordByAnimate: Function = (count: number, totalCount: number) => {
    if (count !== totalCount) {
      this.words.forEach(item => {
        this.ctx.fillText(item.word, item.x, item.y);
        const newX = item.x + item.width * (count / totalCount);
        const newY = item.y - item.height + 10;
        const newWidth = item.width * ((totalCount - count) / totalCount);
        // this.ctx.fillStyle="red";
        // this.ctx.fillRect(newX, item.y - item.height + 10,  newWidth, item.height);
        this.ctx.clearRect(newX, newY,  newWidth, item.height + 10);
        item.getImageData();

      });
      Timeout(() => {
        this.drawWordByAnimate(count + 1, totalCount);
      }, 1)
    } else {
      this.words.forEach(item => {
        this.ctx.fillText(item.word, item.x, item.y);
        // item.getImageData()
      });
    }
  }

  drawWord: Function = () => {
    this.words.forEach(item => {
      this.ctx.fillText(item.word, item.x, item.y);
      // item.getImageData()
    });
    console.log(this.words);
  }
}

class CanvasManager extends CanvasBase {
  width: number = 0;
  height: number = 0;
  textControl: TextControl | any = null;
  constructor(props?: HTMLCanvasElement) {
    super(props)
  }
  setWH: Function = (width: number, height: number) => {
    this.width = width;
    this.height = height;
    if (this.ele) {
      this.ele.width = width;
      this.ele.height = height;
      // this.init(this.ele);
    }
  }

  drawStart: Function = () => {
    console.time();
    const text = '七夕快乐';
    this.ctx.font = '600 60px Xingkai SC';
    this.textControl = new TextControl(this.ctx, text, {y: 200, height: 60});
    this.textControl.initPosition(this.width).drawAnimate(16);
    console.timeEnd();
  }
}

export default (): React.ReactNode => {
  const cm = useCreation(() => new CanvasManager(), []);
  const initRef = usePersistFn((c: HTMLCanvasElement) => {
    cm.init(c);
    cm.setWH(cm.domWidth, cm.domHeight);
    cm.drawStart();
  });
  return (
    <PageContainer>
      <p>七夕快乐</p>
      <canvas className={styles.canvas} ref={(c: HTMLCanvasElement) => initRef(c)}/>
    </PageContainer>
  )
};
