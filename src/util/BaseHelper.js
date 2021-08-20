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
    }
}