exports.command = function(databaseName) {
  	
    var client = this;
    var nano = require('nano')('http://localhost:5984');

    nano.db.create(databaseName, function(err, body, header) {
      if(err){
        console.log('Error in nano CreateDatabase Function: '+ databaseName, err.message);
        return;
      }
      console.log("nano created a database "+databaseName + body);
    });
    client.pause(10);
  	return this;
};