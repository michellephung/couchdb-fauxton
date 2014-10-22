module.exports = {

	'Deletes a document': function(client){
		var waitTime = 10000,
        	timestamp = client.globals.getTimestamp(),
        	newDatabaseName = 'delete_doc_db'+ timestamp,
        	newDocumentName = 'delete_doc_doc'+ timestamp;
    client
    	.createDatabase(newDatabaseName)
    	.createDocument(newDocumentName, newDatabaseName)
		.url('http://localhost:8000')
		.waitForElementPresent('#dashboard-content a[href="#/database/'+newDatabaseName+'/_all_docs"]', waitTime)
        .pause(1000)
		.click('#dashboard-content a[href="#/database/'+newDatabaseName+'/_all_docs"]')
		.waitForElementPresent('#dashboard-lower-content .btn.btn-small.btn-danger.delete', waitTime)
        .execute('$("#dashboard-lower-content .btn.btn-small.btn-danger.delete").click();')
		.acceptAlert()
		.url('http://localhost:8000/'+newDatabaseName+'/_all_docs')
		.waitForElementPresent('pre', waitTime)
		.getText("pre",function(result){
                
                var data = result.value,
                    createdDocumentNotPresent = data.indexOf(newDocumentName);
                this.assert.ok(createdDocumentNotPresent === -1, 
                    'Checking if new document no longer shows up in _all_docs.');
        })
        .deleteDatabase(newDatabaseName)
		.end();
  }
}