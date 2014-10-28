/**
 * Sample automated test scenario for Fauxton
 *
 * it navigates to Fauxton 
 * - creates a database
 * - creates a doc in that database
 * - deletes the doc
 * - deletes the database
 * - creates a view
 * - queries a view   
 */

module.exports = {
  'Open Fauxton Page' : function (client) {
    this.waitTime = 8000;
    client
      .url('http://localhost:8000')
      .waitForElementPresent('body', this.waitTime);

  },
  'Creates a Database' : function(client) {
    this.time = new Date(),
    this.timestamp = "(date"+this.time.getDate()+
        "-"+(this.time.getMonth()+1)+
        "-"+this.time.getFullYear()+
        ")(time"+this.time.getHours()+
        "-"+this.time.getMinutes()+
        "-"+this.time.getMilliseconds()+")",
    this.newDatabaseName = "test"+this.timestamp;

    client
      .waitForElementPresent('#new', this.waitTime)
      .click('#new')
      .pause(1000)
      .setAlertText(this.newDatabaseName)
      .acceptAlert()
      .pause(1000)
      .verify.urlEquals('http://localhost:8000/#/database/'+this.newDatabaseName+'/_all_docs?limit=100');
      
  },
  'Creates a document' : function(client){
    client
      .waitForElementPresent('#new-all-docs-button',this.waitTime)
      .click('#new-all-docs-button')
      .waitForElementPresent('a[href="#/database/'+this.newDatabaseName+'/new"]',this.waitTime)
      .click('.dropdown.open a[href="#/database/'+this.newDatabaseName+'/new"]') //works in chrome
      //.click(' a[href="#/database/'+newDatabaseName+'/new"]') //works in firefox
      .waitForElementPresent('#doc',this.waitTime)
      .verify.urlEquals('http://localhost:8000/#/database/'+this.newDatabaseName+'/new')
      .click('button.save-doc.btn.btn-success.save')
      .waitForElementPresent('#doc button.cancel-button',this.waitTime)
      .click('#doc button.cancel-button')
      .waitForElementPresent('table.all-docs.table.table-striped.table-condensed',this.waitTime)
      .verify.elementPresent('tr');
  },
  'Deletes a document': function(client){
    client
      .waitForElementPresent('button.btn.btn-small.btn-danger.delete',this.waitTime)
      .execute("$('button.btn.btn-small.btn-danger.delete').click();")
      .acceptAlert()
      .waitForElementNotPresent("tr",this.waitTime);
  },
  'Deletes a database': function(client){
    client
      .execute('$("a.dropdown-toggle.icon.fonticon-cog").click();')
      .click("a.icon.fonticon-trash")
      .pause(1000)
      .verify.elementPresent("div.modal.hide.fade.in")
      .setValue("#db_name", this.newDatabaseName)
      .pause(1000)
      .click("#delete-db-btn")
      .pause(1000)
      .verify.elementNotPresent("a[href='#/database/"+this.newDatabaseName+"/_all_docs']")  
  },
  'Creates a Database and Populates For View': function(client){
    client.pause(5000); 
    this['Creates a Database'](client);
    
    var docEntry =  function(number){
      if(number%2 === 0) return '"test_key": "this id is EVEN"';
      else return '"test_key": "this id is ODD"';
    }

    for(var number=1; number<10; number++){
      client
      .waitForElementPresent('#new-all-docs-button',this.waitTime)
      .click('#new-all-docs-button')
      .waitForElementPresent('a[href="#/database/'+this.newDatabaseName+'/new"]',this.waitTime)
      .click('.dropdown.open a[href="#/database/'+this.newDatabaseName+'/new"]') //works in chrome
      .waitForElementPresent('#doc',this.waitTime)
      .execute('var editor = ace.edit("editor-container"); editor.getSession().setValue(\'{"_id": "'+number+'", '+docEntry(number)+'}\');')
      .click('button.save-doc.btn.btn-success.save')
      .pause(1000)
      .waitForElementPresent('#doc button.cancel-button',this.waitTime)
      .click('#doc button.cancel-button')
      .pause(1000)
    }
  },
  'Creates a View' : function(client){

      var indexFunctionString = function(parity)
      "function(doc) {                      \n\
          if(doc._id%2==="+parity+")        \n\
            emit(doc.test, doc);            \n\
      }"

      client
        .click("a.dropdown-toggle.icon.fonticon-plus-circled")
        
        .click(".dropdown.open a[href='#/database/"+this.newDatabaseName+"/new_view']")
        .pause(1000)
        .setValue("#new-ddoc","test_design_doc")
        .setValue("#index-name","evens")
        .execute('var editor = ace.edit("map-function"); editor.getSession().setValue("'+indexFunctionString(0)+'");')
        .click('button.btn.btn-success.save')

  },
  'Queries a view': function(client){
    client.end();
  }
};
