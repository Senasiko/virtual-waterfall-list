import Waterfall from '../src/Waterfall';
import data from './waterfall.json';
import { expect } from 'chai';

describe("Waterfall", () => {
  let waterfall: Waterfall;
  it("new Waterfall'", () => {
    waterfall = new Waterfall([], { width: 1000 });
    expect(waterfall).instanceof(Waterfall);
  });
  it('add', () => {
    waterfall.add(data);
    expect(waterfall.initItems.length).to.equal(data.length);
    expect(waterfall.topItems.length).to.equal(data.length);

    expect(waterfall.bottomItems.length).to.equal(waterfall.topItems.length);
    expect(waterfall.topItems[0]).to.equal(waterfall.bottomItems[0]);
    
    expect(waterfall.topItems[3].x).to.equal(750);
    expect(waterfall.topItems[3].y).to.equal(0);

    expect(waterfall.topItems[30].x).to.equal(0);
    expect(Math.floor(waterfall.topItems[30].y)).to.equal(2067);

    expect(waterfall.topItems.slice(-1)[0].x).to.equal(500);
    expect(Math.floor(waterfall.topItems.slice(-1)[0].y)).to.equal(10854);
    expect(Math.floor(waterfall.height)).to.equal(11031);
    expect(waterfall.bottomItems.slice(-1)[0].x).to.equal(500);

  });
  it('calculateAll', () => {
    const random = Math.floor(Math.random()) * 100;
    const randomItem = waterfall.bottomItems[random];
    waterfall.calculateAll();
    expect(waterfall.bottomItems[random].x).to.equal(randomItem.x);
    expect(waterfall.bottomItems[random].y).to.equal(randomItem.y);
    expect(waterfall.bottomItems[random].width).to.equal(randomItem.width);
    expect(waterfall.bottomItems[random].height).to.equal(randomItem.height);
    expect(Math.floor(waterfall.height)).to.equal(11031);
  });
  it('padding', () => {
    for (let item of data) {
      item.padding = 7.5;
    }
    waterfall.calculateAll();
    expect(Math.floor(waterfall.bottomItems.slice(-1)[0].y)).to.equal(10762);
    expect(Math.floor(waterfall.height)).to.equal(10943);
  });
  it('resize', () => {
    waterfall.width = 500;
    waterfall.calculateAll();
    expect(waterfall.topItems.slice(-1)[0].x).to.equal(0);
    expect(Math.floor(waterfall.topItems.slice(-1)[0].y)).to.equal(5332);
    expect(Math.floor(waterfall.height)).to.equal(5425);
  });
  it('maxHeight', () => {
    waterfall.options.maxHeight = 700;
    waterfall.add([{ 
      "width": 1000, 
      "height": 10000, 
      "widthPercent": 0.25,  
      "padding": 0
    }]);
    expect(Math.floor(waterfall.topItems.slice(-1)[0].height)).to.equal(700);
  });
  it('clear', () => {
    waterfall.clear();
    expect(waterfall.initItems.length).to.equal(0);
    expect(waterfall.bottomItems.length).to.equal(0);
    expect(waterfall.topItems.length).to.equal(0);
    expect(waterfall.height).to.equal(0);
  });
});
