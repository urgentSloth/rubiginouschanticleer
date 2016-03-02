angular.module( 'moviematch.selectingOption', [] )

.controller( 'SelectingOptionController', function( $scope, Votes, Session, Socket, $location, Auth, $routeParams, FetchMovies ) {
  
  //get the current session
  Session.getSession()
  .then( function( session ) {
    $scope.session = session;

  });

  //get the category you're voting on, movie or genre
  var category = $routeParams.category;

  //we will make a request for genre data or movie data
  //$scope.data = Vote.getOptions(category);    

  //GETTING FAKE MOVIE DATA
  var fetchNextMovies = function( packageNumber, callback ){
    FetchMovies.getNext10Movies( packageNumber )
      .then( function( data ) {
        $scope.options = data;
        callback(data);
      })
  };
  fetchNextMovies(0, function(data){console.log('data received');});
  //GETTING FAKE MOVIE DATA



  $scope.vote = function(option){
    //we need the sessionName, the option's id, and the option's category to record the vote in the db, then emit the vote to the other users
    console.log('sessionName?', $scope.session.sessionName)
    Votes.addVote($scope.session.sessionName, option.id, category);
  }

  Socket.on( 'voteAdded', function(vote) {
    console.log('We just got a new vote: ', vote);
  });


})