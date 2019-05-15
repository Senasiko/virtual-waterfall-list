export interface BaseItem {
    y: number;
    height: number;
}
export declare type Item<T> = BaseItem & T;
export declare type ItemsObj<T> = {
    topItems: Item<T>[];
    bottomItems: Item<T>[];
};
export default class VirtualList<T = {}> {
    dom: Element;
    private topItems;
    private bottomItems;
    viewItems: Item<T>[];
    listener: () => void;
    cbs: {
        [x: string]: Function[];
    };
    constructor(dom: Element, { topItems, bottomItems, }: ItemsObj<T>);
    setItems({ topItems, bottomItems, }: ItemsObj<T>): void;
    _listener(): void;
    getViewItem(items: Item<T>[], startY: number, endY: number): Item<T>[];
    getItemDirection(item: Item<T>, startY: number, endY: number): 1 | 0 | -1;
    clear(): void;
    on(name: string, cb: Function): void;
    emit(name: string, ...args: any[]): void;
}
