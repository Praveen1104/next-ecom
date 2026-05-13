/**
 * Utility class to handle API features like filtering, sorting, pagination, and field limiting for Mongoose queries.
 */
class ApiFeatures {
    constructor(query, queryStr) {
        this.query = query; // Mongoose query object (e.g., Product.find())
        this.queryStr = queryStr; // Request query parameters (e.g., req.query)
    }

    /**
     * Filter query based on request parameters
     * Excludes certain fields like page, sort, limit, fields
     */
    filter() {
        const queryObj = { ...this.queryStr };
        const excludedFields = ['page', 'sort', 'limit', 'fields', 'search'];
        excludedFields.forEach(el => delete queryObj[el]);

        // Advanced filtering (gte, gt, lte, lt)
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

        this.query = this.query.find(JSON.parse(queryStr));

        // Text search handling (Fuzzy search with Regex)
        if (this.queryStr.search) {
            const searchRegex = new RegExp(this.queryStr.search, 'i');
            this.query = this.query.find({
                $or: [
                    { title: searchRegex },
                    { description: searchRegex },
                    { brand: searchRegex },
                    { category: searchRegex }
                ]
            });
        }

        return this;
    }

    /**
     * Sort results based on request parameter
     */
    sort() {
        if (this.queryStr.sort) {
            const sortBy = this.queryStr.sort.split(',').join(' ');
            this.query = this.query.sort(sortBy);
        } else {
            // Default sort by newest
            this.query = this.query.sort('-createdAt');
        }

        return this;
    }

    /**
     * Limit fields returned in the response
     */
    limitFields() {
        if (this.queryStr.fields) {
            const fields = this.queryStr.fields.split(',').join(' ');
            this.query = this.query.select(fields);
        } else {
            // Exclude __v by default
            this.query = this.query.select('-__v');
        }

        return this;
    }

    /**
     * Paginate results
     */
    paginate() {
        const page = this.queryStr.page * 1 || 1;
        const limit = this.queryStr.limit * 1 || 10;
        const skip = (page - 1) * limit;

        this.query = this.query.skip(skip).limit(limit);

        return this;
    }
}

export { ApiFeatures };
