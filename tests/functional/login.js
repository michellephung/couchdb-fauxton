define([
    'intern!object',
    'intern/chai!assert',
    'require',
    'helpers',
    'intern/dojo/node!leadfoot/Command'
], function (registerSuite, assert, require, helpers, Command) {

    registerSuite({
        name: 'Log In',
        'Logs In': function(){

             return this.remote
                .get('http://localhost:8000')
                .setFindTimeout(5000)
                .findByCssSelector('#bottom-nav-links a[href="#login"]')
                    .click()
                .getCurrentUrl()
                .then(function(text){
                    assert.strictEqual(text, "http://localhost:8000/#login",
                        "redirected to login page")
                })
                .end()
                .findByCssSelector('#username')
                    .type('tester')
                    .end()
                .findByCssSelector('#password')
                    .type('testerpass')
                    .end()
                .findByCssSelector('button#submit')
                    .click()
        }
    });
});