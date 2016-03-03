angular.module( 'moviematch.selectingOption', [] )

.controller( 'SelectingOptionController', function( $scope, Votes, Session, Socket, $location, Auth, $routeParams, FetchMovies, $timeout ) {
  
  var setTimer = function(seconds){
    $scope.counter = seconds;
    $scope.timer = function(seconds){
      var countdown = $timeout($scope.timer,1000);
      $scope.counter -= 1;
      if( $scope.counter === 0 ){
        $timeout.cancel(countdown);
      }
    }
    $scope.timer();
  };

  setTimer(10);

  //get the current session
  Session.getSession()
  .then( function( session ) {
    $scope.session = session;
  });

  //get the category you're voting on, movie or genre
  var category = $routeParams.category;
   
  //**********************
  //GETTING FAKE MOVIE DATA --- take this out when we make real queries
  //we will make a request for genre data or movie data eventually something like:
  //$scope.data = Vote.getOptions(category); 
  var fetchNextMovies = function( packageNumber, callback ){
    FetchMovies.getNext10Movies( packageNumber )
      .then( function( data ) {
        $scope.options = data;
        callback(data);
      })
  };
  fetchNextMovies(0, function(data){console.log('fake data received');});
  //GETTING FAKE MOVIE DATA 
  //********************************

  $scope.vote = function(option){
    //we need the sessionName, the option's id, and the option's category to record the vote in the db, then emit the vote to the other users
    Votes.addVote($scope.session.sessionName, option.id, category);
  }

  //this will update our d3 animations eventually 
  Socket.on( 'voteAdded', function(vote) {
    console.log('We just got a new vote!!! ', vote);
  });


})