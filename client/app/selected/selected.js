angular.module( 'moviematch.selected', [] )
.controller( 'SelectedController', function( $scope, Session, Socket, FetchMovies, $location, Auth, $timeout, $routeParams) {
  $scope.selectedOption = Session.getSelectedOption();

  var category = $location.path().split('/')[2];

  var nextScreen = function(){
    $location.path('/selectingOption/movie');
  }

  //if we just chose genre, wait 2 seconds before moving on to choose movie
  if(category === 'genre'){
    //also fetch movies data now so we don't have to wait on it, in the selectingOptions view
    FetchMovies.getMovies( $scope.selectedOption.id )
    .then(function(movies){
        $timeout(nextScreen, 2000);         
    });
  }

});
