angular.module( 'moviematch.genres', [] )

.controller('GenresController', function($scope, FetchGenres) {
	
	var getAllGenres = function () {
		FetchGenres.getAllGenres()
			.then(function(genres) {
				console.log(genres);
				$scope.genres = genres;
			})
			.catch(funnction(err) {
				console.error('EERRRRRRROOOORRRR', err);
			});
	};

	// getAllGenres();

	$scope.getGenre = function (genre) {
		FetchGenres.getGenre(genre)
			.then(function(genre) {
				$scope.specificGenre = genre;
			});
	}
});