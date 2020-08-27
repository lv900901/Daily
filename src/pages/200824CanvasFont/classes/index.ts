import {CanvasBase, TextBaseControl} from '@/classes/Base';
import {Timeout} from '@/utils/utils';

export class TextControl extends TextBaseControl {
  letterSpaces: number = 60;
  flowerPoints: Array<Classes.Position> = []
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
        this.ctx.clearRect(item.x, item.y,  item.width, item.height);
        this.ctx.fillText(item.word, item.x, item.y);
        const newX = item.x + item.width * (count / totalCount);
        const newWidth = item.width * ((totalCount - count) / totalCount);
        // this.ctx.fillRect(newX, newY,  newWidth, item.height);
        this.ctx.clearRect(newX, item.y,  newWidth, item.height);
        // item.getImageData();

      });
      Timeout(() => {
        this.drawWordByAnimate(count + 1, totalCount);
      }, 1)
    } else {
      this.words.forEach(item => {
        this.ctx.fillText(item.word, item.x, item.y);
        this.flowerPoints = this.flowerPoints.concat(item.calcPosition());
      });
      this.ctx.textAlign = 'center';
      this.ctx.fillStyle = 'red';
      this.ctx.textBaseline = 'middle';
      this.ctx.font = '200 16px Xingkai SC';
      const pointsIt = this.flowerPoints[Symbol.iterator]();
      this.drawFlower(pointsIt);
    }
  }
  drawFlower: Function = (pointsIt: Iterator<any>) => {
    const itValue: any = pointsIt.next();
    const position: Classes.Position = itValue.value;
    const done = itValue.done;
    if (!done) {
      Timeout(() => {
        this.ctx.fillText('✿', position.x || 0, position.y || 0);
        this.drawFlower(pointsIt);
      }, 5);
    }
  }
  drawWord: Function = () => {
    this.words.forEach(item => {
      this.ctx.fillText(item.word, item.x, item.y);
    });
  }
}

export class CanvasManager extends CanvasBase {
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
    // console.time();
    this.ctx.clearRect(0, 0, this.width, this.height);
    const text = '七夕快乐';
    this.ctx.font = '600 60px Xingkai SC';
    this.ctx.textBaseline = 'top';
    this.textControl = new TextControl(this.ctx, text, {y: 200, height: 60});
    this.textControl.initPosition(this.width).drawAnimate(16);
    // console.timeEnd();
  }
} 