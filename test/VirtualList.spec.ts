import VirtualList from '../src/VirtualList';
import data from './virtualList.json';
import { expect } from 'chai';

describe("VirtualList", () => {
  const dom = document.createElement('div');
  document.body.append(dom);
  dom.style.height = `${11031}px`;
  dom.style.width = `${1000}px`;
  dom.style.position = 'relative';
  const virtualList = new VirtualList(dom, data);

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
      content.style.background = item.color;
      content.style.border = '1px solid #eee';
      child.append(content)
      dom.append(child);
    }
  }
  it('init', () => {
    resultToDom();
    expect(dom.childElementCount).to.equal(16);
  });
  it('scroll', (done) => {
    virtualList.on('change', () => {
      resultToDom();
      expect(dom.childElementCount).to.equal(21);
      expect((dom.children[0].children[0] as HTMLDivElement).style.background).to.equal('rgb(255, 255, 255)');
      done();
    })
    window.scrollTo({
      top: 1500,
    });
  });
  it('clear', () => {
    virtualList.clear();
    resultToDom();
    expect(virtualList.fromIndex).to.equal(0);
    expect(virtualList.endIndex).to.equal(0);
    expect(dom.childElementCount).to.equal(0);
  });
});
