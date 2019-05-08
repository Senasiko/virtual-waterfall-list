"use strict";var __assign=function(){return(__assign=Object.assign||function(t){for(var i,e=1,h=arguments.length;e<h;e++)for(var s in i=arguments[e])Object.prototype.hasOwnProperty.call(i,s)&&(t[s]=i[s]);return t}).apply(this,arguments)},Waterfall=function(){function t(t,i){this.height=0,this.items=[],this.initItems=[],this.nowRow=[],this.isFirstLine=!0,this.width=i.width,this.options=i,this.add(t)}return Object.defineProperty(t.prototype,"nowRowWidth",{get:function(){for(var t=0,i=0,e=this.nowRow;i<e.length;i++){t+=e[i].width}return t},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"nowRowMinBottomItem",{get:function(){if(this.isFirstLine){var t=this.nowRow.map(function(t){return t.width});return{x:t.length>0?t.reduce(function(t,i){return t+i}):0,y:0,width:0,height:0}}return this.nowRow.sort(function(t,i){return t.y+t.height-(i.y+i.height)||t.x-i.x})[0]},enumerable:!0,configurable:!0}),t.prototype.add=function(t){return this.initItems=this.initItems.concat(t),this.calculateItemAndToItems(t)},t.prototype.calculateItemAndToItems=function(t){for(var i=[],e=0,h=t;e<h.length;e++){for(var s=h[e],n=this.calculateItem(s),r=this.items.length-1;r>=0&&!(n.y+n.height>this.items[r].y+this.items[r].height);r--);this.items.splice(r+1,0,n),i.push(n)}return i},t.prototype.calculateItem=function(t){if(t.widthPercent){var i=t.padding||0;t._width=t._width||t.width,t._height=t._height||t.height,t.width=this.width*t.widthPercent,t.height=Math.min(t._height,(t.width-2*i)*(t._height/t._width),this.options.maxHeight||t._height)+2*i}Math.floor(t.width+this.nowRowWidth)>this.width&&(this.isFirstLine=!1);var e=__assign({},t,{x:this.nowRowMinBottomItem.x,y:this.nowRowMinBottomItem.y+this.nowRowMinBottomItem.height});this.height=Math.max(this.height,e.y+e.height);var h=0,s=this.nowRow.concat([e]).sort(function(t,i){return i.y+i.height-(t.y+t.height)||i.x-t.x});this.nowRow=[];for(var n=0,r=s;n<r.length;n++){var o=r[n];if(Math.floor(o.width+h)>this.width)break;h+=o.width,this.nowRow.push(o)}return e},t.prototype.calculateAll=function(){this.isFirstLine=!0,this.nowRow=[],this.items=[],this.height=0,this.calculateItemAndToItems(this.initItems)},t}(),throttle=function(t,i){var e,h,s=[];return function(){for(var n=this,r=[],o=0;o<arguments.length;o++)r[o]=arguments[o];var a=(new Date).getTime();s=r;var l=function(){clearTimeout(e),e=0,t.apply(n,s),h=(new Date).getTime()};a-h>i?l():e||(e=window.setTimeout(l,i))}},VirtualList=function(){function t(t,i){this._items=[],this.fromIndex=0,this.endIndex=0,this.cbs={},this.dom=t,this.items=i;var e=throttle(this.listener,100);document.body.addEventListener("wheel",e.bind(this)),window.addEventListener("scroll",e.bind(this))}return Object.defineProperty(t.prototype,"viewItems",{get:function(){return this.items.slice(this.fromIndex,this.endIndex+1)},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"items",{get:function(){return this._items},set:function(t){this._items=t,this.listener()},enumerable:!0,configurable:!0}),t.prototype.listener=function(){var t;t=this.getViewItemIndex(),this.fromIndex=t[0],this.endIndex=t[1],this.emit("change")},t.prototype.getViewItemIndex=function(){var t,i=this.dom.getBoundingClientRect().y;t=i<0?-i:i<window.innerHeight?0:window.innerHeight-i;for(var e,h=window.innerHeight-i,s=0,n=this.items.length-1;;){if((e=Math.floor((s+n)/2))===s&&e!==n||e<0)return[-1,-1];var r=this.getItemDirection(this.items[e],t,h);if(-1===r)s=e;else{if(1!==r)break;n=e}}for(var o=h,a=t,l=e;l>=0&&0===this.getItemDirection(this.items[l],t,o);l--)s=l,o=Math.max(o,this.items[l].y+this.items[l].height),a=Math.min(a,this.items[l].y);for(l=e;l<this.items.length&&0===this.getItemDirection(this.items[l],a,h);l++)n=l,a=Math.min(a,this.items[l].y);return[s,n]},t.prototype.getItemDirection=function(t,i,e){return t.height+t.y<i-200?-1:t.y>e+200?1:0},t.prototype.on=function(t,i){this.cbs[t]?this.cbs[t].push(i):this.cbs[t]=[i]},t.prototype.emit=function(t){for(var i=[],e=1;e<arguments.length;e++)i[e-1]=arguments[e];this.cbs[t]&&this.cbs[t].forEach(function(t){return t.apply(void 0,i)})},t}(),vueInstall={install:t=>{Object.defineProperty(t.prototype,"$Waterfall",{value:Waterfall}),t.component("virtualWaterfall",{props:{items:{type:Array,default:[]},maxHeight:{type:Number,default:null}},data:()=>({nowItems:[],cacheItems:[],width:0,height:0,initialized:!1}),watch:{initialized(t){t&&this.cacheItems&&(this.add(this.cacheItems),this.cacheItems=[])}},methods:{add(t){this.initialized?(this.waterfall.add(t),this.virtualList.items=this.waterfall.items,this.nowItems=this.virtualList.viewItems,this.height=this.waterfall.height):this.cacheItems=this.cacheItems.concat(t)}},mounted(){this.width=this.$el.getBoundingClientRect().width,this.waterfall=new this.$Waterfall(this.items,{width:this.width,maxHeight:this.maxHeight}),this.virtualList=new VirtualList(this.$el,this.waterfall.items),this.initialized=!0,this.height=this.waterfall.height,this.virtualList.on("change",()=>{this.nowItems=this.virtualList.viewItems}),this.reDraw=throttle(()=>{this.width=this.$el.getBoundingClientRect().width,this.waterfall.width=this.width,this.waterfall.calculateAll(),this.virtualList.items=this.waterfall.items,this.height=this.waterfall.height},200),window.addEventListener("resize",this.reDraw),this.observe=new MutationObserver(()=>{const{width:t}=this.$el.getBoundingClientRect();t!==this.width&&this.reDraw()}),this.observe.observe(this.$el,{attributes:!0})},destroyed(){this.observe.disconnent()},render(t){return t("div",{staticClass:"virtual-list",style:{position:"relative",height:`${this.height}px`}},this.width?this.$scopedSlots.default({nowItems:this.nowItems}):[])}})}};module.exports=vueInstall;