module.exports = {
    'Deletes a database': function(client){
        var waitTime = 8000;
        var newDatabaseName = 'delete_db'+ client.globals.getTimestamp();

        client
            .createDatabase(newDatabaseName)
            .loginToGUI()
            .url('http://localhost:8000/#/database/'+newDatabaseName+'/_all_docs')
            .waitForElementPresent('#dashboard .dropdown-toggle.icon.fonticon-cog', waitTime)
            .click('#dashboard .dropdown-toggle.icon.fonticon-cog')
            .waitForElementPresent('#dashboard .icon.fonticon-trash', waitTime)
            .click('#dashboard .icon.fonticon-trash')
            .click("input#db_name")
            .setValue("input#db_name", [newDatabaseName, client.Keys.ENTER] )
            .url('http://localhost:8000/_all_docs')
            .waitForElementPresent('html',waitTime)
            .getText("body",function(result){
                var data = result.value,
                    createdDatabaseIsNotPresent = data.indexOf(newDatabaseName);

                this.assert.ok(createdDatabaseIsNotPresent === -1, 
                    'Checking if new database no longer shows up in _all_dbs.');
            })
            .deleteDatabase(newDatabaseName) // clean datatbase in case of functional failure
        .end();

        }
}