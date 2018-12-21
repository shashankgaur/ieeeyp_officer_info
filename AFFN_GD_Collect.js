var request = require('request');
var fs = require('fs');

//getting the json data from the api
function getRegionalYPofficer(accessToken, geocode){
  var filename = __dirname+'/data/AFFN/GD_AFFN/GD'+geocode+'_AFFN.json';
  request({
      headers: {
        'Authorization': 'Bearer ' + accessToken,
        'Content-Type': 'application/json'
      },
      uri: 'https://services.ieee.org/RST/yp/affnoff',
      body: '{ "AFFN": "GD'+geocode+'*" }',
      method: 'POST'
    }, function (err, res, body) {
      var json = JSON.parse(res.body);
    }).pipe(fs.createWriteStream(filename));
}

//requesting the access token
function getAccessToken(geocode){
    request({
      url: 'https://services.ieee.org/RST/api/oauth/token',
      method: 'POST',
      form: {
        'client_id': '0000000',
        'client_secret': '00000',
        'grant_type': 'client_credentials',
        'scope': 'YP_GetOfficers'
      }
    }, function(err, res) {
      var json = JSON.parse(res.body);
      //console.log("Access Token:", json.access_token);
      getRegionalYPofficer(json.access_token, geocode);
    });
}

for (var geocode=0; geocode<10; geocode++) {
  getAccessToken(geocode);
}
