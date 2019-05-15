'use strict';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __values(o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
}

function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}

function __spread() {
    for (var ar = [], i = 0; i < arguments.length; i++)
        ar = ar.concat(__read(arguments[i]));
    return ar;
}

var Waterfall = /** @class */ (function () {
    function Waterfall(items, options) {
        this.height = 0;
        this.topItems = [];
        this.bottomItems = [];
        this.initItems = [];
        this.nowRow = [];
        this.isFirstLine = true;
        this.width = options.width;
        this.options = options;
        this.add(items);
    }
    Object.defineProperty(Waterfall.prototype, "nowRowWidth", {
        get: function () {
            var e_1, _a;
            var width = 0;
            try {
                for (var _b = __values(this.nowRow), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var item = _c.value;
                    width += item.width;
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return width;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Waterfall.prototype, "nowRowMinBottomItem", {
        get: function () {
            if (this.isFirstLine) {
                var widths = this.nowRow.map(function (item) { return item.width; });
                return {
                    x: widths.length > 0 ? widths.reduce(function (a, b) { return a + b; }) : 0,
                    y: 0,
                    width: 0,
                    height: 0,
                };
            }
            return this.nowRow.sort(function (a, b) { return (a.y + a.height) - (b.y + b.height) || (a.x - b.x); })[0];
        },
        enumerable: true,
        configurable: true
    });
    Waterfall.prototype.add = function (items) {
        console.time('waterfall');
        this.initItems = this.initItems.concat(items);
        var rItems = this.calculateItemAndToItems(items);
        console.timeEnd('waterfall');
        return rItems;
    };
    Waterfall.prototype.calculateItemAndToItems = function (items) {
        var e_2, _a;
        var resultItems = [];
        try {
            for (var items_1 = __values(items), items_1_1 = items_1.next(); !items_1_1.done; items_1_1 = items_1.next()) {
                var initItem = items_1_1.value;
                var item = this.calculateItem(initItem);
                var i = this.bottomItems.length - 1;
                for (; i >= 0; i--) {
                    if (item.y + item.height >= this.bottomItems[i].y + this.bottomItems[i].height)
                        break;
                }
                this.bottomItems.splice(i + 1, 0, item);
                i = this.topItems.length - 1;
                for (; i >= 0; i--) {
                    if (item.y >= this.topItems[i].y)
                        break;
                }
                this.topItems.splice(i + 1, 0, item);
                resultItems.push(item);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (items_1_1 && !items_1_1.done && (_a = items_1.return)) _a.call(items_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return resultItems;
    };
    Waterfall.prototype.calculateItem = function (initItem) {
        var e_3, _a;
        if (initItem.widthPercent) {
            var padding = initItem.padding || 0;
            initItem._width = initItem._width || initItem.width;
            initItem._height = initItem._height || initItem.height;
            initItem.width = this.width * initItem.widthPercent;
            initItem.height = Math.min(initItem._height, (initItem.width - padding * 2) * (initItem._height / initItem._width), this.options.maxHeight || initItem._height) + padding * 2;
        }
        if (Math.floor(initItem.width + this.nowRowWidth) > this.width) {
            this.isFirstLine = false;
        }
        var item = __assign({}, initItem, { x: this.nowRowMinBottomItem.x, y: this.nowRowMinBottomItem.y + this.nowRowMinBottomItem.height });
        this.height = Math.max(this.height, item.y + item.height);
        var nowWidth = 0;
        var cacheRow = this.nowRow.concat([item]).sort(function (a, b) { return (b.y + b.height) - (a.y + a.height) || (b.x - a.x); });
        this.nowRow = [];
        try {
            for (var cacheRow_1 = __values(cacheRow), cacheRow_1_1 = cacheRow_1.next(); !cacheRow_1_1.done; cacheRow_1_1 = cacheRow_1.next()) {
                var i = cacheRow_1_1.value;
                if (Math.floor(i.width + nowWidth) > this.width)
                    break;
                nowWidth += i.width;
                this.nowRow.push(i);
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (cacheRow_1_1 && !cacheRow_1_1.done && (_a = cacheRow_1.return)) _a.call(cacheRow_1);
            }
            finally { if (e_3) throw e_3.error; }
        }
        return item;
    };
    Waterfall.prototype.clear = function () {
        this.isFirstLine = true;
        this.nowRow = [];
        this.topItems = [];
        this.bottomItems = [];
        this.height = 0;
        this.initItems = [];
    };
    Waterfall.prototype.calculateAll = function () {
        var initItems = this.initItems;
        this.clear();
        this.add(initItems);
    };
    return Waterfall;
}());

var throttle = function (func, wait) {
    var timer;
    var last = new Date().getTime();
    var currArgs = [];
    return function throttled() {
        var _this = this;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var curr = new Date().getTime();
        currArgs = args;
        var run = function () {
            clearTimeout(timer);
            timer = 0;
            func.apply(_this, currArgs);
            last = new Date().getTime();
        };
        if (curr - last > wait) {
            run();
        }
        else if (!timer) {
            timer = window.setTimeout(run, wait);
        }
    };
};

var VirtualList = /** @class */ (function () {
    function VirtualList(dom, _a) {
        var topItems = _a.topItems, bottomItems = _a.bottomItems;
        this.topItems = [];
        this.bottomItems = [];
        this.offsetTop = 0;
        this.viewItems = [];
        this.cbs = {};
        this.dom = dom;
        this.topItems = topItems;
        this.bottomItems = bottomItems;
        this.initOffsetTop();
        this.listener = throttle(this._listener, 100);
        window.addEventListener('scroll', this.listener.bind(this));
        this._listener();
    }
    VirtualList.prototype.initOffsetTop = function () {
        var el = this.dom;
        var top = el.offsetTop;
        while (el.offsetParent) {
            el = el.offsetParent;
            top += el.offsetTop;
        }
        this.offsetTop = top;
    };
    VirtualList.prototype.setItems = function (_a) {
        var topItems = _a.topItems, bottomItems = _a.bottomItems;
        this.topItems = topItems;
        this.bottomItems = bottomItems;
        this._listener();
    };
    VirtualList.prototype._listener = function () {
        var y = this.offsetTop - window.pageYOffset;
        var startY;
        var innerHeight = window.innerHeight;
        if (y < 0)
            startY = -y;
        else if (y < innerHeight)
            startY = 0;
        else
            startY = innerHeight - y;
        var endY = innerHeight - y;
        var bottomItems = this.getViewItem(this.bottomItems, startY, endY);
        var topItems = this.getViewItem(this.topItems, startY, endY);
        this.viewItems = Array.from(new Set(__spread(bottomItems, topItems)));
        this.emit('change', this.viewItems);
    };
    VirtualList.prototype.getViewItem = function (items, startY, endY) {
        var fromIndex = 0;
        var endIndex = items.length - 1;
        var index;
        if (items.length === 0)
            return [];
        while (true) {
            index = Math.floor((fromIndex + endIndex) / 2);
            if ((index === fromIndex && index !== endIndex) || index < 0)
                return [];
            var direction = this.getItemDirection(items[index], startY, endY);
            if (direction === -1)
                fromIndex = index;
            else if (direction === 1)
                endIndex = index;
            else
                break;
        }
        for (var i = index; i >= 0; i -= 1) {
            if (this.getItemDirection(items[i], startY, endY) === 0) {
                fromIndex = i;
            }
            else {
                break;
            }
        }
        for (var i = index; i < items.length; i += 1) {
            if (this.getItemDirection(items[i], startY, endY) === 0) {
                endIndex = i;
            }
            else {
                break;
            }
        }
        return items.slice(fromIndex, endIndex + 1);
    };
    VirtualList.prototype.getItemDirection = function (item, startY, endY) {
        if (item.height + item.y < startY - 200)
            return -1;
        if (item.y > endY + 200)
            return 1;
        return 0;
    };
    VirtualList.prototype.clear = function () {
        this.topItems = [];
        this.bottomItems = [];
        this.viewItems = [];
    };
    VirtualList.prototype.on = function (name, cb) {
        if (this.cbs[name])
            this.cbs[name].push(cb);
        else
            this.cbs[name] = [cb];
    };
    VirtualList.prototype.emit = function (name) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (this.cbs[name])
            this.cbs[name].forEach(function (cb) { return cb.apply(void 0, __spread(args)); });
    };
    return VirtualList;
}());

var vueInstall = {
  install: (vue) => {
    Object.defineProperty(vue.prototype, '$Waterfall', {
      value: Waterfall
    });
    vue.component('virtualWaterfall', {
      props: {
        items: {
          type: Array,
          default: [],
        },
        maxHeight: {
          type: Number,
          default: null,
        },
      },
      data() {
        return {
          cacheItems: [],
          width: 0,
          initialized: false,
        }
      },
      watch: {
        initialized(val) {
          if (val && this.cacheItems) {
            this.add(this.cacheItems);
            this.cacheItems = [];
          }
        }
      },
      methods: {
        add(items) {
          if (this.initialized) {
            this.waterfall.add(items);
            this.virtualList.setItems(this.waterfall);
            this.update();
          } else {
            this.cacheItems = this.cacheItems.concat(items);
          }
        },
        clear() {
          this.virtualList.clear();
          this.waterfall.clear();
          this.update();
        },
        update() {
          this.$forceUpdate();
        }
      },
      mounted() {
        this.width = this.$el.getBoundingClientRect().width;
        this.waterfall = new this.$Waterfall(this.items, { width: this.width, maxHeight: this.maxHeight });
        this.virtualList = new VirtualList(this.$el, this.waterfall);
        this.initialized = true;
        this.virtualList.on('change', this.update.bind(this));

        this.reDraw = throttle(() => {
          this.width = this.$el.getBoundingClientRect().width;
          this.waterfall.width = this.width;
          this.waterfall.calculateAll();
          this.virtualList.setItems(this.waterfall);
          this.update();
        }, 200);

        window.addEventListener('resize', this.reDraw);
        this.observe = new MutationObserver(() => {
          const { width } = this.$el.getBoundingClientRect();
          if (width !== this.width) this.reDraw();
        });
        this.observe.observe(this.$el, {
          attributes: true,
        });
      },
      destroyed() {
        this.observe.disconnect();
      },
      render(h) {
        return h('div', {
          staticClass: 'virtual-list',
          style: {
            position: 'relative',
            height: `${this.waterfall && this.waterfall.height}px`
          }
        }, this.width ? this.$scopedSlots.default({ nowItems: this.virtualList ? this.virtualList.viewItems : [] }) : []);
      },
    });
  }
};

module.exports = vueInstall;
