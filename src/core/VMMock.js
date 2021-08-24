import Parser from './Parser';
import { BaseHelper } from './../util/BaseHelper';
// import MockXMLHttpRequest from '../net/xhr';
const urld = require('url');

function VMMock() {

}

VMMock.prototype.parser = Parser;

/**
 * 
 * @param {匹配的指令} template 
 * @param {配置字段的选项} moreOption 可能为对象，也可能为字符串
 */
VMMock.prototype.generate = function (template, moreOption) {
    return this.parser.parseTemplateOption(template, moreOption);
}

/**
 * 
 * @param {*} option
 * @ 
 */
VMMock.prototype.setUp = function (option) {
    this.option = option;
    // if (MockXMLHttpRequest) window.XMLHttpRequest = MockXMLHttpRequest
}

VMMock.prototype.setMockData = function (data = []) {
    this.mockData = data;
}

function isMatched(config, mock) {
    try {
        const { url, method } = config;
        const basepath = mock.option.basepath;
        let pathname = urld.parse(url).pathname;
        pathname = pathname.replace(basepath, '');
        const findedMock = mock.mockData.find((data) => {
            const str = data.url.replace(basepath, '');
            if (str === pathname) {
                return true;
            } else {
                return false;
            }
        });
        if (findedMock && String.prototype.toUpperCase.call(findedMock.method) === String.prototype.toUpperCase.call(method)) {
            return findedMock;
        }
        return null;
    } catch (error) {
        return null;
    }
}
// 挂载axios
VMMock.prototype.mouteAxios = function (axios) {
    const { timeout, basepath, logger } = this.option;
    const request = async (config) => {
        if (!basepath) {
            return await config;
        }

        if (isMatched(config, this) && logger) {
            console.log(`%c[👽->${config.method}->Request]:${config.url}`, "background:rgba(133,108,217,1);color:#fff", { Request: config });
        }
        return await config;
    }

    const response = async (response) => {
        if (!basepath || this.mockData.length <= 0 || !isMatched(response.config, this)) {
            return response;
        }
        return response;
    }

    const errorCall = async (error) => {
        const { config } = error;
        if (basepath && this.mockData.length > 0) {
            const matched = isMatched(config, this);
            if (matched) {
                const result = this.parser.parseTemplateOption(matched.type, matched.option);
                await BaseHelper.sleep(timeout);
                if (logger) {
                    config.data = result;
                    console.log(`%c[👽->${config.method}->Response]:${config.url}`, "background:rgba(133,108,217,1);color:#fff", { Response: config });
                }
                return Promise.resolve(result || '');
            }
        }
        return Promise.reject(error);
    }

    axios.interceptors.request.use(request, errorCall);
    axios.interceptors.response.use(response, errorCall);
}

//挂载jquery
VMMock.prototype.mouteAjax = function () {

}

VMMock.prototype.mouteFetch = function () {

}

export default VMMock;