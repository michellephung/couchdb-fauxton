var Helper= {
	getNewDatabaseName: function(){
		
		this.databaseName = 'db'+this.getTimeStamp();
		return this.databaseName;
	},
	getNewDocumentName: function(){
		
		this.documentName = 'doc'+this.getTimeStamp();
		return this.documentName;
	},
	getTimeStamp: function(){
		
		var time = new Date(),
     	timestamp = "(date"+time.getDate()+
        			"-"+(time.getMonth()+1)+
        			"-"+time.getFullYear()+
        			")(time"+time.getHours()+
        			"-"+time.getMinutes()+
        			"-"+time.getMilliseconds()+")";

		return timestamp;

	},
	createDatabase: function(databaseName, nano){
		
		var nano1 = this.getNanoInstance(nano);

	    nano1.db.create(databaseName, function(err, body, header) {
	      if(err){
	        console.log('Error in nano CreateDatabase Function: '+ databaseName, err.message);
	        return;
	      }
	      console.log("nano created a database "+databaseName + body);
	    });

	},
	databaseName : 'this will be overwritten each test by getNewDatabaseName()',
	documentName : 'this will be overwritten each test by getNewDocumentName()',
	deleteDatabase: function(databaseName, nano){

		var nano1 = this.getNanoInstance(nano);
		
		nano1.db.destroy(databaseName, function(err, body, header) {
			if(err){
				console.log('in nano DeleteDatabase Function '+databaseName, err.message);
				return this;
			}
			console.log('nano cleaned up: '+ databaseName+' is deleted: ', body);
    	});

	},
	username : 'tester',
	password : 'testerpass',
	getNanoInstance : function(nano){
    	
		var nano1 = nano('http://'+this.username+':'+this.password+'@localhost:5984');
		return nano1;
	}
}