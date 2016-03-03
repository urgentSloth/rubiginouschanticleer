angular.module( 'moviematch.selectingOption', [] )

.controller( 'SelectingOptionController', function( $scope, Votes, Session, Socket, $location, Auth, $routeParams, FetchMovies, $timeout, FetchGenres ) {

  var category = $routeParams.category;
  var seconds = 5;

  Session.getSession()
  .then( function( session ) {
    $scope.session = session;
  });

  $scope.vote = function(option){
    Votes.addVote($scope.session.sessionName, option.id, category);
  };

  var tallyVotes = function(){
   Votes.tallyVotes($scope.session.sessionName, category)
    .then(function(winnerArr){
      if( winnerArr.length === 1 ) { //when there's a winner
        Session.setSelectedOption(winnerArr[0]);
       $location.path('/selected');
      } else { //when there's a tie
        $scope.options = winnerArr;
        //decrease amt of time to vote each time
        seconds = Math.floor(seconds * .75);
        setTimer(seconds);
      }
    });
  }

  var setTimer = function(seconds){
    $scope.counter = seconds;
    $scope.timer = function(seconds){
      var countdown = $timeout($scope.timer,1000);
      $scope.counter -= 1;
      if( $scope.counter === 0 ){
        //when the timer reaches zero, make it stop
        $timeout.cancel(countdown);
        tallyVotes();
      }
    }
    $scope.timer();
  };
  
  setTimer(seconds);

  if(category === 'genre'){
    FetchGenres.getAllGenres()
      .then(function(data){
        $scope.options = data;
      });

  } else {//GETTING FAKE MOVIE DATA --- take this out when we make real queries
 
    var fetchNextMovies = function( packageNumber, callback ){
      FetchMovies.getNext10Movies( packageNumber )
        .then( function( data ) {
          $scope.options = data;
          callback(data);
        })
    };
    fetchNextMovies(0, function(data){console.log('fake data received');});
  }

  //this will update our d3 animations eventually 
  Socket.on( 'voteAdded', function(vote) {
    console.log('We just got a new vote!!! ', vote);
  });


})