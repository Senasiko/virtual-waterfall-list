interface Item {
  width: number;
  height: number;
  x: number;
  y: number;
  color?: string;
}

export interface InitItem {
  width: number;
  height: number;
  _width?: number;
  _height?: number;
  padding?: number;
  widthPercent?: number;
  x?: number;
  y?: number;
}

interface Options {
  width: number;
  maxHeight?: number;
}
export default class Waterfall {
  width: number;

  height: number = 0;

  items: Item[] = [];

  initItems: InitItem[] = [];

  nowRow: Item[] = [];

  isFirstLine = true;

  options: Options;

  get nowRowWidth(): number {
    let width = 0;
    for (let item of this.nowRow) width += item.width;
    return width;
  }

  get nowRowMinBottomItem(): Item {
    if (this.isFirstLine) {
      const widths = this.nowRow.map(item => item.width);
      return {
        x: widths.length > 0 ? widths.reduce((a, b) => a + b) : 0,
        y: 0,
        width: 0,
        height: 0,
      }
    } 
    return this.nowRow.sort((a, b) => (a.y + a.height) - (b.y + b.height) || (a.x - b.x))[0];
  }

  constructor(items: InitItem[], options: Options) {
    this.width = options.width;
    this.options = options;
    this.add(items);
  }

  add(items: InitItem[]): Item[] {
    this.initItems = this.initItems.concat(items);
    return this.calculateItemAndToItems(items);
  }

  calculateItemAndToItems(items: InitItem[]): Item[] {
    const resultItems: Item[] = [];
    for (let initItem of items) {
      const item = this.calculateItem(initItem);
      let i = this.items.length - 1;
      for (; i >= 0; i--) {
        if (item.y + item.height > this.items[i].y + this.items[i].height) break;
      }
      this.items.splice(i + 1, 0, item);
      resultItems.push(item)

    }
    return resultItems;
  }

  calculateItem(initItem: InitItem): Item {
    if (initItem.widthPercent) {
      const padding = initItem.padding || 0;
      initItem._width = initItem._width || initItem.width;
      initItem._height = initItem._height || initItem.height;
      initItem.width = this.width * initItem.widthPercent;
      initItem.height = Math.min(
        initItem._height, 
        (initItem.width - padding * 2) * (initItem._height / initItem._width),
        this.options.maxHeight || initItem._height,
      ) + padding * 2;
    }
    if (Math.floor(initItem.width + this.nowRowWidth) > this.width) {
      this.isFirstLine = false;
    } 
    const item: Item = {
      ...initItem,
      x: this.nowRowMinBottomItem.x,
      y: this.nowRowMinBottomItem.y + this.nowRowMinBottomItem.height,
    };
    this.height = Math.max(this.height, item.y + item.height);

    let nowWidth = 0;
    const cacheRow = this.nowRow.concat([item]).sort((a, b) => (b.y + b.height) - (a.y + a.height) || (b.x - a.x));
    this.nowRow = [];
    for (let i of cacheRow) {
      if (Math.floor(i.width + nowWidth) > this.width) break;
      nowWidth += i.width;
      this.nowRow.push(i);
    }
    return item;
  }

  calculateAll() {
    this.isFirstLine = true;
    this.nowRow = [];
    this.items = [];
    this.height = 0;
    this.calculateItemAndToItems(this.initItems);
  }
}

