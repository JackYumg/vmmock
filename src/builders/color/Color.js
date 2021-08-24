import ColorConverter from './Color.converter';
import { ColorDict } from './Color.data';
const ColorBuilder = {
    // 随机生成一个有吸引力的颜色，格式为 '#RRGGBB'。
    color: function (name) {
        if (name || ColorDict[name]) return ColorDict[name].nicer
        return this.hex()
    },
    // #DAC0DE
    hex: function () {
        var hsv = this._goldenRatioColor()
        var rgb = ColorConverter.hsv2rgb(hsv)
        var hex = ColorConverter.rgb2hex(rgb[0], rgb[1], rgb[2])
        return hex
    },
    // rgb(128,255,255)
    rgb: function () {
        var hsv = this._goldenRatioColor()
        var rgb = ColorConverter.hsv2rgb(hsv)
        return 'rgb(' +
            parseInt(`${rgb[0]}`, 10) + ', ' +
            parseInt(`${rgb[1]}`, 10) + ', ' +
            parseInt(`${rgb[2]}`, 10) + ')'
    },
    // rgba(128,255,255,0.3)
    rgba: function () {
        var hsv = this._goldenRatioColor()
        var rgb = ColorConverter.hsv2rgb(hsv)
        return 'rgba(' +
            parseInt(`${rgb[0]}`, 10) + ', ' +
            parseInt(`${rgb[1]}`, 10) + ', ' +
            parseInt(`${rgb[2]}`, 10) + ', ' +
            Math.random().toFixed(2) + ')'
    },
    // hsl(300,80%,90%)
    hsl: function () {
        var hsv = this._goldenRatioColor()
        var hsl = ColorConverter.hsv2hsl(hsv)
        return 'hsl(' +
            parseInt(`${hsl[0]}`, 10) + ', ' +
            parseInt(`${hsl[1]}`, 10) + ', ' +
            parseInt(`${hsl[2]}`, 10) + ')'
    },
    // http://martin.ankerl.com/2009/12/09/how-to-create-random-colors-programmatically/
    // https://github.com/devongovett/color-generator/blob/master/index.js
    // 随机生成一个有吸引力的颜色。
    _goldenRatioColor: function (saturation, value) {
        this._goldenRatio = 0.618033988749895
        this._hue = this._hue || Math.random()
        this._hue += this._goldenRatio
        this._hue %= 1

        if (typeof saturation !== "number") saturation = 0.5;
        if (typeof value !== "number") value = 0.95;

        return [
            this._hue * 360,
            saturation * 100,
            value * 100
        ]
    }
}

export default ColorBuilder