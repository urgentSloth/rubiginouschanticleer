var helpers = require( '../config/helpers' );
var Vote = require( './votes' );
var Session_User = require( '../sessions_users/sessions_users' );
var mController = require( '../movies/moviesController' );
var Session = require( '../sessions/sessions' );
var User = require( '../users/users' );

var addVote = function( req, res ) {
  var voteData = req.body;
  Vote.find({ where: { //check if voteEntry exists
      sessionName: voteData.sessionName,
      optionId: voteData.optionId,
      category: voteData.category
    } })
.then( function(voteEntry) {
    if (voteEntry) { // if it exists, add a one vote to it
      Vote.addOneVote(voteEntry)
      .then(function(data) {
        res.json(data);
      });
    } else { // if not create a new vote entry 
      Vote.createVoteEntry(voteData)
      .then(function(data) {
        res.json(data);
      });
    }
  })
};

//tally up votes, return winner (a movie or a genre), or the tie data
var tallyVotes = function( req, res, next ) {

}

module.exports = {

  tallyVotes: tallyVotes,
  addVote: addVote
      
};
