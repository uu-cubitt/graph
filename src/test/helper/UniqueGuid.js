"use strict";
var Common = require("cubitt-common");
var guids = [];
function uniqueGUID() {
    "use strict";
    var guid = Common.Guid.newGuid();
    while (guids.indexOf(guid) >= 0) {
        guid = Common.Guid.newGuid();
    }
    guids.push(guid);
    return guid;
}
exports.uniqueGUID = uniqueGUID;
