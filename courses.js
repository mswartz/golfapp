/**********************************

C O U R S E S 

- Display all courses
- Add new courses
  - add tees
- Delete courses

**********************************/

if (Meteor.isClient){

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
      var out_data = gatherValues('newcourse_tee_'+x+'_out',['yards', 'par']);
      var tot_data = gatherValues('newcourse_tee_'+x+'_tot',['yards', 'par']);
      tee['holes'] = holes;
      tee['in'] = in_data;
      tee['out'] = out_data;
      tee['tot'] = tot_data;
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

function gatherValues(schema, array) {
  var result = {};
  for ( var i = 0; i < array.length; i++) {
    var value = $('#'+schema+"_"+array[i]).val();
    result[array[i]] = value;
  }
  return result;
}

}