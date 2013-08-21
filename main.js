/**********************************

M A I N

**********************************/

// Set up collections for 
Players = new Meteor.Collection("players");
Courses = new Meteor.Collection("courses");
Games = new Meteor.Collection("games");
Stats = new Meteor.Collection("stats");


if (Meteor.isClient) {
  //Add Routers
  Meteor.Router.add({
    '/new': 'newgame',
    '/add_course' : 'add_course',
    '/courses': 'courses',
    '/games': 'games',
    '/players': 'players',
    '*': 'not_found'
  });
}


if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup

 });
}
