const moment = require('moment');

module.exports = {

     generateDate: function(date, format){
        return moment(date).format(format);
    },
    select: function(selected, options){
        return options.fn(this).replace(new RegExp(' value=\"'+ selected + '\"'), '$&selected="selected"');
    },

    paginate: function(options){
        let output = '';
        if(options.hash.current === 1)
        {
        output += ` <a href=""><button class="btn"id="first">First</button></a>`;
       
        } 
        else 
        {
        output += ` <a href="?page=1"><button class="btn">First</button></a>`;
        }
    
        let i = (Number(options.hash.current) > 5 ? Number(options.hash.current) - 4 : 1);
        if(i !== 1){
            output += ` <a href=""><button class="btn">...</button></a>`;
        }
    
        for(; i <= (Number(options.hash.current) + 4) && i <= options.hash.pages; i++){
            if(i === options.hash.current){
             output += ` <a href=""><button class="btn">${i}</button></a>`;
            } 
            else {
             output += ` <a href="?page=${i}"><button class="btn">${i}</button></a>`;
            }
    
            if(i === Number(options.hash.current) + 4 && i < options.hash.pages){
                output += ` <a href=""><button class="btn">...</button></a>`;
            }
    
        }
    
    
        if(options.hash.current === options.hash.pages) {
       output += ` <a href=""><button class="btn">Last</button></a>`;
    
        } else {
        output += ` <a href="?page=${options.hash.pages}"><button class="btn">Last</button></a>`;
    
        }
        return output;
    }
    
    };
    
    