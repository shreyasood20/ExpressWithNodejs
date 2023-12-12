//middleware is a function used to modify request data
const express = require('express');
const morgan = require('morgan');
const CustomError = require('./Utils/CustomError');
const globalErrorHandler = require('./Controller/errorController');
const movieRouter = require('./Routes/moviesRoutes');
const authRouter = require('./Routes/userRoutes');
let app = express();



// Middleware
//always takes 3 arguments req,res,next()
function logger(req, res, next) {
    console.log('custom middleware called')
    next();
}

app.use(express.json())//-> returns a middleware function
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))//->returns a middleware function
}
app.use(express.static('./public'))
app.use(logger)//-> is a middleware function
app.use((req, res, next) => {
    req.requestedAt = new Date().toISOString();
    next();
});
//USING ROUTES
app.use('/app/v1/movies', movieRouter);
app.use('/app/v1/user',authRouter);
app.all('*', (req, res, next) => {
    // res.status(404).json({
    //     status: 'fail',
    //     message: `can't find ${req.originalUrl} on the server`
    // })
    // const err = new Error(`can't find ${req.originalUrl} on the server`);
    // err.status = 'fail',
    // err.statusCode = 404;
    const err = new CustomError(`can't find ${req.originalUrl} on the server`);

    next(err)
})

app.use(globalErrorHandler)

module.exports = app




//THIS CAN BE FURTHER SHORTENED TO USE THE SAME ENDPOINT
//app.get('/app/v1/movies', getAllMovies);
// app.post('/app/v1/movies', addMovie);
// app.get('/app/v1/movies/:id', getMovie);
// app.patch('/app/v1/movies/:id', updateMovie);
// app.delete('/app/v1/movies/:id', deleteMovie);


// app.get('/app/v1/movies', (req, res) => {
//     //THIS FORMATTING FOR SENDING DATA IS CALLED ENVELOPING
//     res.status(200).json({
//         status: 'SUCCESS',
//         data: {
//             count: movies.length,
//             movies: movies
//         }
//     });
// })
//create new entry
// app.post('/app/v1/movies', (req, res) => {
//     // console.log(req.body);// THIS WILL LOG Undefined, we need to use middleware
//     const movieId = movies[movies.length - 1].id + 1
//     const newMovie = Object.assign({ id: movieId }, req.body)
//     movies.push(newMovie);
//     fs.writeFile('data/movies.json', JSON.stringify(movies), error => {
//         if (error) console.log(error.message)
//         res.status(201).send('CREATED')// 201-> stands for created
//     })

// })
// get route parameter :-> named url segment to get data e.g <:id>
//multiple paramaters->values for all should be passed, or we can make it optional :id?
// app.get('/app/v1/movies/:id', (req, res) => {
//     console.log(req.params.id)
//     const id = req.params.id * 1
//     const movie = movies.find((x) =>
//         x.id == id
//     )
//     if (!movie) {
//         return res.status(404).json({
//             status: 'ERROR',
//             message: 'movie with id ' + id + ' not found'
//         })

//     }
//     res.status(200).json({
//         status: 'SUCCESS',
//         data: {
//             movie: movie
//         }
//     })
// })
// app.patch('/app/v1/movies/:id', (req, res) => {
//     const id = req.params.id * 1
//     const movieToUpdate = movies.find((x) =>
//         x.id == id
//     )
//     const index = movies.findIndex((x) =>
//         x.id == id
//     )
//     if (!movieToUpdate || !index) {
//         return res.status(404).json({
//             status: 'ERROR',
//             message: 'movie with id ' + id + ' not found'
//         })

//     }
//     movies[index] = Object.assign(movieToUpdate, req.body);

//     fs.writeFile('data/movies.json', JSON.stringify(movies), error => {
//         if (error) console.log(error.message)
//         res.status(200).json({
//             status: 'SUCCESS',
//             data: {
//                 movie: movies[index]
//             }
//         })
//     })
// })
// app.delete('/app/v1/movies/:id', (req, res) => {
//     const id = req.params.id * 1
//     const movieToDelete = movies.find((x) =>
//         x.id == id
//     )
//     const index = movies.findIndex((x) =>
//         x.id == id
//     )
//     if (!movieToDelete || !index) {
//         return res.status(404).json({
//             status: 'ERROR',
//             message: 'movie with id ' + id + ' not found'
//         })

//     }
//     movies.splice(index, 1)
//     fs.writeFile('data/movies.json', JSON.stringify(movies), error => {
//         if (error) console.log(error.message)
//         res.status(200).json({
//             status: 'SUCCESS',
//             data: {
//                 movie: null
//             }
//         })
//     })

// })
// app.get('/', (req, res) => {
//     //set status before sending the response, we can also send html response using send method
//     //res.status(200).send('get....')// content-type: text/html with send method
//     res.status(200).json({message:'hello word', status: 200});
// })
