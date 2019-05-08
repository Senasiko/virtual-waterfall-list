import Waterfall from './Waterfall';
import VirtualList from './VirtualList';
import { throttle } from './utils';

export default {
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
            this.virtualList.items = this.waterfall.items;
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
        this.virtualList = new VirtualList(this.$el, this.waterfall.items);
        this.initialized = true;
        this.virtualList.on('change', this.update.bind(this));

        this.reDraw = throttle(() => {
          this.width = this.$el.getBoundingClientRect().width;
          this.waterfall.width = this.width;
          this.waterfall.calculateAll();
          this.virtualList.items = this.waterfall.items;
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
        this.observe.disconnent();
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
}
