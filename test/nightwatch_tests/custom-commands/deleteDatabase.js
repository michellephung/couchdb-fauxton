exports.command = function(databaseName) {
  	
    var client = this;
    var nano = require('nano')('http://localhost:5984');

    nano.db.destroy(databaseName, function(err, body, header) {
      if(err){
        console.log('in nano DeleteDatabase Function '+databaseName, err.message);
        return this;
      }
      console.log('nano cleaned up: '+ databaseName+' is deleted: ', body);
    });
  
	client.pause(10)
  return this; // allows the command to be chained.
};