const { Op, col, where } = require('sequelize');

const getPaginationParams = (body, searchableFields = []) => {
  const page = parseInt(body.page) || 1;
  const limit = parseInt(body.limit) || 10;
  const skip = (page - 1) * limit;
  const sortColumn = body.sortColumn?.trim() || 'id';
  const sortOrder = body.sortOrder?.toLowerCase() === 'asc' ? 'ASC' : 'DESC';
  const search = body.search || '';

  let filter = {};
  if (search && searchableFields.length > 0) {
    const searchConditions = searchableFields.map((field) => {
      
      if (typeof field === 'string' && field.startsWith('$') && field.endsWith('$')) {
        const path = field.slice(1, -1);
        return where(col(path), { [Op.like]: `%${search}%` });
      }

      if (!isNaN(search)) {
        return { [field]: { [Op.eq]: Number(search) } };
      }

      return { [field]: { [Op.like]: `%${search}%` } };
    });

    filter = { [Op.or]: searchConditions };
  }

  const sort = [[sortColumn, sortOrder]];
  return { page, limit, skip, sort, filter };
};

const formatPaginationResult = (total, page, limit, dataArray) => {
  const totalPages = Math.ceil(total / limit);
  const nextPage = page < totalPages ? page + 1 : null;

  return {
    items: dataArray,
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
