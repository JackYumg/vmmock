
const Builders = require('./../src/builders/index').default;
test('generateColor red to  #FF4136', () => {
    const e = Builders.ColorBuilder.color('red');
    expect(e).toBe('#FF4136');
});