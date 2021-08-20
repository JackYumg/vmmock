import { CN_NAME, CN_SURNAMES } from "./Name.data";
import ArrayHelper from './../../util/ArrayHelper';

const NameBuilder = {
    cnFirst: () => {
        return ArrayHelper.pick(CN_SURNAMES);
    },
    cnlast: () => {
        return ArrayHelper.pick(CN_NAME, 1, 2);
    },
    cnName: function () {
        return `${this.cnFirst()}${this.cnlast()}`;
    },
    cnFXFirst(){
        return ArrayHelper.pick(CN_SURNAMES.filter( e => e.length >1));
    },
    cnFXName() {
        return `${this.cnFXFirst()}${this.cnlast()}`;
    }
};
export default NameBuilder;