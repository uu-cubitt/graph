import * as Common from "cubitt-common";

let guids: Common.Guid[] = [];
/* Helper function to create unique GUIDS for the test */
export function uniqueGUID(): Common.Guid {
	"use strict";
	let guid: Common.Guid = Common.Guid.newGuid();
	while (guids.indexOf(guid) >= 0) {
		guid = Common.Guid.newGuid();
	}
	guids.push(guid);
	return guid;
}
