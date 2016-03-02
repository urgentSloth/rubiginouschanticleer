var helpers = require( '../config/helpers' );
var Vote = require( './votes' );
var Session_User = require( '../sessions_users/sessions_users' );
var mController = require( '../movies/moviesController' );
var Session = require( '../sessions/sessions' );
var User = require( '../users/users' );

var addVote = function( req, res ) {
  var voteData = req.body;
  // //NEED TO UPDATE VOTES DB WITH THE VOTE DATA
  // ///example **********
  // Project.find({ where: {sessionName: voteData.sessionName} }).on('success', function(ses) {
  //   if (project) { // if the record exists in the db
  //     project.update({
  //       title: 'a very different title now'
  //     }).success(function() {});
  //   }
  // })
  // ///example **********

  res.json(voteData);
};


//tally up votes, return winner (a movie or a genre), or the tie data
var tallyVotes = function( req, res, next ) {
  // //if choosing genre, set category to genre
  // //if not, movie
  // if(req.body.category === 'genre'){
  //   var category = 'genre'
  // } else {
  //   var category = 'movie'
  // }
  // // get vote data
  // Vote.getSessVotes( sessionID, movieID, category )
  // .then( function( voteData ) {
  //   // check if votedata is an array --> question for matchme team, when would it not be an array????
  //   if( Array.isArray( voteData ) ) {
  //     // if so, tally up votes

  //   } else { 
  //     res.json( false );
  //   } 
  // } );
}

module.exports = {

  tallyVotes: tallyVotes,
  addVote: addVote
      
};
