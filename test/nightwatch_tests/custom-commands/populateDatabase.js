exports.command = function(databaseName) {
  	
  var client = this;
  var nano = require('nano')('http://localhost:5984');
  var database = nano.use(databaseName);

  for( var i=1 ; i<20 ; i++){
    
    var documentName = "name" + i;

    database.insert({ number: i }, documentName, function(err, body, header) {
        if (err) {
          console.log('Error in nano populateDatabase Function: '+documentName+',in database: '+databaseName, err.message);
          return client;
        }
        console.log('nano created a doc: '+documentName+', in database: '+ databaseName);
      });
  }
  
	client.pause(10)
  return this; // allows the command to be chained.

};