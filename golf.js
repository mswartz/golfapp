// Set up collections for 
Players = new Meteor.Collection("players");
Courses = new Meteor.Collection("courses");
Games = new Meteor.Collection("games");
Stats = new Meteor.Collection("stats");


if (Meteor.isClient) {

//
//The UI panel that holds everything
//
  Template.ui.helpers({
    screen : function(){
        var frag = Meteor.render(Template[Session.get("mode_selected")]);
        $('.screen').html(frag);
    }
  });


//
//All players view
//
  Template.player.helpers({
    players : function(){
      var players = Players.find({}).fetch();
      return players;
    }
  });

//
//All courses view
//
  Template.courses.helpers({
    course : function(){
      var course = Courses.find({}).fetch();
      return course;
    }
  });

  Template.courses.events({
    'click input.course_submitcourse' : function() {
      var name=$('#course_name').val();
      var holes = [];
      var total = $("add_total");
      for(var i=1; i<19; i++){
        holes[i] = { 
          "number" : i,
          "par" : parseInt((document).getElementById('add_hole_'+i).value.trim())
        };
      }
      var new_course = {
        "name" : name,
        "holes" : holes,
        "total" : total
      };
      Courses.insert(new_course);
    }
  })


//
// All Games view
//
  Template.allgames.helpers({
    games : function(){
      var raw_games = Games.find({}).fetch();
      var games = {};
      // var player = Players.find({}, {_id : games.players[0].player_id});
      var raw_course = Courses.find({}, {_id: raw_games[0].course}).fetch();

      console.log(raw_games);
      return raw_games;
    },
    name : function(cid){
      var course = Courses.find({}, {_id: cid});
      return course[0].name;
    }
  });


//
// New Game
//

  Template.newgame.helpers ({
    debug : function(stuff){
      console.log(stuff);
    },
    course : function(){
      // return Courses.find({}).fetch()[0];
      var course = Session.get("course_selected");
      return course[0];
    }
  });

//Set a session var when the newgame is created. 
  Template.newgame.created = function(){
    // console.log("created");
    var course = Courses.find({}, {_id : "jsGLppubCPdRpyt8X"}).fetch();
    Session.set("course_selected", course);
  }

//Receiving a score form the card
  Template.newgame.events({
    'click input.submit' : function() {
      var net_score = {};
      var total = 0;
      for(var i=1; i<19; i++){
        net_score[i] = parseInt((document).getElementById('score_'+i).value.trim());
        // console.log(net_score[i]);
        total = total + net_score[i];
      }
      var course = Session.get("course_selected");
      var players = {};

      for(var i=0; i<$(".game_player").length; i++){
        players = {
          "player_id" : $(".game_player").data("id"),
          "score" : net_score,
          "total" : total }
      }

      console.log(players);

      Games.insert({
        "course" : course[0]._id,
        "players" : players,
      });
    },
    'click input.course_select' : function() {
      var course = Courses.find({}, {_id : "jsGLppubCPdRpyt8X"}).fetch();
      Session.set("course_selected", course);
      console.log(Session.get("course_selected"));
    }
  })


//
// Mode Selector
//

  Template.mode.helpers({
    mode_selected : function(){
      return Session.get("mode_selected");
    }
  })

  Template.mode.events({
    'click input.mode_newgame' : function() {
      Session.set("mode_selected", "newgame");
    },
    'click input.mode_player' : function() {
      Session.set("mode_selected", "player");
    },
    'click input.mode_course' : function() {
      Session.set("mode_selected", "courses");
    },
    'click input.mode_allgames' : function() {
      Session.set("mode_selected", "allgames");
    },
    'click input.mode_null' : function() {
      Session.set("mode_selected", undefined);
    },
  })
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup

 });
}
