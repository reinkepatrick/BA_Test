
const calculate = require('../src/utils/calc');

it('calculate 4 + 5', () => {
    expect(calculate.add(4, 5)).toBe(9);
});

it('calculate -4 + 5', () => {
    expect(calculate.add(-4, 5)).toBe(1);
});