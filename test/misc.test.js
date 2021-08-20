// 身份证生成

const Builders = require('./../src/builders/index').default;
test('generateColor self incremented id', () => {
    const a = Builders.MiscBuilder.inc();
    const b = Builders.MiscBuilder.inc();
    const c = Builders.MiscBuilder.inc();
    const d = Builders.MiscBuilder.inc();
    const e = Builders.MiscBuilder.inc();
    expect([a, b, c, d, e]).toEqual([1, 2, 3, 4, 5]);
});