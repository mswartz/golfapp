// Set up collections for 
Players = new Meteor.Collection("players");
Courses = new Meteor.Collection("courses");
Games = new Meteor.Collection("games");
Stats = new Meteor.Collection("stats");

Courses.allow({  insert: function () { return true;  },
                 remove: function () { return true;  },
                 update: function () { return true;  }   });

if (Meteor.isClient) {

  Template.game.course = function () {
    var course = Courses.find({}, {name: "Franklin Park"}).fetch();
    var front = [];
    var back = [];

    //Dont work!
    // for (var i=0; i<9; i++) {
    //   front[i] = course[0].holes[i];
    // }

    // console.log(course[0]);
    return course[0];
  };

  //Receiving a score form the card
  Template.game.events({
    'click input.submit' : function() {
      var score = {};
      for(var i=1; i<19; i++){
        score[i] = (document).getElementById('score_'+i).value;
      }
    }
  })
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
 });
}
