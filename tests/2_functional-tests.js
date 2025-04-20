const chai = require('chai');
const assert = chai.assert;

const server = require('../server');

const chaiHttp = require('chai-http');
chai.use(chaiHttp);

suite('Functional Tests', function () {
  this.timeout(5000);
  suite('Integration tests with chai-http', function () {
    // #1
    test('Test GET /hello with no name', function (done) {
      chai
        .request(server)
        .keepOpen()
        .get('/hello')
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'hello Guest');
          done();
        });
    });

  // Within tests/2_functional-tests.js, alter the 'Test GET /hello with no name' test (// #1) 
  // to assert the status and the text of the response to make the test pass. 
  // Do not alter the arguments passed to the asserts.
  // There should be no URL query. Without a name URL query, the endpoint responds with hello Guest.
  
    // suite('GET /hello?name=[name] => "hello [name]"', function () {
    //   test('?name=John', function (done) {
    //     chai
    //       .request(server)
    //       .keepOpen()
    //       .get('/hello?name=John')
    //       .end(function (err, res) {
    //         assert.equal(res.status, 200, 'Response status should be 200');
    //         assert.equal(res.text, 'hello John', 'Response should be "hello John"');
    //         done();
    //       });
    //   });
    // });


    // #2
    test('Test GET /hello with your name', function (done) {
      chai
        .request(server)
        .keepOpen()
        .get('/hello?name=xy_z')
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'hello xy_z');
          done();
        });
    });
    // #3
    test('Send {surname: "Colombo"}', function (done) {
      chai
        .request(server)
        .keepOpen()
        .put('/travellers')
        .send({
          "surname": "Colombo"
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.equal(res.body.name, 'Cristoforo');
          assert.equal(res.body.surname, 'Colombo');
          // assert.fail();

          done();
        });
    });
    // #4
    test('Send {surname: "da Verrazzano"}', function (done) {
      chai
        .request(server)
        .keepOpen()
        .put('/travellers')
        .send({
          'surname': "da Verrazzano"
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.equal(res.body.name, 'Giovanni');
          assert.equal(res.body.surname, 'da Verrazzano')
        })
      // assert.fail();

      done();
    });
  });
});

const Browser = require('zombie');
Browser.site = 'http://0.0.0.0:3000';
suite('Functional Tests with Zombie.js', function () {
  this.timeout(5000);
  const browser = new Browser();
  suiteSetup(function(done) {
      return browser.visit('/', done);
    });
  suite('Headless browser', function () {
    test('should have a working "site" property', function() {
      assert.isNotNull(browser.site);
    });
  });

  suite('"Famous Italian Explorers" form', function () {
    // #5
    test('Submit the surname "Colombo" in the HTML form', async function () {
      await browser.fill('input[name="surname"]', 'Colombo');
      await browser.pressButton('submit');
      browser.assert.success();
      browser.assert.text('span#name', 'Cristoforo');
      browser.assert.text('span#surname', 'Colombo');
      browser.assert.elements('span#dates', 1);
    });
  
    // #6
    test('Submit the surname "Vespucci" in the HTML form', async function () {
      await browser.fill('input[name="surname"]', 'Vespucci');
      await browser.pressButton('submit');
      browser.assert.success();
      browser.assert.text('span#name', 'Amerigo');
      browser.assert.text('span#surname', 'Vespucci');
      browser.assert.elements('span#dates', 1);
    });
  });  

});
