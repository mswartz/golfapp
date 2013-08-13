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
  'click input.newcourse_newtee' : function(){
    var firstTee = $('#newcourse_tee_0').clone();
    $('#newcourse').append(firstTee);
  },
  'click input.newcourse_removetee' : function(e){
    var thisTee = $(e.target).closest('.newcourse_tee');
    thisTee.remove();
  },
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
      var out_data = gatherValues('newcourse_tee_'+x+'_ out',['yards', 'par']);
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


// ************
// All Games view
// ************
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


//************
// New Game
//************

  Template.newgame.helpers ({
    debug : function(stuff){
      console.log(stuff);
    },
    course_selected : function(){
      var course = Courses.findOne({"name":Session.get("course_selected")});
      return course;
    },
    courses : function(){
      return Courses.find({}).fetch();
    }
  });

//Receiving a score form the card
  Template.newgame.events({
    'click input.submit' : function() {
      var net_score = {};
      var total = 0;
      var course = Session.get("course_selected");
      var players = [];

      //suck in the scores from the input table
      for(var i=1; i<19; i++){
        net_score[i] = parseInt($('#score_'+i).val(), 10);
        console.log(net_score[i]);
        total = total + net_score[i];
      }

      //add the scores and data about the game to the players array
      for(var i=0; i<$(".game_player").length; i++){
        players[i] = {
          "player_id" : $(".game_player").data("id"),
          "course" : course,
          "score" : net_score,
          "total" : total 
        }
      }

      //add thoe whole game to the games collection
      Games.insert({
        "course" : course._id,
        "players" : players
      });

      //iterate the players and add their scores to their games table
      for(var i=0; i<players.length; i++){
        Players.update(players[i].player_id, {$set : {"games" : players[i]} } );
      }
    },

    //Update the selected course using the select option
    'change select.course_select' : function() {
      Session.set("course_selected", $("#course_select").val());
      console.log(Session.get("course_selected"));
    }
  })


//*****************
// Mode Selector : replace with real router some day
//*****************

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
