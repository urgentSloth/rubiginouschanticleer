var Sequelize = require( 'sequelize' );

var db = require( '../config/db' );
var helpers = require( '../config/helpers' );
var Session = require( '../sessions/sessions' );


var Vote = db.define( 'votes', {
  sessionName: {
    type: Sequelize.STRING,
  },
  optionId: {
    type: Sequelize.INTEGER,
  },
  category: {
    type: Sequelize.STRING
  },
  votes: Sequelize.INTEGER
} );

Vote.sync().then( function() {
  console.log( "votes table created" );
} )
.catch( function( err ) {
  console.error( err );
} );


Vote.addOneVote = function( voteEntry ) {
  return voteEntry.updateAttributes({
        votes: voteEntry.votes + 1
  })
  .catch( function(err) {
    console.error(err);
  });
};

Vote.createVoteEntry = function( voteData ) {
  return Vote.create({ 
    sessionName: voteData.sessionName,
    optionId: voteData.optionId, 
    category: voteData.category,
    votes: 1 
  })
  .catch( function(err) {
    console.error(err);
  });
};


module.exports = Vote;
