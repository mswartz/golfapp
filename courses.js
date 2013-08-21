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
  'click input.newcourse_removetee' : function(e){
    var thisTee = $(e.target).closest('.newcourse_tee');
    thisTee.remove();
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