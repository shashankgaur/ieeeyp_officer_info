var request = require('request');
var fs = require('fs');

//getting the json data from the api
function getRegionalYPofficer(accessToken){
  request({
      headers: {
        'Authorization': 'Bearer ' + accessToken,
        'Content-Type': 'application/json'
      },
      uri: 'https://services13.ieee.org/RST/yp/regnoff',
      body: '{ "YP": "REGN" }',
      method: 'POST'
    }, function (err, res, body) {
      var json = JSON.parse(res.body);
    }).pipe(fs.createWriteStream(__dirname+'/data/REGN/YP_REGN.json'));
}

//requesting the access token
function getAccessToken(){
    request({
      url: 'https://services13.ieee.org/RST/api/oauth/token',
      method: 'POST',
      form: {
        'client_id': '00862c2c-ac96-4d5f-90fd-28ef981a18e4',
        'client_secret': '289fe917-d079-474f-91e2-20b1b980ecd1',
        'grant_type': 'client_credentials',
        'scope': 'YP_GetOfficers'
      }
    }, function(err, res) {
      var json = JSON.parse(res.body);
      //console.log("Access Token:", json.access_token);
      getRegionalYPofficer(json.access_token);
    });
}

getAccessToken();
