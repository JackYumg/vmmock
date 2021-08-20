const Builders = require('./../src/builders/index').default;

test('generate some txt' , function(){
    const txt = Builders.TxtBuilder.ctitle(10 ,20);
    expect(true).not.toBe(false);
})