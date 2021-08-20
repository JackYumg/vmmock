import Basic from "../builders/basic/Basic"
import { BaseHelper } from './BaseHelper';

const ArrayHelper = {
    // 从数组中随机选取一个元素，并返回。
    pick: function (arr, min, max) {
        if (!BaseHelper.isArray(arr)) {
            arr = [].slice.call(arguments)
            min = 1
            max = 1
        } else {
            if (min === undefined) min = 1
            if (max === undefined) max = min
        }

        if (min === 1 && max === 1) return arr[Basic.natural(0, arr.length - 1)]
        return this.shuffle(arr, min, max) || [];
    },
    // 乱序
    shuffle: function (arr, min, max) {
        arr = arr || []
        var old = arr.slice(0),
            result = [],
            index = 0,
            length = old.length;
        for (var i = 0; i < length; i++) {
            index = Basic.natural(0, old.length - 1)
            result.push(old[index])
            old.splice(index, 1)
        }
        switch (arguments.length) {
            case 0:
            case 1:
                return result || [];
            case 2:
                max = min
            case 3:
                min = parseInt(`${min}`, 10)
                max = parseInt(`${max}`, 10)
                return result.slice(0, Basic.natural(min, max)) || [];
        }
        return [];
    },
}

export default ArrayHelper;