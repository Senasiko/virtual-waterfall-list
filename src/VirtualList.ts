import { throttle } from './utils';
export interface Item {
  y: number;
  height: number;
}

export default class VirtualList {
  dom: Element;
  _items: Item[] = [];
  fromIndex = 0;
  endIndex = 0;
  cbs: { [x: string]: Function[] } = {};

  get viewItems() {
    return this.items.slice(this.fromIndex, this.endIndex + 1);
  }

  constructor(dom: Element, items: Item[]) {
    this.dom = dom;
    this.items = items;

    const listener = throttle(this.listener, 100);
    document.body.addEventListener('wheel', listener.bind(this));
    window.addEventListener('scroll', listener.bind(this));
  }

  get items() {
    return this._items
  }

  set items(val) {
    this._items = val;
    this.listener();
  }

  listener() {
    [this.fromIndex, this.endIndex] = this.getViewItemIndex();
    this.emit('change');
  }

  getViewItemIndex(): [number, number] {
    const { top: y } = this.dom.getBoundingClientRect() as DOMRect;
    let startY;
    if (y < 0) startY = -y;
    else if (y < window.innerHeight) startY = 0;
    else startY = window.innerHeight - y;
    const endY = window.innerHeight - y;

    let fromIndex = 0;
    let endIndex = this.items.length - 1;
    let index: number;

    while(true) {
      index = Math.floor((fromIndex + endIndex) / 2);
      if ((index === fromIndex && index !== endIndex) || index < 0) return [-1, -1];
      const direction = this.getItemDirection(this.items[index], startY, endY);
      if (direction === -1) fromIndex = index;
      else if (direction === 1) endIndex = index;
      else break;
    }

    let upEndY = endY;
    let downStartY = startY;
    for (let i = index; i >= 0; i--) {
      if (this.getItemDirection(this.items[i], startY, upEndY) === 0) {
        fromIndex = i;
        upEndY = Math.max(upEndY, this.items[i].y + this.items[i].height)
        downStartY = Math.min(downStartY, this.items[i].y);
      } else {
        break;
      }
    }
    for (let i = index; i < this.items.length; i++) {
      if (this.getItemDirection(this.items[i], downStartY, endY) === 0) {
        endIndex = i;
        downStartY = Math.min(downStartY, this.items[i].y);
      } else {
        break;
      }
    }
    return [fromIndex, endIndex];
  }

  getItemDirection(item: Item, startY: number, endY: number) {
    if (item.height + item.y < startY - 200) return -1;
    if (item.y > endY + 200) return 1;
    return 0;
  }

  clear() {
    this._items = [];
    this.fromIndex = 0;
    this.endIndex = 0;
  }

  on(name: string, cb: Function) {
    if (this.cbs[name]) this.cbs[name].push(cb);
    else this.cbs[name] = [cb];
  }

  emit(name: string, ...args: any[]) {
    if (this.cbs[name]) this.cbs[name].forEach(cb => cb(...args));
  }
}

