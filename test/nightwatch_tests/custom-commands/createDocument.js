exports.command = function(documentName, databaseName) {

  var client = this;
  var nano = client.globals.getNanoInstance();

  var database = nano.use(databaseName);
    // and insert a document in it
  database.insert({ dummyKey: "testingValue" }, documentName, function(err, body, header) {
    if (err) {
      console.log('Error in nano CreateDocument Function: '+documentName+',in database: '+databaseName, err.message);
      return client;
    }
    console.log('nano created a doc: '+documentName+', in database: '+databaseName);
  });

  client.pause(10)
  return this; // allows the command to be chained.
};