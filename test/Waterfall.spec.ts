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
    expect(waterfall.items.length).to.equal(data.length);
    
    expect(waterfall.items[3].x).to.equal(750);
    expect(waterfall.items[3].y).to.equal(0);

    expect(waterfall.items[30].x).to.equal(750);
    expect(Math.floor(waterfall.items[30].y)).to.equal(2171);

    expect(waterfall.items.slice(-1)[0].x).to.equal(500);
    expect(Math.floor(waterfall.items.slice(-1)[0].y)).to.equal(10854);
    expect(Math.floor(waterfall.height)).to.equal(11031);
  });
  it('calculateAll', () => {
    const random = Math.floor(Math.random()) * 100;
    const randomItem = waterfall.items[random];
    waterfall.calculateAll();
    expect(waterfall.items[random].x).to.equal(randomItem.x);
    expect(waterfall.items[random].y).to.equal(randomItem.y);
    expect(waterfall.items[random].width).to.equal(randomItem.width);
    expect(waterfall.items[random].height).to.equal(randomItem.height);
    expect(Math.floor(waterfall.height)).to.equal(11031);
  });
  it('padding', () => {
    for (let item of data) {
      item.padding = 7.5;
    }
    waterfall.calculateAll();
    expect(Math.floor(waterfall.items.slice(-1)[0].y)).to.equal(10762);
    expect(Math.floor(waterfall.height)).to.equal(10943);
  });
  it('resize', () => {
    waterfall.width = 500;
    waterfall.calculateAll();
    expect(waterfall.items.slice(-1)[0].x).to.equal(0);
    expect(Math.floor(waterfall.items.slice(-1)[0].y)).to.equal(5332);
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
    expect(Math.floor(waterfall.items.slice(-1)[0].height)).to.equal(700);
  });
});
