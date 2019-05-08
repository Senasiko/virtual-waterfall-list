export interface WaterfallItem {
	width: number;
	height: number;
	x: number;
	y: number;
	color?: string;
}
export interface WaterfallInitItem {
	width: number;
	height: number;
	_width?: number;
	_height?: number;
	padding?: number;
	widthPercent?: number;
	x?: number;
	y?: number;
}
export interface WaterfallOptions {
	width: number;
	maxHeight?: number;
}

export interface VirtualListItem {
	y: number;
	height: number;
}

export class Waterfall {
	width: number;
	height: number;
	items: WaterfallItem[];
	initItems: WaterfallInitItem[];
	nowRow: WaterfallItem[];
	isFirstLine: boolean;
	options: WaterfallOptions;
	readonly nowRowWidth: number;
	readonly nowRowMinBottomItem: WaterfallItem;
	constructor(items: WaterfallInitItem[], options: WaterfallOptions);
	add(items: WaterfallInitItem[]): WaterfallItem[];
	calculateItemAndToItems(items: WaterfallInitItem[]): WaterfallItem[];
	calculateItem(initItem: WaterfallInitItem): WaterfallItem;
	calculateAll(): void;
}

export class VirtualList {
	dom: Element;
	_items: VirtualListItem[];
	fromIndex: number;
	endIndex: number;
	cbs: {
		[x: string]: Function[];
	};
	readonly viewItems: VirtualListItem[];
	constructor(dom: Element, items: VirtualListItem[]);
	items: VirtualListItem[];
	listener(): void;
	getViewItemIndex(): [number, number];
	getItemDirection(item: VirtualListItem, startY: number, endY: number): 0 | 1 | -1;
	on(name: string, cb: Function): void;
	emit(name: string, ...args: any[]): void;
}

export as namespace VirtualWaterfall;
