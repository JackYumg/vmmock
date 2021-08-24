import ArrayHelper from "../../util/ArrayHelper"
import Basic from "../basic/Basic"
import { FIXED_DICT } from "./Address.data"

var REGION = ['东北', '华北', '华东', '华中', '华南', '西南', '西北']

const AddressBuilder = {
    // 随机生成一个大区。
    region: function () {
        return ArrayHelper.pick(REGION)
    },
    // 随机生成一个（中国）省（或直辖市、自治区、特别行政区）。
    province: function () {
        return ArrayHelper.pick(FIXED_DICT).name
    },
    // 随机生成一个（中国）市。
    city: function (prefix) {
        var province = ArrayHelper.pick(FIXED_DICT)
        var city = ArrayHelper.pick(province.children)
        return prefix ? [province.name, city.name].join(' ') : city.name
    },
    // 随机生成一个（中国）县。
    county: function (prefix) {
        var province = ArrayHelper.pick(FIXED_DICT)
        var city = ArrayHelper.pick(province.children)
        var county = ArrayHelper.pick(city.children) || {
            name: '-'
        }
        return prefix ? [province.name, city.name, county.name].join(' ') : county.name
    },
    // 随机生成一个邮政编码（六位数字）。
    zip: function (len) {
        var zip = ''
        for (var i = 0; i < (len || 6); i++) zip += Basic.natural(0, 9)
        return zip
    }
}

export default AddressBuilder;