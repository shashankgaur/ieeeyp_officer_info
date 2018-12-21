var request = require('request');
var fs = require('fs');

//getting the json data from the api
function getRegionalYPofficer(accessToken, geocode){
  var filename = __dirname+'/data/AFFN/YP_AFFN/YP'+geocode+'_AFFN.json';
  request({
      headers: {
        'Authorization': 'Bearer ' + accessToken,
        'Content-Type': 'application/json'
      },
      uri: 'https://services15.ieee.org/RST/yp/affnoff',
      body: '{ "AFFN": "YP'+geocode+'*" }',
      method: 'POST'
    }, function (err, res, body) {
      var json = JSON.parse(res.body);
    }).pipe(fs.createWriteStream(filename));
}

//requesting the access token
function getAccessToken(geocode){
    request({
      url: 'https://services15.ieee.org/RST/api/oauth/token',
      method: 'POST',
      form: {
        'client_id': '3884c5f8-af59-4dbf-9464-6ff7b88fe733',
        'client_secret': '0156cc96-656a-4c25-b811-739bc27e58d2',
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
