"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var __assign=function(){return(__assign=Object.assign||function(t){for(var i,e=1,n=arguments.length;e<n;e++)for(var h in i=arguments[e])Object.prototype.hasOwnProperty.call(i,h)&&(t[h]=i[h]);return t}).apply(this,arguments)},Waterfall=function(){function t(t,i){this.height=0,this.items=[],this.initItems=[],this.nowRow=[],this.isFirstLine=!0,this.width=i.width,this.options=i,this.add(t)}return Object.defineProperty(t.prototype,"nowRowWidth",{get:function(){for(var t=0,i=0,e=this.nowRow;i<e.length;i++){t+=e[i].width}return t},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"nowRowMinBottomItem",{get:function(){if(this.isFirstLine){var t=this.nowRow.map(function(t){return t.width});return{x:t.length>0?t.reduce(function(t,i){return t+i}):0,y:0,width:0,height:0}}return this.nowRow.sort(function(t,i){return t.y+t.height-(i.y+i.height)||t.x-i.x})[0]},enumerable:!0,configurable:!0}),t.prototype.add=function(t){return this.initItems=this.initItems.concat(t),this.calculateItemAndToItems(t)},t.prototype.calculateItemAndToItems=function(t){for(var i=[],e=0,n=t;e<n.length;e++){for(var h=n[e],o=this.calculateItem(h),s=this.items.length-1;s>=0&&!(o.y+o.height>this.items[s].y+this.items[s].height);s--);this.items.splice(s+1,0,o),i.push(o)}return i},t.prototype.calculateItem=function(t){if(t.widthPercent){var i=t.padding||0;t._width=t._width||t.width,t._height=t._height||t.height,t.width=this.width*t.widthPercent,t.height=Math.min(t._height,(t.width-2*i)*(t._height/t._width),this.options.maxHeight||t._height)+2*i}Math.floor(t.width+this.nowRowWidth)>this.width&&(this.isFirstLine=!1);var e=__assign({},t,{x:this.nowRowMinBottomItem.x,y:this.nowRowMinBottomItem.y+this.nowRowMinBottomItem.height});this.height=Math.max(this.height,e.y+e.height);var n=0,h=this.nowRow.concat([e]).sort(function(t,i){return i.y+i.height-(t.y+t.height)||i.x-t.x});this.nowRow=[];for(var o=0,s=h;o<s.length;o++){var r=s[o];if(Math.floor(r.width+n)>this.width)break;n+=r.width,this.nowRow.push(r)}return e},t.prototype.calculateAll=function(){this.isFirstLine=!0,this.nowRow=[],this.items=[],this.height=0,this.calculateItemAndToItems(this.initItems)},t}(),throttle=function(t,i){var e,n,h=[];return function(){for(var o=this,s=[],r=0;r<arguments.length;r++)s[r]=arguments[r];var a=(new Date).getTime();h=s;var c=function(){clearTimeout(e),e=0,t.apply(o,h),n=(new Date).getTime()};a-n>i?c():e||(e=window.setTimeout(c,i))}},VirtualList=function(){function t(t,i){this._items=[],this.fromIndex=0,this.endIndex=0,this.cbs={},this.dom=t,this.items=i;var e=throttle(this.listener,100);document.body.addEventListener("wheel",e.bind(this)),window.addEventListener("scroll",e.bind(this))}return Object.defineProperty(t.prototype,"viewItems",{get:function(){return this.items.slice(this.fromIndex,this.endIndex+1)},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"items",{get:function(){return this._items},set:function(t){this._items=t,this.listener()},enumerable:!0,configurable:!0}),t.prototype.listener=function(){var t;t=this.getViewItemIndex(),this.fromIndex=t[0],this.endIndex=t[1],this.emit("change")},t.prototype.getViewItemIndex=function(){var t,i=this.dom.getBoundingClientRect().y;t=i<0?-i:i<window.innerHeight?0:window.innerHeight-i;for(var e,n=window.innerHeight-i,h=0,o=this.items.length-1;;){if((e=Math.floor((h+o)/2))===h&&e!==o||e<0)return[-1,-1];var s=this.getItemDirection(this.items[e],t,n);if(-1===s)h=e;else{if(1!==s)break;o=e}}for(var r=n,a=t,c=e;c>=0&&0===this.getItemDirection(this.items[c],t,r);c--)h=c,r=Math.max(r,this.items[c].y+this.items[c].height),a=Math.min(a,this.items[c].y);for(c=e;c<this.items.length&&0===this.getItemDirection(this.items[c],a,n);c++)o=c,a=Math.min(a,this.items[c].y);return[h,o]},t.prototype.getItemDirection=function(t,i,e){return t.height+t.y<i-200?-1:t.y>e+200?1:0},t.prototype.on=function(t,i){this.cbs[t]?this.cbs[t].push(i):this.cbs[t]=[i]},t.prototype.emit=function(t){for(var i=[],e=1;e<arguments.length;e++)i[e-1]=arguments[e];this.cbs[t]&&this.cbs[t].forEach(function(t){return t.apply(void 0,i)})},t}();exports.VirtualList=VirtualList,exports.Waterfall=Waterfall;