const { Op } = require('sequelize');
const getPaginationParams = (body, searchableFields = []) => {
  const page = parseInt(body.page) || 1;
  const limit = parseInt(body.limit) || 10;
  const skip = (page - 1) * limit;
  const sortColumn = body.sortColumn?.trim() || 'createdAt';
  const sortOrder = body.sortOrder?.toLowerCase() === 'asc' ? 'ASC' : 'DESC';
  const search = body.search?.trim() || '';

  let filter = {};
  if (search && searchableFields.length > 0) {
    filter[Op.or] = searchableFields.map((field) => ({
      [field]: { [Op.like]: `%${search}%` }
    }));
  }
  const sort = [[sortColumn, sortOrder]];

  return { page, limit, skip, sort, filter };
};

const formatPaginationResult = (total, page, limit, data) => {
  const totalPages = Math.ceil(total / limit);
  const nextPage = page < totalPages ? page + 1 : null;

  return {
    data,
    totalCount: total,
    currentPage: page,
    perPage: limit,
    totalPages,
    nextPage,
  };
};

module.exports = {
  getPaginationParams,
  formatPaginationResult,
};
