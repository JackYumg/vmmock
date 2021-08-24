import DateConverter from "../builders/date/Date.converter";
import Builders from './../builders/index';
import Basic from './../builders/basic/Basic';
import { BaseHelper } from "../util/BaseHelper";
import { Constant } from './constant';
import Handler from "./Handler";
/**
 * 字符串模板解析
 * list，
 * entry
 * txt
 * number
 * date
 */

const Parser = {
    parseArray: function (option) {
        const result = [];
        const size = Math.floor(Math.random() * (option.max - option.min) + option.min);
        const template = option.template;
        if (typeof template === 'string') {
            for (let i = 0; i < size; i++) {
                const typed = BaseHelper.type(template);
                const rule = this.parseTemplate(template);
                const context = {
                    // 当前访问路径，只有属性名，不包括生成规则
                    path: [Constant.GUID],
                    templatePath: [Constant.GUID++],
                    // 属性值模板的上下文
                    templateCurrentContext: template,
                    // 模板的根
                    templateRoot: template
                }

                const temp = Handler[typed]({
                    type: typed,
                    rule,
                    name: template,
                    template: template,
                    context
                });
                result.push(temp);
            }
        } else if (typeof template === 'object') {
            for (let i = 0; i < size; i++) {
                const temp = this.parseEntry(option);
                result.push(temp);
            }
        }
        return result;
    },
    parseEntry: function (option) {
        const keys = Object.keys(option);
        const temp = {};
        const self = this;
        for (let key of keys) {
            if (option[key] && option[key] !== 0) {
                const res = self.parseTemplate(option[key]);
                const typed = BaseHelper.type(option[key]);
                const rule = this.parseTemplate(option[key]);
                const context = {
                    // 当前访问路径，只有属性名，不包括生成规则
                    path: [Constant.GUID],
                    templatePath: [Constant.GUID++],
                    // 属性值模板的上下文
                    templateCurrentContext: option[key],
                    // 模板的根
                    templateRoot: option[key]
                }
                const d = Handler[typed]({
                    type: typed,
                    rule,
                    name: key,
                    template: option[key],
                    context
                });
                temp[key] = d;
            }
        }
        return temp;
    },
    parseTxt: function (option) {
        const { min, max, lg } = option;
        if (lg === 'cn') {
            return Builders.TxtBuilder.cparagraph(min, max);
        }
        return Builders.TxtBuilder.paragraph(min, max);
    },
    parseDate: function (option) {
        const { min, max, formate, unit, isNow } = option;
        let result;
        if (isNow) {
            result = Builders.DateBuilder.now(unit, formate);
        } else {
            if (min || max) {
                result = DateConverter._formatDate(Builders.DateBuilder._randomDate(min, max), formate);
            } else {
                result = Builders.DateBuilder.date(formate);
            }
        }
        return result;
    },
    parseNumber: function (option) {
        if (BaseHelper.isObject(option)) {
            throw new Error('type of option is not string');
        }

        const params = this.parseTemplate(option);
        const { min, max, decimal, parameters, dmin, dmax } = params;
        const [template, name] = parameters;
        let res = 0;
        switch (name) {
            case 'natural':
                res = Basic.natural(min, max);
                break;
            case 'integer':
                res = Basic.integer(min, max);
                break;
            case 'float':
                res = Basic.float(min, max, dmin, dmax);
            case 'range':
                res = Basic.range(min, max, Math.floor(Math.random() * 10));
        }
        return res;
    },
    parseTemplateOption: function (template, option) {
        let res = {};
        switch (template) {
            case 'list':
                res = this.parseArray(option);
                break;
            case 'entry':
                res = this.parseEntry(option);
                break;
            case 'txt':
                res = this.parseTxt(option);
                break;
            case 'number':
                res = this.parseNumber(option);
                break;
            case 'date':
                res = this.parseDate(option);
                break;
            case 'iamge':
                res = this.parseImage(option);
                break;
        }
        return res;
    },
    parseImage: function (option) {
        const { size, background, foreground, format, text } = option;
        return Builders.ImageBuilder.image(size, background, foreground, format, text);
    },
    parseTemplate: function (name) {
        name = name == undefined ? '' : (name + '')
        var parameters = (name || '').match(Constant.RE_KEY)
        var range = parameters && parameters[3] && parameters[3].match(Constant.RE_RANGE)
        var min = range && range[1] && parseInt(range[1], 10) // || 1
        var max = range && range[2] && parseInt(range[2], 10) // || 1
        // repeat || min-max || 1
        var count = range ? !range[2] ? parseInt(range[1], 10) : Basic.integer(min || 0, max || 0) : undefined

        var decimal = parameters && parameters[4] && parameters[4].match(Constant.RE_RANGE)
        var dmin = decimal && decimal[1] && parseInt(decimal[1], 10) // || 0,
        var dmax = decimal && decimal[2] && parseInt(decimal[2], 10) // || 0,
        // int || dmin-dmax || 0
        var dcount = decimal ? !decimal[2] && parseInt(decimal[1], 10) || Basic.integer(dmin || 0, dmax || 0) : undefined

        var result = {
            // 1 name, 2 inc, 3 range, 4 decimal
            parameters: parameters,
            // 1 min, 2 max
            range: range,
            min: min,
            max: max,
            // min-max
            count: count,
            // 是否有 decimal
            decimal: decimal,
            dmin: dmin,
            dmax: dmax,
            // dmin-dimax
            dcount: dcount
        }

        for (var r in result) {
            if (result[r] != undefined) return result;
        }
        return {}
    }
}
export default Parser;