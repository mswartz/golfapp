if (Meteor.isClient){

Template.add_course.helpers({

  tees : function(){
    var tees = [];
    for(var n=0;n<3;n++){
      var tee_data = [];
      for(var i=1;i<19;i++){
        tee_data[i] = {
          'num' : i,
          'par' : 'tee_'+n+'_par_'+i,
          'yds' : 'tee_'+n+'_yds_'+i,
          'hcp' : 'tee_'+n+'_hcp_'+i
        };
      }//i

      tees[n] = {
        'color' : 'tee_color_'+n,
        'holes' : tee_data
      }
    }//n

    return tees;
  }

});

Template.add_course.events({
  'click input#add_course' : function() {
    var course = [];
    var name = $('#course_name').val();
    var tees = [];
    for(var n=0;n<3;n++){
      var holes = [];
      for(var i=1;i<19;i++){
        holes[i] = {
          'num' : i,
          'par' : $('.tee_color_'+n+'par_'+i).val(),
          'hcp' : $('.tee_color_'+n+'par_'+i).val(),
          'yds' : $('.tee_color_'+n+'par_'+i).val()
        }
      }
      tees[n] = {
        'color' : $('#tee_color_'+n).val(),
        'holes' : holes
      }
    }

    course['name'] = name;
    course['tees'] = tees;
    console.log(course);
    Courses.insert(course);
  }
});//events

}//isClient