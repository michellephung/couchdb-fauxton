define([
    'intern!object',
    'intern/chai!assert',
    'require',
    'helpers',
    'intern/dojo/node!nano'
], function (registerSuite, assert, require, helpers, nano) {

    registerSuite({
        name: 'Creates a Document',
        'Creates a Document': function (){
           
            var newDatabase = Helper.getNewDatabaseName();
            Helper.createDatabase(newDatabase,nano);

            return this.remote
                .get('http://localhost:8000')
                .setFindTimeout(5000)
                .closeCurrentWindow();  
        },
        'after':function (){
            Helper.deleteDatabase(Helper.databaseName,nano);
        }
    });
});