/**
 * @jest-environment jsdom
 */
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
        },
        {
            url: '/apis/string' , method: 'get' , type: 'txt', option: {
                min: 3 , 
                max: 12,
                lg: 'cn'
            }
        },
        {
            url: '/apis/entry' , method: 'get' , type: 'entry' , option: {
                name: '@cnName',
                address: '@city@province@county',
                emal: '@email',
                id: '@guid',
                uuid: '@id'
            }
        },
        {
            url: '/apis/list' , method: 'get' , type: 'list' , option: {
                min: 2,
                max: 10,
                template: '@cnName'
            }
        },
        {
            url: '/apis/txt' , method: 'get' , type: 'txt' , option: {
                min: 2,
                max: 10,
                lg:'cn'
            }
        }
    ])
    expect.assertions(1);
    const pms = axios.get('http://localhost:4300/apis/txt');
    pms.then((e) => {
        console.log(e);
    });
    return expect(
        pms
    ).resolves.not.toBeNull();
});