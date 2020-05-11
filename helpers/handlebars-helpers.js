const moment = require('moment');

module.exports = {

     generateDate: function(date, format){
        return moment(date).format(format);
    },
    select: function(selected, options){
        return options.fn(this).replace(new RegExp(' value=\"'+ selected + '\"'), '$&selected="selected"');
    },

 

};

