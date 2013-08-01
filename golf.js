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
    var tees = [];
    var holes = [];

    for(var x=0;x<$(".course_input tr").length;x++){
      var color = $("#tee_name_"+x);
      for(var i=0; i<18; i++){
        var par = parseInt($('#add_hole_'+x+"_"+(i+1)).val());
        holes[i] = { 
          "number" : i+1,
          "par" : par
        };
      };
      var total = $("#add_total_"+x).val();
      tees[x]={"color":color, "holes":holes, "total" : total};
    };
    console.log(tees);

    var new_course = {
      "name" : name,
      "tees" : tees
     };

    console.log(new_course);

    Courses.insert(new_course, function(err, id){
      console.log(err, id);
    });
  },
  'click input.delete' : function(){
    Courses.remove(this._id);
  }
})


//
// All Games view
//
  Template.allgames.helpers({
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
  Template.allgames.events({
    'click input.delete' : function(){
      console.log(this._id);

      Games.remove(this._id);
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
      return course;
    }
  });

//Set a session var when the newgame is created. 
  Template.newgame.created = function(){
    // console.log("created");
    var course = Courses.findOne();
    Session.set("course_selected", course);
  }

//Receiving a score form the card
  Template.newgame.events({
    'click input.submit' : function() {
      var net_score = {};
      var total = 0;
      for(var i=1; i<19; i++){
        net_score[i] = parseInt($('#score_'+i).val(), 10);
        console.log(net_score[i]);
        total = total + net_score[i];
      }
      var course = Session.get("course_selected");
      var players = [];

      for(var i=0; i<$(".game_player").length; i++){
        players[i] = {
          "player_id" : $(".game_player").data("id"),
          "score" : net_score,
          "total" : total 
        }
      }

      console.log(players);

      Games.insert({
        "course" : course._id,
        "players" : players
      });
    },

    'click input.course_select' : function() {
      var course = Courses.findOne();
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
