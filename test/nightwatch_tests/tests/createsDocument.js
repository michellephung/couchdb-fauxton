module.exports = {
    'Creates a document' : function(client){
        var waitTime = 10000,
        timestamp = client.globals.getTimestamp(),
        newDatabaseName = 'create_doc_db'+ timestamp,
        newDocumentName = 'create_doc_doc'+ timestamp;

        client
            .loginToGUI()
            .createDatabase(newDatabaseName)
            .url('http://localhost:8000/#/database/'+newDatabaseName+'/_all_docs')
            .waitForElementPresent('#new-all-docs-button', waitTime)
            .click('#new-all-docs-button')
            .waitForElementPresent('#new-all-docs-button a[href="#/database/'+newDatabaseName+'/new"]', waitTime)
            .click('#new-all-docs-button a[href="#/database/'+newDatabaseName+'/new"]') 
            .waitForElementPresent('#doc', waitTime)
            .verify.urlEquals('http://localhost:8000/#/database/'+ newDatabaseName+'/new')
            .execute('\
                var editor = ace.edit("editor-container");\
                editor.gotoLine(2,10);\
                editor.removeWordRight();\
                editor.insert("'+newDocumentName+'");\
            ')
            .waitForElementPresent('#doc button.save-doc.btn.btn-success.save', waitTime)
            .click('#doc button.save-doc.btn.btn-success.save')
            .url('http://localhost:8000/'+newDatabaseName+'/_all_docs')
            .waitForElementPresent('body', waitTime)
            .getText("body",function(result){
                var data = result.value,
                createdDocIsPresent = data.indexOf(newDocumentName);
             
                this.assert.ok(createdDocIsPresent > 0, 
                    'Checking if new document shows up in _all_docs.');
            })
            .deleteDatabase(newDatabaseName)
        .end();
  }
}