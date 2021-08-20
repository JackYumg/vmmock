import patternLetters from './Date.date';

function regexpFn() {
    var re = [];
    for (var i in patternLetters) {
        re.push(i)
    }
    return '(' + re.join('|') + ')'
}

const _rformat = regexpFn();

const DateConverter = {
    // 日期占位符正则。
    _rformat: new RegExp(_rformat, 'g'),
    // 格式化日期。
    _formatDate: function (date, format) {
        function creatNewSubString($0, flag) {
            let temp;
            if (typeof patternLetters[flag] === 'function') {
                temp = patternLetters[flag](date);
            } else {
                if (patternLetters[flag] in patternLetters) {
                    temp = creatNewSubString($0, patternLetters[flag]);
                } else {
                    temp = date[patternLetters[flag]]();
                }
            }
            return temp;
        }
        return format.replace(this._rformat, creatNewSubString)
    },
}

export default DateConverter;