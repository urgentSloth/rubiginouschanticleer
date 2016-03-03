angular.module( 'moviematch.movies', [] )

.controller('MoviesController', function($scope, FetchMovies) {

	var getMoviesByGenreId = function (genreId) {
		FetchMovies.getMovies(genreId)
			.then(function(movies) {
				$scope.movies = movies;
			})
			.catch(function(err) {
				console.error(err);
			});
	}

	getMoviesByGenreId(35);

});