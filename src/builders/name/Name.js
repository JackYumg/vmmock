import ArrayHelper from './../../util/ArrayHelper';
import { NAMES_DICS } from './Name.data';
const NameBuilder = {
    cnFirst: () => {
        return ArrayHelper.pick(NAMES_DICS.CN_SURNAMES);
    },
    cnlast: () => {
        return ArrayHelper.pick(NAMES_DICS.CN_NAME, 1, 2);
    },
    cnName: function () {
        return `${this.cnFirst()}${this.cnlast()}`.replace(',' , '');
    },
    cnFXFirst(){
        return ArrayHelper.pick(NAMES_DICS.CN_SURNAMES.filter( e => e.length >1));
    },
    cnFXName() {
        return `${this.cnFXFirst()}${this.cnlast()}`.replace(',' , '');
    }
};
export default NameBuilder;