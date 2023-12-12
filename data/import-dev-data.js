const mongoose = require('mongoose');
const fs = require('fs');
const dotEnv = require('dotenv');
dotEnv.config({ path: './config.env' })

const Movie = require('./../Model/movieModel')



//READ FILES IN SYNC
//path is relative to command directory
const movies = JSON.parse(fs.readFileSync('./data/movies.json', 'utf-8'));

//Deleting existing movies from collection
const deleteMovies = async () => {
    try {
        await Movie.deleteMany()
        console.log('succesfully deleted everything');
    } catch (error) {
        console.log(error)
    }
    process.exit();
}

//Import movies to database
const importMovies = async () => {
    try {
        await Movie.create(movies)
        console.log('succesfully inserted everything');
    } catch (error) {
        console.log(error)
    }
    process.exit();
}

mongoose.connect(process.env.CONN_STR).then((conn) => {
    console.log('db connection successfull');
    if (process.argv[2] == '--delete') {
        deleteMovies();
    }
    if (process.argv[2] == '--import') {
        importMovies();
    }
}).catch((error) => {
    console.log('Error ', error);
})



