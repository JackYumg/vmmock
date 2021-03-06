import Builders from "../builders/index";
import Basic from "../builders/basic/Basic";
import ArrayHelper from "../util/ArrayHelper";
import { BaseHelper } from "../util/BaseHelper";
import { Constant } from "./constant";
const Handler = {
    gen: function (template, name, context) {
        /* jshint -W041 */
        name = name == undefined ? '' : (name + '')

        context = context || {}
        context = {
            // 当前访问路径，只有属性名，不包括生成规则
            path: context.path || [Constant.GUID],
            templatePath: context.templatePath || [Constant.GUID++],
            // 最终属性值的上下文
            currentContext: context.currentContext,
            // 属性值模板的上下文
            templateCurrentContext: context.templateCurrentContext || template,
            // 最终值的根
            root: context.root || context.currentContext,
            // 模板的根
            templateRoot: context.templateRoot || context.templateCurrentContext || template
        }
        // console.log('path:', context.path.join('.'), template)

        var rule = this.parse.parseTemplate(template);
        var type = BaseHelper.type(template);
        var data;

        if (Handler[type]) {
            data = Handler[type]({
                // 属性值类型
                type: type,
                // 属性值模板
                template: template,
                // 属性名 + 生成规则
                name: name,
                // 属性名
                parsedName: name ? name.replace(Constant.RE_KEY, '$1') : name,

                // 解析后的生成规则
                rule: rule,
                // 相关上下文
                context: context
            })

            if (!context.root) context.root = data
            return data
        }

        return template
    },
    array: function (options) {
        var result = [],
            i, ii;
        if (options.template.length === 0) return result

        // 'arr': [{ 'email': '@EMAIL' }, { 'email': '@EMAIL' }]
        if (!options.rule.parameters) {
            for (i = 0; i < options.template.length; i++) {
                options.context.path.push(i)
                options.context.templatePath.push(i)
                result.push(
                    Handler.gen(options.template[i], i, {
                        path: options.context.path,
                        templatePath: options.context.templatePath,
                        currentContext: result,
                        templateCurrentContext: options.template,
                        root: options.context.root || result,
                        templateRoot: options.context.templateRoot || options.template
                    })
                )
                options.context.path.pop()
                options.context.templatePath.pop()
            }
        } else {
            // 'method|1': ['GET', 'POST', 'HEAD', 'DELETE']
            if (options.rule.min === 1 && options.rule.max === undefined) {
                // fix #17
                options.context.path.push(options.name)
                options.context.templatePath.push(options.name)
                result = Random.pick(
                    this.gen(options.template, undefined, {
                        path: options.context.path,
                        templatePath: options.context.templatePath,
                        currentContext: result,
                        templateCurrentContext: options.template,
                        root: options.context.root || result,
                        templateRoot: options.context.templateRoot || options.template
                    })
                )
                options.context.path.pop()
                options.context.templatePath.pop()
            } else {
                // 'data|+1': [{}, {}]
                if (options.rule.parameters[2]) {
                    options.template.__order_index = options.template.__order_index || 0

                    options.context.path.push(options.name)
                    options.context.templatePath.push(options.name)
                    result = this.gen(options.template, undefined, {
                        path: options.context.path,
                        templatePath: options.context.templatePath,
                        currentContext: result,
                        templateCurrentContext: options.template,
                        root: options.context.root || result,
                        templateRoot: options.context.templateRoot || options.template
                    })[
                        options.template.__order_index % options.template.length
                    ]

                    options.template.__order_index += +options.rule.parameters[2]

                    options.context.path.pop()
                    options.context.templatePath.pop()

                } else {
                    // 'data|1-10': [{}]
                    for (i = 0; i < options.rule.count; i++) {
                        // 'data|1-10': [{}, {}]
                        for (ii = 0; ii < options.template.length; ii++) {
                            options.context.path.push(result.length)
                            options.context.templatePath.push(ii)
                            result.push(
                                this.gen(options.template[ii], result.length, {
                                    path: options.context.path,
                                    templatePath: options.context.templatePath,
                                    currentContext: result,
                                    templateCurrentContext: options.template,
                                    root: options.context.root || result,
                                    templateRoot: options.context.templateRoot || options.template
                                })
                            )
                            options.context.path.pop()
                            options.context.templatePath.pop()
                        }
                    }
                }
            }
        }
        return result
    },
    object: function (options) {
        var result = {},
            keys, fnKeys, key, parsedKey, inc, i;

        // 'obj|min-max': {}
        /* jshint -W041 */
        if (options.rule.min != undefined) {
            keys = Util.keys(options.template)
            keys = ArrayHelper.shuffle(keys)
            keys = keys.slice(0, options.rule.count)
            for (i = 0; i < keys.length; i++) {
                key = keys[i]
                parsedKey = key.replace(Constant.RE_KEY, '$1')
                options.context.path.push(parsedKey)
                options.context.templatePath.push(key)
                result[parsedKey] = this.gen(options.template[key], key, {
                    path: options.context.path,
                    templatePath: options.context.templatePath,
                    currentContext: result,
                    templateCurrentContext: options.template,
                    root: options.context.root || result,
                    templateRoot: options.context.templateRoot || options.template
                })
                options.context.path.pop()
                options.context.templatePath.pop()
            }

        } else {
            // 'obj': {}
            keys = []
            fnKeys = [] // #25 改变了非函数属性的顺序，查找起来不方便
            for (key in options.template) {
                (typeof options.template[key] === 'function' ? fnKeys : keys).push(key)
            }
            keys = keys.concat(fnKeys)

            /*
                会改变非函数属性的顺序
                keys = Util.keys(options.template)
                keys.sort(function(a, b) {
                    var afn = typeof options.template[a] === 'function'
                    var bfn = typeof options.template[b] === 'function'
                    if (afn === bfn) return 0
                    if (afn && !bfn) return 1
                    if (!afn && bfn) return -1
                })
            */

            for (i = 0; i < keys.length; i++) {
                key = keys[i]
                parsedKey = key.replace(Constant.RE_KEY, '$1')
                options.context.path.push(parsedKey)
                options.context.templatePath.push(key)
                result[parsedKey] = this.gen(options.template[key], key, {
                    path: options.context.path,
                    templatePath: options.context.templatePath,
                    currentContext: result,
                    templateCurrentContext: options.template,
                    root: options.context.root || result,
                    templateRoot: options.context.templateRoot || options.template
                })
                options.context.path.pop()
                options.context.templatePath.pop()
                // 'id|+1': 1
                inc = key.match(Constant.RE_KEY)
                if (inc && inc[2] && Util.type(options.template[key]) === 'number') {
                    options.template[key] += parseInt(inc[2], 10)
                }
            }
        }
        return result
    },
    number: function (options) {
        var result, parts;
        if (options.rule.decimal) { // float
            options.template += ''
            parts = options.template.split('.')
            parts[0] = options.rule.range ? options.rule.count : parts[0]
            parts[1] = (parts[1] || '').slice(0, options.rule.dcount)
            while (parts[1].length < options.rule.dcount) {
                parts[1] += (
                    // 最后一位不能为 0：如果最后一位为 0，会被 JS 引擎忽略掉。
                    (parts[1].length < options.rule.dcount - 1) ? Basic.character('number') : Basic.character('123456789')
                )
            }
            result = parseFloat(parts.join('.'), 10)
        } else { // integer
            // 'grade1|1-100': 1,
            result = options.rule.range && !options.rule.parameters[2] ? options.rule.count : options.template
        }
        return result
    },
    boolean: function (options) {
        var result;
        // 'prop|multiple': false, 当前值是相反值的概率倍数
        // 'prop|probability-probability': false, 当前值与相反值的概率
        result = options.rule.parameters ? Basic.bool(options.rule.min, options.rule.max, options.template) : options.template
        return result
    },
    allFn() {
        const res = {};
        const keys = Object.keys(Builders);
        for (const key of keys) {
            if (Builders[key]) {
                const element = Builders[key];
                const tkeys = Object.keys(element);
                for (const tkey of tkeys) {
                    if (element[tkey]) {
                        const telement = element[tkey];
                        res[tkey] = telement;
                    }
                }
            }
        }
        return res;
    },
    splitPathToArray: function (path) {
        var parts = path.split(/\/+/);
        if (!parts[parts.length - 1]) parts = parts.slice(0, -1)
        if (!parts[0]) parts = parts.slice(1)
        return parts;
    },
    placeholder: function (placeholder, obj, templateContext, options) {
        // console.log(options.context.path)
        // 1 key, 2 params
        Constant.RE_PLACEHOLDER.exec('')
        var parts = Constant.RE_PLACEHOLDER.exec(placeholder),
            key = parts && parts[1],
            lkey = key && key.toLowerCase(),
            okey = this.allFn()[lkey],
            params = parts && parts[2] || ''
        var pathParts = this.splitPathToArray(key)

        // 解析占位符的参数
        try {
            // 1. 尝试保持参数的类型
            /*
                #24 [Window Firefox 30.0 引用 占位符 抛错](https://github.com/nuysoft/Mock/issues/24)
                [BX9056: 各浏览器下 window.eval 方法的执行上下文存在差异](http://www.w3help.org/zh-cn/causes/BX9056)
                应该属于 Window Firefox 30.0 的 BUG
            */
            /* jshint -W061 */
            params = eval('(function(){ return [].splice.call(arguments, 0 ) })(' + params + ')')
        } catch (error) {
            // 2. 如果失败，只能解析为字符串
            // console.error(error)
            // if (error instanceof ReferenceError) params = parts[2].split(/,\s*/);
            // else throw error
            params = parts[2].split(/,\s*/)
        }

        // 占位符优先引用数据模板中的属性
        if (obj && (key in obj)) return obj[key]

        // @index @key
        // if (Constant.RE_INDEX.test(key)) return +options.name
        // if (Constant.RE_KEY.test(key)) return options.name

        // 绝对路径 or 相对路径
        if (
            key.charAt(0) === '/' ||
            pathParts.length > 1
        ) return this.getValueByKeyPath(key, options)

        // 递归引用数据模板中的属性
        if (templateContext &&
            (typeof templateContext === 'object') &&
            (key in templateContext) &&
            (placeholder !== templateContext[key]) // fix #15 避免自己依赖自己
        ) {
            // 先计算被引用的属性值
            templateContext[key] = Handler.gen(templateContext[key], key, {
                currentContext: obj,
                templateCurrentContext: templateContext
            })
            return templateContext[key]
        }

        // 如果未找到，则原样返回
        if (!(key in this.allFn()) && !(lkey in this.allFn()) && !(okey in this.allFn())) return placeholder

        // 递归解析参数中的占位符
        for (var i = 0; i < params.length; i++) {
            Constant.RE_PLACEHOLDER.exec('')
            if (Constant.RE_PLACEHOLDER.test(params[i])) {
                params[i] = this.placeholder(params[i], obj, templateContext, options)
            }
        }

        var handle = this.allFn()[key] || this.allFn()[lkey] || this.allFn()[okey]
        switch (BaseHelper.type(handle)) {
            case 'array':
                // 自动从数组中取一个，例如 @areas
                return this.allFn().pick(handle)
            case 'function':
                // 执行占位符方法（大多数情况）
                handle.options = options
                var re = handle.apply(this.allFn(), params)
                if (re === undefined) re = '' // 因为是在字符串中，所以默认为空字符串。
                delete handle.options
                return re;
        }
    },
    string: function (options) {
        var result = '',
            i, placeholders, ph, phed;
        if (options.template && options.template.length) {

            //  'foo': '★',
            /* jshint -W041 */
            if (options.rule.count == undefined) {
                result += options.template
            }

            // 'star|1-5': '★',
            for (i = 0; i < options.rule.count; i++) {
                result += options.template
            }
            // 'email|1-10': '@EMAIL, ',
            placeholders = result.match(Constant.RE_PLACEHOLDER) || [] // A-Z_0-9 > \w_
            for (i = 0; i < placeholders.length; i++) {
                ph = placeholders[i]

                // 遇到转义斜杠，不需要解析占位符
                if (/^\\/.test(ph)) {
                    placeholders.splice(i--, 1)
                    continue
                }

                phed = Handler.placeholder(ph, options.context.currentContext, options.context.templateCurrentContext, options)

                // 只有一个占位符，并且没有其他字符
                if (placeholders.length === 1 && ph === result && typeof phed !== typeof result) { // 
                    result = phed;
                    break;
                }
                result = result.replace(ph, phed)
            }

        } else {
            // 'ASCII|1-10': '',
            // 'ASCII': '',
            result = options.rule.range ? Basic.string(options.rule.count) : options.template
        }
        return result
    },
    'function': function (options) {
        // ( context, options )
        return options.template.call(options.context.currentContext, options)
    },
    'regexp': function (options) {
        var source = ''

        // 'name': /regexp/,
        /* jshint -W041 */
        if (options.rule.count == undefined) {
            source += options.template.source // regexp.source
        }

        // 'name|1-5': /regexp/,
        for (var i = 0; i < options.rule.count; i++) {
            source += options.template.source
        }

        return this.gen(
            this.parse.parseTemplate(source)
        )
    }
};

export default Handler;