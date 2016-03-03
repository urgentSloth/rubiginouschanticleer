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

//return winnerArr array of options that tied, or an arr with a single option
var tallyVotes = function( req, res, next ) {
  var category = req.params.category;
  var sessionName = req.params.sessionName;
  var voteType = 
  Vote.findAll({ where: { //check if voteEntry exists
      sessionName: sessionName,
      category: category
    }})
  .then( function(optionsArr) {
    var winnerArr = [];
    var mostVotes = 0;

    optionsArr.forEach(function(option){
      if(option.votes === mostVotes){
        winnerArr.push(option);
      } else if (option.votes > mostVotes){
        winnerArr = [option];
        mostVotes =  option.votes;
      }
    });
    res.json(winnerArr);
  });
}

module.exports = {

  tallyVotes: tallyVotes,
  addVote: addVote
      
};
