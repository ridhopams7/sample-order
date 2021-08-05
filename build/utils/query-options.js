"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildQueryOption = void 0;
const buildQueryOption = (request) => {
    const { PAGINATION_LIMIT, PAGINATION_SKIP } = process.env;
    const { pageNumber, pageSize, order, orderBy } = request;
    const options = {
        limit: pageSize ? pageSize : Number(PAGINATION_LIMIT),
        offset: pageNumber ? (pageNumber - 1) * pageSize : Number(PAGINATION_SKIP)
    };
    if (order && orderBy) {
        options["order"] = [[orderBy, order]];
    }
    return options;
};
exports.buildQueryOption = buildQueryOption;
//# sourceMappingURL=query-options.js.map