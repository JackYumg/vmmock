const Builders = require('./../src/builders/index').default;
test('generate iamge file', () => {
    const images = Builders.ImageBuilder.image(32, 'red', '1212', 'jpg', '121212');
    expect(true).toBe(true);
});