angular.module( 'moviematch.auth', [] )

.controller( 'AuthController', function( $scope, Auth, $window, $location, $timeout ) {
  if( $location.path() === '/signout' ) {
    console.log( 'You are signed out. Redirecting in 2s.' );
    Auth.signout();
    $timeout( function() {
      $location.path( '/signin' );
    }, 2000 );
  }
  
  if (Auth.isAuth()) {
    $location.path('/lobby');
  }

  $scope.user = {};
  $scope.error = {}
  $scope.error.userInput = "Please enter a username.";
  $scope.error.pwdInput = "Please enter a password.";



  $scope.signin = function () {
    Auth.signin( $scope.user )
      .then( function ( token ) {
        $scope.setUserName();
        $window.localStorage.setItem( 'com.moviematch', token );
        $location.path( '/sessions' );
      })
      .catch( function ( error ) {
        $scope.error.signinError = "There was an error logging in. Please double check your username and password.";
        console.error( error );
      });
  };

  $scope.signup = function () {
    Auth.signup( $scope.user )
      .then( function ( token ) {
        $scope.setUserName();
        $window.localStorage.setItem( 'com.moviematch', token );
        $location.path( '/sessions' );
      })
      .catch( function ( error ) {
        $scope.error.signupError = "There was an error signing up. It's possible that username already exists.";
        console.error( error );
      });
  };

  $scope.setUserName = function () {
    Auth.setUserName( $scope.user );
  };

})
.directive('backImg', function() {
  return function($scope, $element, $attrs){
    var url = $attrs.backImg;
    $element.css({
      'background-image': 'url(' + url +')',
      'background-size' : 'cover'
    });
  };
});
