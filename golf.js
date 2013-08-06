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

Template.player.events({
  'click input.newplayer_submitplayer' : function() {
    var newplayer = gatherValues("newplayer", ["name", "initials", "high_rnd", "low_rnd", "handicap"]);
    Players.insert(newplayer);
  },
  'click input.player_deleteplayer' : function(){
    Players.remove(this._id);
  }
});

function gatherValues(schema, array) {
  var result = {};
  for ( var i = 0; i < array.length; i++) {
    var value = $('#'+schema+"_"+array[i]).val();
    result[array[i]] = value;
  }
  return result;
}

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
  'click input.newcourse_submitcourse' : function() {

    var tee_count = $('.newcourse_tee').length;
    var hole_count = $('.newcourse_tee').find('.hole_par').length;

    var newcourse = gatherValues('newcourse',['name']);

    var tees = [];
    for (var x = 0; x < tee_count; x++) {
      var holes = [];
      for (var i = 0; i < hole_count; i++ ) {
        var hole = gatherValues('newcourse_tee_'+x+'_hole_'+i, ['par', 'yards', 'handicap']);
        holes.push(hole);
      }
      var tee = gatherValues('newcourse_tee_'+x, ["color", "par", "yards"]);
      var in_data = gatherValues('newcourse_tee_'+x+'_in',['yards', 'par']);
      var out_data = gatherValues('newcourse_tee_'+x+'_out',['yards', 'par']);
      tee['holes'] = holes;
      tee['in'] = in_data;
      tee['out'] = out_data;
      tees.push(tee);
    }

    newcourse['tees'] = tees;
    console.log('Course', newcourse);
    Courses.insert(newcourse);
  },
  'click input.delete' : function(){
    Courses.remove(this._id);
  }
});


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
