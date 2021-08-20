
import DateConverter from './Date.converter';
/*
    ## Date
*/


const DateBuilder = {
    // 生成一个随机的 Date 对象。
    _randomDate: function (min, max) { // min, max
        min = min === undefined ? new Date(0) : new Date(min);
        max = max === undefined ? new Date() : new Date(max);
        return new Date(min.getTime() + Math.random() * (max.getTime() - min.getTime()))
    },
    // 返回一个随机的日期字符串。
    date: function (format) {
        format = format || 'yyyy-MM-dd'
        return DateConverter._formatDate(this._randomDate(), format)
    },
    // 返回一个随机的时间字符串。
    time: function (format) {
        format = format || 'HH:mm:ss'
        return DateConverter._formatDate(this._randomDate(), format)
    },
    // 返回一个随机的日期和时间字符串。
    datetime: function (format) {
        format = format || 'yyyy-MM-dd HH:mm:ss'
        return DateConverter._formatDate(this._randomDate(), format)
    },
    // 返回当前的日期和时间字符串。
    now: function (unit, format) {
        // now(unit) now(format)
        if (arguments.length === 1) {
            // now(format)
            if (!/year|month|day|hour|minute|second|week/.test(unit)) {
                format = unit
                unit = ''
            }
        }
        unit = (unit || '').toLowerCase()
        format = format || 'yyyy-MM-dd HH:mm:ss'

        var date = new Date()

        /* jshint -W086 */
        // 参考自 http://momentjs.cn/docs/#/manipulating/start-of/
        switch (unit) {
            case 'year':
                date.setMonth(0)
            case 'month':
                date.setDate(1)
            case 'week':
            case 'day':
                date.setHours(0)
            case 'hour':
                date.setMinutes(0)
            case 'minute':
                date.setSeconds(0)
            case 'second':
                date.setMilliseconds(0)
        }
        switch (unit) {
            case 'week':
                date.setDate(date.getDate() - date.getDay())
        }

        return DateConverter._formatDate(date, format)
    }
}

export default DateBuilder;