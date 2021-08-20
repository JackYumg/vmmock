import AddressBuilder from './../src/builders/address/Address';
test('generate some citys', () => {
    const showAll = true;
    const a = AddressBuilder.city(showAll);
    const b = AddressBuilder.city(!showAll);
    expect(b.length).toBeLessThan(a.length);
});