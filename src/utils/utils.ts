import { parse } from 'querystring';

/* eslint no-useless-escape:0 import/prefer-default-export:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export const isUrl = (path: string): boolean => reg.test(path);

export const isAntDesignPro = (): boolean => {
  if (ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
    return true;
  }
  return window.location.hostname === 'preview.pro.ant.design';
};

// 给官方演示站点用，用于关闭真实开发环境不需要使用的特性
export const isAntDesignProOrDev = (): boolean => {
  const { NODE_ENV } = process.env;
  if (NODE_ENV === 'development') {
    return true;
  }
  return isAntDesignPro();
};

export const getPageQuery = () => {
  const { href } = window.location;
  const qsIndex = href.indexOf('?');
  const sharpIndex = href.indexOf('#');

  if (qsIndex !== -1) {
    if (qsIndex > sharpIndex) {
      return parse(href.split('?')[1]);
    }

    return parse(href.slice(qsIndex + 1, sharpIndex));
  }

  return {};
};

export const Timeout = (callback: Function, count: number) => {
  let sum = count;
  const loop = () => {
    requestAnimationFrame(() => {
      if (!sum--) {
        sum = null as unknown as number;
        callback();
      } else {
        loop();
      }
    })
  };
  loop();
};

export class LimitArray {
  length: number = 0;
  line: number = 0;
  array: Array<any> = [];
  constructor(len: number) {
    this.length = len;
    this.array = new Array(len).fill([]);
  }
  push: Function = (x: number, line: number) => {
    const delta = line - this.line;
    const range = [x - this.length, x + this.length];
    if (delta >= this.length) {
      this.array = new Array(this.length).fill([]);
    } else {
      this.array = this.array.slice(delta).concat(new Array(delta).fill([]))
    }

    this.array.map(item => {
      item.push(range);
      return item;
    });

    this.line = line;
  }
  calcCover: Function = (x: number, line: number) => {
    const delta = line - this.line;
    if (delta >= this.length) {
      return false;
    }

    for (let lineRanges of this.array) {
      if (lineRanges.find((item: number[]) => {
        const min = item[0];
        const max = item[1] || min;
        return x >= min && x <=max; 
      })) {
        return true;
      }
    }

    return false;
  }
  isCover: Function = (x: number, line: number) => {
    const result = this.calcCover(x, line);
    if (!result) {
      this.push(x, line);
    }

    return result;
  }
}
