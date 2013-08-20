/**********************************

G A M E S

- Display all games
- Delete games

**********************************/

if(Meteor.isClient){

Template.games.helpers({
  games : function(){
    var raw_games = Games.find().fetch();
    // var player = Players.find({}, {_id : games.players[0].player_id});
    var games = [];

    for(var i=0;i<raw_games.length;i++){
      console.log(raw_games[i]);
    }

    return raw_games;
  },
  name : function(cid){
    var course = Courses.find({}, {_id: cid});
    return course[0].name;
  }
});

Template.games.events({
  'click input.delete' : function(){
    console.log(this._id);

    Games.remove(this._id);
  }
});

}//isClient