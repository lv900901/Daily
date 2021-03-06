import { LimitArray } from '@/utils/utils';

export class CanvasBase {
  ele: HTMLCanvasElement | any = null;
  ctx: CanvasRenderingContext2D | any = null;
  domWidth: number = 0;
  domHeight: number = 0;
  constructor(ele?: HTMLCanvasElement) {
    this.init(ele);
  };
  init: Function = (ele: HTMLCanvasElement) => {
    if (ele) {
      this.ele = ele;
      this.ctx = ele.getContext('2d');
      let stylesObj: CSSStyleDeclaration | null = getComputedStyle(ele);
      this.domWidth = parseFloat(stylesObj.width);
      this.domHeight = parseFloat(stylesObj.height);
      stylesObj = null;
    }
  }
}

export class TextBase {
  word: string = '';
  width: number = 0;
  height: number = 0;
  x: number = 0;
  y: number = 0;
  imageData: ImageData | any = null;
  ctx: CanvasRenderingContext2D;
  limitArray: LimitArray;
  limitArrayLength: number = 4;
  constructor(ctx: CanvasRenderingContext2D, word: string, position?: Classes.Position) {
    this.ctx = ctx;
    this.word = word;
    const width = this.ctx.measureText(word).width;
    this.width = width;
    this.y = position?.y || 0;
    this.height = position?.height || 0;
    this.limitArray = new LimitArray(this.limitArrayLength);
  }
  setX: Function = (x: number) => {
    this.x = x;
  }
  getImageData: Function = () => {
    this.imageData = this.ctx.getImageData(this.x, this.y, this.width, this.height);
    return this.imageData;
  }
  calcPosition: Function = () => {
    const points = [];
    const data = this.getImageData().data;
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const i = y * 4 * this.width +  x * 4;
        const rgba = data.slice(i, i + 4).join('');
        if (rgba !== '0000') {
          if (!this.limitArray.isCover(x, y)) {
            points.push({x: this.x + x, y: this.y + y});
            x += this.limitArrayLength;
          }
          
        }
      }
    }
    return points;
  }
}

export class TextBaseControl {
  text: string = '';
  words: TextBase[] = [];
  sumWidth: number = 0;
  letterSpaces: number = 12;
  ctx: CanvasRenderingContext2D;
  constructor(ctx: CanvasRenderingContext2D, text: string, position?: Classes.Position) {
    this.ctx = ctx;
    this.text = text;
    let sumWidth = -1 * this.letterSpaces;
    text.split('').forEach(item => {
      const textBase = new TextBase(ctx, item, position);
      sumWidth = sumWidth + textBase.width + this.letterSpaces;
      this.words.push(textBase);
    });
    this.sumWidth = sumWidth;
  }
  initPosition: Function = (width: number) => {
    let offsetLeft = (width - this.sumWidth) / 2;
    this.words.forEach(item => {
      item.setX(offsetLeft);
      offsetLeft = offsetLeft + item.width + this.letterSpaces;
    });
    return this;
  }
}