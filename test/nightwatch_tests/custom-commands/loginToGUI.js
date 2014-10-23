exports.command = function(){
	
	var client = this;

	client
        .url('http://localhost:8000/#login')
        .waitForElementPresent('#login', 8000)
        .setValue('#username', ['tester'])
        .setValue('#password', ['testerpass', client.Keys.ENTER])
        .execute('$("#global-notifications button.close").click()');

    return this;
}