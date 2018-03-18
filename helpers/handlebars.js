var register = function(Handlebars) {

    var helpers = {



        timeFormat: function(time){
            return timeNow(time);
        },
        prepareError: function(errors, parameter, tag){
          var x = errors;
          for (var i = 0; i < x.length; i++){
            if (x[i].param == parameter){
              return '<'+tag+'>'+x[i].msg+'</'+tag+'>'
            }
          }
        }



};

if (Handlebars && typeof Handlebars.registerHelper === "function") {
    for (var prop in helpers) {
        Handlebars.registerHelper(prop, helpers[prop]);
    }
} else {
    return helpers;
}

};

function timeNow(time) {
  var d = new Date(time),
      h = (d.getHours()<10?'0':'') + d.getHours(),
      m = (d.getMinutes()<10?'0':'') + d.getMinutes();
  return h + ':' + m;
}

module.exports.register = register;
module.exports.helpers = register(null); 