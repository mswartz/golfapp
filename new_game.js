/**********************************

N E W  G A M E

- Track a new game
- Add Players
- Add Score

**********************************/

if (Meteor.isClient){

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

	  //add the whole game to the games collection
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

function gatherValues(schema, array) {
  var result = {};
  for ( var i = 0; i < array.length; i++) {
    var value = $('#'+schema+"_"+array[i]).val();
    result[array[i]] = value;
  }
  return result;
}

}//isClient