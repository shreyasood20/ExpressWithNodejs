//IMPORTING MODULE
//const fs = require('fs');
const Movie = require('../Model/movieModel.js')
const ApiFeatures = require('../Utils/apifeatures.js');
const CustomError = require('../Utils/CustomError.js');
const asyncErrorHandler = require('../Utils/AsyncErrorHandler.js');
//const data = require('./')
//READ FILE
//const movies = JSON.parse(fs.readFileSync('./data/movies.json'));

//checkId middleware
// exports.checkId = (req, res, next, value) => {
//     const movie = movies.find((x) =>
//         x.id == value*1
//     )
//     if (!movie) {
//         return res.status(404).json({
//             status: 'ERROR',
//             message: 'movie with id ' + value + ' not found'
//         })
//     }
//     next();

// }

exports.validateMovie = (req, res, next) => {
    if (!req.body.name || !req.body.duration) {
        return res.status(404).json({
            status: 'ERROR',
            message: 'movie not valid '
        })
    }
    next();
}

//ROUTE = HTPP METHOD+URL
exports.getTopMovies = (req, res, next) => {
    console.log(req.params)
    req.query.limit = req.params.num
    req.query.sort = '-rating'
    next()
}
exports.getAllMovies = asyncErrorHandler(async (req, res, next) => {
    // const exclude =['sort','page','limit','fileds']
    // const obj = {...req.query}
    // exclude.forEach((el)=>{
    //     delete obj[el]
    // })
    // console.log(req.query, obj)
    const feature = new ApiFeatures(Movie.find(), req.query).sort().filter()
    const movies = await feature.query;
    //console.log(req.query);
    // let queryString = JSON.stringify(req.query);
    // //replacing string with ${value}
    //queryString = queryString.replace(/\b(gte|lte|gt|lt)\b/g, (match) => `$${match}`)
    // const queryObj = JSON.parse(queryString);
    //console.log('qO', queryObj, req.query.sort);
    // const movies = await Movie.find();
    // let counterObj = Movie.find();
    // // console.log('co' , counterObj)
    // //SORTING LOGIC
    // if (req.query.sort) {
    //     const sortBy = req.query.sort.split(',').join(' ')
    //     counterObj = counterObj.sort(sortBy);
    //  } 
    //  else {
    //     counterObj = counterObj.sort('-createdAt');
    // }
    // //LIMITING FIELDS // this feature is called PROJECTION, id will be included by default
    // we can also exclude field through schema(sensitive data) by setting select:false in schema.
    // if (req.query.fields) {
    //     const fields = req.query.fields.split(',').join(' ')
    //     console.log('fields ', fields);
    //     counterObj = counterObj.select(fields);
    // } else {
    //     counterObj = counterObj.select('-__v');
    // }

    //PAGINATION
    // const page = req.query.page * 1 || 1;
    // const limit = req.query.limit * 1 || 10;
    // const skip = (page - 1) * limit;
    // counterObj = counterObj.skip(skip).limit(limit);

    // if (req.query.page) {
    //     const moviecount = await Movie.countDocuments();
    //     if (skip >= moviecount) {
    //         throw new Error('no movies left to show');
    //     }
    // }

    //const movies = await counterObj;

    //find({duration:{$gte:90}, rating:{$gte:0}, price:{$lte:100}})
    // const movies = await Movie.find()
    //     .where('duration')
    //     .gte(req.query.duration)
    //     .where('rating')
    //     .gt(req.query.rating)
    //     .where('price')
    //     .lte(req.query.price);
    res.status(200).json({
        status: 'SUCCESS',
        data: {
            count: movies.length,
            movies: movies
        }
    });
})
// res.status(200).json({
//     status: 'SUCCESS',
//     requestedAt: req.requestedAt,
//     data: {
//         count: movies.length,
//         movies: movies
//     }
// });
exports.addMovie = asyncErrorHandler(async (req, res, next) => {
    //working with mongoDb
    const movie = await Movie.create(req.body)
    res.status(200).json({
        status: 'SUCCESS',
        data: {
            movie: movie
        }
    });
})
// console.log(req.body);// THIS WILL LOG Undefined, we need to use middleware
// const movieId = movies[movies.length - 1].id + 1
// const newMovie = Object.assign({ id: movieId }, req.body)
// movies.push(newMovie);
// fs.writeFile('./data/movies.json', JSON.stringify(movies), error => {
//     if (error) console.log(error.message)
//     res.status(201).send('CREATED')// 201-> stands for created
// })

exports.getMovie = asyncErrorHandler(async (req, res, next) => {
    const movie = await Movie.findById(req.params.id);
    if(!movie){
        const error = new CustomError('movie does not exist', 400);
        next(error);
    }
    res.status(200).json({
        status: 'SUCCESS',
        data: {
            movie: movie
        }
    });
})
// const id = req.params.id * 1
// const movie = movies.find((x) =>
//     x.id == id
// )
// res.status(200).json({
//     status: 'SUCCESS',
//     data: {
//         movie: movie
//     }
// })
exports.updateMovie = asyncErrorHandler(async (req, res, next) => {
    // new: true=> returns the updated document,
    //runValidators update the validators against the model schema
    //upsert= true, if no document found add new document
    const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if(!movie){
        const error = new CustomError('movie does not exist', 400);
        next(error);
    }
    res.status(200).json({
        status: 'SUCCESS',
        data: {
            movie: movie
        }
    });
})
// const id = req.params.id * 1
// const movieToUpdate = movies.find((x) =>
//     x.id == id
// )
// const index = movies.findIndex((x) =>
//     x.id == id
// )

//movies[index] = Object.assign(movieToUpdate, req.body);

// fs.writeFile('./data/movies.json', JSON.stringify(movies), error => {
//     if (error) console.log(error.message)
//     res.status(200).json({
//         status: 'SUCCESS',
//         data: {
//             movie: movies[index]
//         }
//     })
// })

exports.deleteMovie = asyncErrorHandler(async (req, res, next) => {
    const movie=await Movie.findByIdAndUpdate(req.params.id);
    if(!movie){
        const error = new CustomError('movie does not exist', 400);
        next(error);
    }
    res.status(200).json({
        status: 'SUCCESS',
        data: {
            movie: null
        }
    });
})
// const id = req.params.id * 1
// const movieToDelete = movies.find((x) =>
//     x.id == id
// )
// const index = movies.findIndex((x) =>
//     x.id == id
// )
// movies.splice(index, 1)
// fs.writeFile('./data/movies.json', JSON.stringify(movies), error => {
//     if (error) console.log(error.message)
//     res.status(200).json({
//         status: 'SUCCESS',
//         data: {
//             movie: null
//         }
//     })
// })

exports.getMovieStats = asyncErrorHandler(async (req, res, next) => {
    const stats = await Movie.aggregate([
        { $match: { rating: { $gte: 7 } } },
        {
            $group: {
                _id: '$releaseYear',
                avgRating: { $avg: '$rating' },
                avgPrice: { $avg: '$price' },
                minPrice: { $min: '$price' },
                maxPrice: { $max: '$price' },
                priceTotal: { $sum: '$price' },
                movieCount: { $sum: 1 }
            }
        },
        { $sort: { minprice: 1 } },
        { $match: { maxPrice: { $gte: 60 } } },

    ])
    res.status(200).json({
        status: 'SUCCESS',
        count: stats.length,
        data: {
            stats
        }
    });

})
exports.getMovieByGenre = asyncErrorHandler(async (req, res, next) => {
    res.status(200).json({
        status: 'SUCCESS',
        count: stats.length,
        data: {
            stats
        }
    });

})
