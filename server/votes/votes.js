var Sequelize = require( 'sequelize' );

var db = require( '../config/db' );
var helpers = require( '../config/helpers' );
var Session = require( '../sessions/sessions' );


var Vote = db.define( 'votes', {
  session_id: {
    type: Sequelize.INTEGER,
    unique: 'sess_option_idx'//why do we want the option and the session to have the same unique id?
  },
  option_id: {
    type: Sequelize.INTEGER,
    unique: 'sess_option_idx'//why do we want the option and the session to have the same unique id?
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

Vote.belongsTo( Session, {foreignKey: 'session_id'} );

Vote.addVote = function( sessionUser, movie, vote ) {
  // return Vote.create( { session_user_id: sessionUser, movie_id: movie, vote: vote } )
  //   .catch( function( err ) {
  //     console.error( err.stack );
  //   });
};

Vote.getSessOptionVotes = function( sessionId, optionId, category ) {
  // expect this function to return a promise
  // Should query the database and resolve as an array of
  // objects where each object represents a row
  // for the particular session and movie
  // The Votes table has a session_user_id not a session_id, so we have to do an inner join...
  // return Vote.findAll( { where: { movie_id: movieId }, include: { model: Session_User, attributes: [], where: { session_id: sessionId } } } )
  // .catch( function( err ) {
  //   console.error( err.stack );
  // });
}


module.exports = Vote;
