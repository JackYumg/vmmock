// 身份证生成
import VMMock from './../src/main';
import axios from 'axios';

it('async generate some data', async () => {
    const vm = new VMMock();
    vm.setUp({
        timeout: 4000,
        basepath: '/apis',
        logger: false
    });
    vm.mouteAxios(axios);
    vm.setMockData([
        {
            url: '/apis/test', method: 'get', type: 'iamge', option: {
                size: 300,
                background: '#fff',
                text: '我是红色的',
                foreground: '#8878dd',
                format: 'jpg'
            }
        },
        {
            url: '/apis/date', method: 'get', type: 'date', option: {
                min: '2018-10-22 12:12:44', max: '2021-10-22 12:12:44', formate: 'yyyy年MM月dd日 HH时mm分ss秒', unit: 'year', isNow: false
            }
        },
        {
            url: '/apis/number' , method: 'get' , type: 'number' , option: 'range|1-200'
        }
    ])
    expect.assertions(1);
    const pms = axios.get('http://localhost:4300/apis/number');
    pms.then((e) => {
        console.log(e);
    });
    return expect(
        pms
    ).resolves.not.toBeNull();
});