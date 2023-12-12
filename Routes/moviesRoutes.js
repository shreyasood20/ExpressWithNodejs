const movieController = require('../Controller/moviesController');
const authController = require('../Controller/userController')
const express = require('express');
const router = express.Router();

//router.param('id', movieController.checkId);
router.route('/top/:num')
    .get(movieController.getTopMovies, movieController.getAllMovies)
router.route('/movie-stats').get(movieController.getMovieStats)
router.route('/movie-genre').get(movieController.getMovieStats)
router.route('/')
    .get(authController.protect,movieController.getAllMovies)
    .post(movieController.validateMovie, movieController.addMovie);
router.route('/:id')
    .get(movieController.getMovie)
    .patch(movieController.updateMovie)
    .delete(authController.protect, authController.restrict('admin'), movieController.deleteMovie);
module.exports = router;