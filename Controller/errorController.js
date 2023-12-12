const CustomError = require('../Utils/CustomError')
function devErrors(res, error) {
    res.status(error.statusCode).json({
        status: error.status,
        message: error.message,
        stacktrace: error.stack,
        error: error
    })

}
function prodErrors(res, error) {
    if (error.isOperational) {
        res.status(error.statusCode).json({
            status: error.status,
            message: error.message
        })
    } else {
        res.status(500).json({
            status: 500,
            message: 'something went wrong Oops'
        })
    }
}
const castErrorHandler = (error) => {
    const msg = `Invalid value ${error.value} for field ${error.path}`
    return new CustomError(msg, 400);
}
const duplicateIdErrorHandler = (error) => {
    const msg = `movie with same name already exist`
    return new CustomError(msg, 400);
}
const handleExpiredToken = (error) => {
    const msg = `token is expired`
    return new CustomError(msg, 400);
}
const validationErrorHandler = (error) => {
   const errors= Object.values(error.errors).map(val => val.message);
   const errorMessages =errors.join('. ');
   return new CustomError(errorMessages, 400);
}

module.exports = (error, req, res, next) => {
    error.statusCode = error.statusCode || 500,
        error.status = error.status || 'Error'
    if (process.env.NODE_ENV == 'development') {
        devErrors(res, error)
    }
    if (process.env.NODE_ENV == 'production') {
        if (error.name === 'CastError') {
            error = castErrorHandler(error)
        } else if (error.code === 11000) {
            error = duplicateIdErrorHandler(error)
        } else if (error.name === 'ValidationError') {
            error = validationErrorHandler(error)
        }else if(error.name ==='TokenExpiredError'){
            error = handleExpiredToken(error);
        }
        prodErrors(res, error)
    }
}