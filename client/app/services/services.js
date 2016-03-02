angular.module( 'moviematch.services', [] )

.factory( 'Auth', function( $http, $location, $window ) {
  var username = '';
  return {
    signin : function( user ) {
      return $http.post( '/api/users/signin', user )
      .then(function ( resp ) {
        return resp.data.token;
      });
    },

    signup : function( user ) {
      return $http.post( '/api/users/signup', user )
      .then(function( resp ) {
        return resp.data.token;
      })
      .catch(function( err ) {
        console.log(err);
      });
    },

    isAuth : function() {
      return !!$window.localStorage.getItem( 'com.moviematch' );
    },

    signout : function() {
      $window.localStorage.removeItem( 'com.moviematch' );
    }, 

    setUserName : function( user ) {
      $window.localStorage.setItem( 'username', user.username );
    },

    getUserName : function () {
      return $window.localStorage.getItem( 'username' );
    }
  } 
} )

.factory( 'Session', function( $http, $window, $location ) {
  return {
    createSession: function( sessionName, callback ) {
      return $http.post( '/api/sessions', { sessionName: sessionName } )
      .then( function( response ) {
        callback( sessionName ); // used for emitting session data
        return response;
      }, function( err ) {
        console.error( err );
      } );
    },

    fetchSessions: function() {
      return $http.get ( '/api/sessions' )
      .then( function( response ) {
        return response.data;
      }, function( err ) {
        console.error( err );
      } ); 
    }, 

    joinSession: function( sessionName, username, callback ) {
      return $http.post( '/api/sessions/users', { sessionName: sessionName, username: username } )
      .then( function( response ) {
        callback( username, sessionName ); // used for emitting session data
        $location.path( '/lobby' );
        return response;
      }, function( err ) {
        console.error( err );
      } );
    },

    setSession: function( sessionName ) {
      $window.localStorage.setItem( 'sessionName', sessionName );
    }, 

    getSession: function() {
      var sessionName = $window.localStorage.getItem( 'sessionName' );
      return $http.get( '/api/sessions/' + sessionName )
      .then( function( session ) {
        return session.data;
      }, function( err ) {
        console.error( err );
      });
    }

  }
} )

.factory( 'Match', function( $http, $location ) {
  return {

    sendVote: function( sessionName, username, movieID, vote ) {
      return $http.post( // returns a promise; if you want to make use of a callback simply use .then on the return value.
        '/api/votes', // expect this endpoint to take a json object
                                      // with sessionID and userID
                                      // OR sessionuserID
                                      // AND movieID
                                      // AND vote (boolean true/false where true is yes and false is no)
        { sessionName: sessionName, username: username, movie_id: movieID, vote: vote })
      .then( function( response ) { // if the promise is resolved
        return response;
      },
      function( err ) { // if the promise is rejected
        console.error( err );
      } );
    },

    matchRedirect: function( id ) {
      $location.path( '/showmatch/' + id );
    },

    checkMatch: function( session, movie ) {
      // expects session and movie
      // Calls /api/sessions/:sid/match/:mid
      // Should get back either 'false' or the data for the matched movie
      return $http.get(
        '/api/sessions/' + session.id + '/match/' + movie.id
      )
      .then( function( response ) {
        return response.data;
      }, function( err ) {
        console.error( err );
      });
    }

  }
} )

.factory( 'Lobby', function( $http ) {
  return {
    getUsersInOneSession: function( sessionName ) {
      return $http.get( '/api/sessions/users/' + sessionName )
      .then( function( res ) {
        return res.data;
      } , 
      function( err ) {
        console.error( err );
      } );
    }
  }
})

.factory( 'FetchMovies', function( $http ) {
  return {

    getMovie: function( id ) {
      return $http.get( '/api/movies/' + id )
      .then( function( res ) {
        return res.data;
      },
      function( err ) {
        console.error( err );
      });
    },

    getNext10Movies: function( packageNumber ) {
      return $http.get( '/api/movies/package/' + packageNumber )
      .then( function( res ) {
        return res.data;
      },
      function( err ) {
        console.error( err );
      } );
    }

  }
})

.factory ('FetchGenres', function($http) {
  return {

    getAllGenres: function () {
      return $http.get('/api/genres/')
      .then(function(res) {
        return res.data;
      },
      function(err) {
        console.error(err);
      }); 
    },

    getGenre: function (genre) {
      return $http.get('/api/genre/' + genre)
      .then( function(res) {
        return res.data;
      },
      function(err) {
        console.error(err);
      }); 
    }

  }
})

.factory( 'Socket', ['socketFactory', function(socketFactory){
  return socketFactory();
}]);
