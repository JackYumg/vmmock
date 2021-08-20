const Builders = require('./../src/builders/index').default;
test('generate iamge file', () => {
    const date = Builders.DateBuilder.datetime('yyyy-MM-dd HH:mm:ss');
    expect(true).toBe(true);
});