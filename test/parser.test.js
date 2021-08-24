import Parser from "../src/core/Parser";

test('generate some names', () => {
    const parse = Parser;
    const e = parse.parseTemplate('number1|1-100.1-10');
});