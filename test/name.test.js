const Builders = require('./../src/builders/index').default;

test('generate some names', () => {
    const a = Builders.NameBuilder.cnFXName();
    expect(2).toBeLessThan(a.length);
});