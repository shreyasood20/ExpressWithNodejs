class ApiFeatures {
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
    }
    filter() {
        let queryString = JSON.stringify(this.queryStr);
        queryString = queryString.replace(/\b(gte|lte|gt|lt)\b/g, (match) => `$${match}`);
        const queryObj = JSON.parse(queryString);
        this.query = this.query.find(queryObj);

        return this;
    }
    sort(){
        if (this.queryStr.sort) {
            const sortBy = this.queryStr.sort.split(',').join(' ')
            console.log(sortBy)
            this.query = this.query.sort(sortBy);
         } 
         else {
            this.query = this.query.sort('-createdAt');
        }
        return this;
    }
    limitFields(){
        if (this.queryStr.fields) {
            const fields = this.queryStr.fields.split(',').join(' ')
            console.log(fields)
            this.query = this.query.select(fields);
        } else {
            this.query = this.query.select('-__v');
        }
        return this;
    }
    paginate(){
        const page = this.queryStr.page * 1 || 1;
        const limit = this.queryStr.limit * 1 || 10;
        const skip = (page - 1) * limit;
        this.query = this.query.skip(skip).limit(limit);

        // if (req.query.page) {
        //     const moviecount = await Movie.countDocuments();
        //     if (skip >= moviecount) {
        //         throw new Error('no movies left to show');
        //     }
        // }
        return this;
    }

}

module.exports = ApiFeatures;