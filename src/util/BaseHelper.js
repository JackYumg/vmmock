// 里面的都应该是纯函数
function is(val, type) {
    return toString.call(val) === `[object ${type}]`;
}
export const BaseHelper = {
    // 把字符串的第一个字母转换为大写。
    capitalize: function (word) {
        return (word + '').charAt(0).toUpperCase() + (word + '').substr(1)
    },
    // 把字符串转换为大写。
    upper: function (str) {
        return (str + '').toUpperCase()
    },
    // 把字符串转换为小写。
    lower: function (str) {
        return (str + '').toLowerCase()
    },
    isArray: (val) => {
        return val && Array.isArray(val);
    },
    isObject: (val) => {
        return val && is(val, 'object');
    },
    isFunction: (val) => {
        return is(val, 'Function') || is(val, 'AsyncFunction');
    },
    sRegExp(val) {
        return is(val, 'RegExp');
    },
    async sleep(time) {
        if (isNaN(time)) {
            return Promise.reject(new Error(`the time ${time} params type is not number, but type is ${typeof time}`));
        }
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(true);
            }, time);
        });
    },
    type: function (obj) {
        return (obj === null || obj === undefined) ? String(obj) : Object.prototype.toString.call(obj).match(/\[object (\w+)\]/)[1].toLowerCase()
    },
    keys: function (obj) {
        var keys = [];
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) keys.push(key)
        }
        return keys;
    },
    extend: function () {
        var target = arguments[0] || {},
            i = 1,
            length = arguments.length,
            options, name, src, copy, clone

        if (length === 1) {
            target = this
            i = 0
        }

        for (; i < length; i++) {
            options = arguments[i]
            if (!options) continue

            for (name in options) {
                src = target[name]
                copy = options[name]

                if (target === copy) continue
                if (copy === undefined) continue

                if (this.isArray(copy) || this.isObject(copy)) {
                    if (this.isArray(copy)) clone = src && this.isArray(src) ? src : []
                    if (this.isObject(copy)) clone = src && this.isObject(src) ? src : {}

                    target[name] = this.extend(clone, copy)
                } else {
                    target[name] = copy
                }
            }
        }

        return target
    }
}