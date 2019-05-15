import VirtualList from '../src/VirtualList';
import Waterfall from '../src/Waterfall';
import data from './waterfall.json';
import { expect } from 'chai';

describe("VirtualList", function() {
  const dom = document.createElement('div');
  document.body.append(dom);
  dom.style.height = `${11031}px`;
  dom.style.width = `${1000}px`;
  dom.style.position = 'relative';
  const waterfall = new Waterfall(data, { width: 1000 });
  const virtualList = new VirtualList<{ color?: string, padding?: number, width: number, x: number }>(dom, {
    topItems: waterfall.topItems,
    bottomItems: waterfall.bottomItems,
  });

  const resultToDom = () => {
    dom.innerHTML = '';
    for (let item of virtualList.viewItems) {
      const child = document.createElement('div');
      child.style.position = 'absolute';
      child.style.height = `${item.height}px`;
      child.style.width = `${item.width}px`;
      child.style.left = `${item.x}px`;
      child.style.top = `${item.y}px`;
      child.style.boxSizing = 'border-box';
      child.style.padding = `${item.padding}px`;
      const content = document.createElement('div');
      content.style.height = '100%';
      content.style.background = item.color as string;
      content.style.border = '1px solid #eee';
      child.append(content)
      dom.append(child);
    }
  }

  this.timeout(150);
  it('init', () => {
    resultToDom();
    expect(dom.childElementCount).to.equal(17);
  });
  it('scroll', (done) => {
    let tested = false;
    virtualList.on('change', () => {
      if (tested) return;
      tested = true;
      resultToDom();
      expect(dom.childElementCount).to.equal(25);
      expect((dom.children[0].children[0] as HTMLDivElement).style.background).to.equal('rgb(0, 0, 0)');
      done();
    })
    window.scrollTo({
      top: 1500,
    });
  });
  it('clear', () => {
    virtualList.clear();
    resultToDom();
    expect(dom.childElementCount).to.equal(0);
    expect(virtualList.viewItems.length).to.equal(0);
  });
  it('setItems', function (done) {
    window.scrollTo({
      top: 0,
    });
    virtualList.setItems({
      topItems: waterfall.topItems,
      bottomItems: waterfall.bottomItems,
    });
    resultToDom();
    expect(dom.childElementCount).to.equal(17);
    done();
  })
});
