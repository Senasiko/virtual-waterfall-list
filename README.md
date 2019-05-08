# virtual-waterfall-list
virtual waterfall list
<img src="https://www.senasiko.com/images/virtual-waterfall.gif">
## usage
```
npm install virtual-waterfall-list
```
### Waterfall
```typescript
import { Waterfall } from 'virtual-waterfall-list';

const waterfall = new Waterfall(items, options);

/**
 * item {
 * 	 width: number;
 *	 height: number;
 *	 x: number;
 *	 y: number;
 * }
 */
console.log(waterfall.items);
```
### VirtualList
```typescript
import { VirtualList } from 'virtual-waterfall-list';

/**
 * item {
 *   y: number;
 *   height: number;
 * } 
 */
const virtualList = new VirtualList(dom, items);
let viewItems = virtualList.viewItems;

virtualList.on('change',() => {
  viewItems = virtualList.viewItems;
});

// viewItems is the array in viewport
console.log(viewItems);
```
### in Vue
```javascript
import Vue from 'vue';
import VirtualWaterfall from 'virtual-waterfall-list/dist/vue';

Vue.use(VirtualWaterfall);
```
In component, you can get Waterfall data by $Waterfall
```javascript
const waterfall = this.$Waterfall(items, options);
```
Use as component
```
<template>
  <virtual-waterfall ref="virtualWaterfall">
    <template slot-scope="{ nowItems }">
      <component
        class="masonry-artwork"
        v-for="item in nowItems"
        :key="item.id"
        :style="{
          top: `${item.y}px`,
          left: `${item.x}px`,
          width: `${item.width}px`,
          position: 'absolute'
      }"/>
    </template>
  </virtual-waterfall>
</template>
<script>
export default {
  methods: {
    addData() {
      this.$refs.virtualWaterfall.add(items);
    }
  }
}
</script>
```
