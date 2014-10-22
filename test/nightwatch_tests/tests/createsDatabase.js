
module.exports = {
    'Creates a Database' : function(client) {
        var waitTime = 8000;
        var newDatabaseName = 'create_db'+ client.globals.getTimestamp();

        client
            .url('http://localhost:8000')
            .waitForElementPresent('#new', waitTime)
            .click('#new')
            .pause(1000)
            .setAlertText(newDatabaseName)
            .acceptAlert()
            .pause(1000)
            .url('http://localhost:8000/_all_dbs')
            .getText("html",function(result){
                
                var data = result.value,
                    createdDatabaseIsPresent = data.indexOf(newDatabaseName);
               
                this.assert.ok(createdDatabaseIsPresent > 0, 
                    'Checking if new database shows up in _all_dbs.');
            })
            .deleteDatabase(newDatabaseName)
            .end();
    }
};
