const Builders = require('./../src/builders/index').default;

test('generate some names', () => {
    const a = Builders.WebBuilder.email('qq.com');
    expect(2).toBeLessThan(a.length);
});