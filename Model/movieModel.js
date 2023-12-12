const mongoose = require('mongoose');
const validator = require('validator');
//CREATE A SCHEMA
const movieSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'name is required'],
        unique: true,
        maxlength: [100, ' Movie name length should be less than 100'],
        minlength: [4, ' Movie name length should be more than 4'],
        validate: [validator.isAlpha, 'movie name should only contain alphabets'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'description is required'],
        trim: true
    },
    duration: {
        type: Number,
        required: [true, 'duration is required']
    },
    rating: {
        type: Number,
        validate: {
            validator:
                function (value) {
                    return value >= 1 && value <= 10
                },
            message: 'Ratings {VALUE} should be above 1 or below 10'
        }

    },
    totalRatings: {
        type: Number
    },
    releaseYear: {
        type: Number,
        required: [true, 'releaseYear is required'],
    },
    releaseDate: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    genre: {
        type: [String],
        required: [true, 'genre is required'],
    },
    director: {
        type: [String],
        required: [true, 'director is required'],
    },
    coverImage: {
        type: [String],
        required: [true, 'coverImage is required'],
    },
    actors: {
        type: [String],
        required: [true, 'actors is required'],
    },
    price: {
        type: Number,
        required: [true, 'price is required'],
    }

})
//CREATE A MODEL, following will create a collection with Movie object
const Movie = new mongoose.model('Movie', movieSchema)

module.exports = Movie