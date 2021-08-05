import { Op } from 'sequelize'

export const buildQueryOption = (request: any) => {
    const { PAGINATION_LIMIT, PAGINATION_SKIP } = process.env
       
    const { pageNumber, pageSize, order, orderBy } = request

    const options = {
        limit: pageSize ? pageSize : Number(PAGINATION_LIMIT),
        offset: pageNumber ? (pageNumber - 1) * pageSize : Number(PAGINATION_SKIP)
    }

    if (order && orderBy) {
        options["order"] = [[orderBy, order]]
      }

    return options
}
