define([
    'intern!object',
    'intern/chai!assert',
    'require',
    'helpers',
    'intern/dojo/node!nano'
], function (registerSuite, assert, require, helpers, nano) {

    registerSuite({
        name: 'Creates a Database',
        'Creates a Database': function(){
        	
            var newDatabase = Helper.getNewDatabaseName();

            return this.remote
                .get(require.toUrl('http://localhost:8000'))
                .setFindTimeout(5000)
                .findById('new')
                    .click()
                    .typeInPrompt(newDatabase)
                    .acceptAlert()
                    .end()
                .findByCssSelector('#header-breadcrumbs li.active')
                .getVisibleText()
                .then(function(text){
                	assert.strictEqual(text, newDatabase, 
                		"creating a new database takes you to newly created database page")
                })
                .end()
                .get('http://localhost:8000/_all_dbs')
                .findByCssSelector("body")
                .getVisibleText()
                .then(function(text){
                	assert.include(text, newDatabase,
                		'database doesn\'t show up in _all_dbs');
                })

        },
        'after' : function(){
           Helper.deleteDatabase(Helper.databaseName, nano);
        }

    });
});