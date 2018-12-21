const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
var request = require('request');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const TOKEN_PATH = __dirname+'/token.json';

// Load client secrets from a local file.
fs.readFile(__dirname+'/credentials.json', (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
  // Authorize a client with credentials, then call the Google Sheets API.
  authorize(JSON.parse(content), writetosheets);
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error while trying to retrieve access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

/**
  Writes to the spreadsheet for REGION Coordinators
 */
function writetosheets(auth) {
  rawData = fs.readFileSync(__dirname+'/data/REGN/YP_REGN.json');
  jsonData = JSON.parse(rawData);
  data = jsonData.OU;
  var values = [
      ["Region Code", "Region Name", "Name", "Email"]
    ];
  var missingvalues = [
      ["Region Code", "Region Name"]
    ];
  for(var i = 0; i < data.length; i++) {
      var obj = data[i].Designations;
      if (obj != null) {
        var OfficerOUCode = obj.Designation[0].Officers[0].Officer[0].OrganizationCode;
        if (OfficerOUCode == "R0") {
          OfficerOUCode = "R10";
        }
        var OfficerOUName = obj.Designation[0].Officers[0].Officer[0].OrganizationName;
        var OfficerName = obj.Designation[0].Officers[0].Officer[0].FirstName+" "+obj.Designation[0].Officers[0].Officer[0].LastName;
        var OfficerEmail = obj.Designation[0].Officers[0].Officer[0].Email;
        var newOfficer = [OfficerOUCode, OfficerOUName, OfficerName, OfficerEmail];
        values.push(newOfficer);
      } else {
        var OfficerOUCode = data[i].OrganizationCode;
        var OfficerOUName = data[i].OrganizationName;
        var missingOfficer = [OfficerOUCode, OfficerOUName];
        missingvalues.push(missingOfficer);
      }
  }
  var lastrow = values.length;
  const sheets = google.sheets({version: 'v4', auth});
  sheets.spreadsheets.values.update({
    auth : auth,
    //sheetID of 2018 Regional Coordinators in IEEE Young Professionals > Website - Dinko & Shashank > YP Website - Officers nfo
    spreadsheetId: '......',
    range: 'Automated!A1:D', //Change Automated if your worksheet's name is something else
    valueInputOption: "USER_ENTERED",
    resource: {
      values: values
    }
  }, (err, response) => {
    if (err) {
      console.log('The API returned an error: ' + err);
      return;
    } else {
        console.log("Officer info updated");
    }
  });
  //updating the google sheet with affinity groups with missing information
  sheets.spreadsheets.values.update({
    auth : auth,
    //sheetID of Missing OU in Database in IEEE Young Professionals > Website - Dinko & Shashank > YP Website - Officers nfo
    spreadsheetId: '.....',
    range: 'Region!A1:D', //Change Region if your worksheet's name is something else
    valueInputOption: "USER_ENTERED",
    resource: {
      values: missingvalues
    }
  }, (err, response) => {
    if (err) {
      console.log('The API returned an error: ' + err);
      return;
    } else {
        console.log("Missing info updated");
    }
  });
}
