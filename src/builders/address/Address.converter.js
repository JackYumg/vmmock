export const AddressConverter = {
    tree: (list) => {
        var mapped = {}
        for (var i = 0, item; i < list.length; i++) {
            item = list[i]
            if (!item || !item.id) continue
            mapped[item.id] = item
        }

        var result = []
        for (var ii = 0; ii < list.length; ii++) {
            item = list[ii]

            if (!item) continue
            /* jshint -W041 */
            if (item.pid == undefined && item.parentId == undefined) {
                result.push(item)
                continue
            }
            var parent = mapped[item.pid] || mapped[item.parentId]
            if (!parent) continue
            if (!parent.children) parent.children = []
            parent.children.push(item)
        }
        return result
    },
    builderData(addressList) {
        var fixed = [];
        for (var id in addressList) {
            var pid;
            if (id.slice(2, 6) === '0000') {
                pid = undefined;
            } else {
                if (id.slice(4, 6) == '00') {
                    pid = id.slice(0, 2) + '0000';
                } else {
                    pid = id.slice(0, 4) + '00';
                }
            }
            fixed.push({
                id: id,
                pid: pid,
                name: addressList[id]
            });
        }
        return this.tree(fixed);
    }
}