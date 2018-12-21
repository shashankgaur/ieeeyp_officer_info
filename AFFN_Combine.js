const fs = require('fs');
var completeData = [];
var i;
var date = new Date(Date.now()).toLocaleString('pt-PT');
fs.appendFile(__dirname+'/data/AFFN/AFFN_log.txt',"Combining all the data at "+date+" \n", (err) => { if (err) throw err;});
for (var i=0; i<10; i++){
  rawData = fs.readFileSync(__dirname+'/data/AFFN/YP_AFFN/YP'+i+'_AFFN.json');
  partialData = JSON.parse(rawData).OU;
  var logdata = "There are "+partialData.length+" YP units starting with code YP"+i+"******"+" \n";
  fs.appendFile(__dirname+'/data/AFFN/AFFN_log.txt',logdata, (err) => { if (err) throw err;});
  //console.log("YP units with "+i+" code", partialData.length);
  for (var j=0; j<partialData.length; j++){
    if (partialData[j] != null) {
        completeData.push(partialData[j]);
    }
  }
}
for (var i=0; i<10; i++){
  rawData = fs.readFileSync(__dirname+'/data/AFFN/GD_AFFN/GD'+i+'_AFFN.json');
  partialData = JSON.parse(rawData).OU;
  var logdata = "There are "+partialData.length+" GD units starting with code GD"+i+"******"+" \n";
  fs.appendFile(__dirname+'/data/AFFN/AFFN_log.txt',logdata, (err) => { if (err) throw err;});
  //console.log("GD units with "+i+" code", partialData.length);
  for (var j=0; j<partialData.length; j++){
    if (partialData[j] != null) {
        completeData.push(partialData[j]);
    }
  }
}
fs.appendFile(__dirname+'/data/AFFN/AFFN_log.txt',"Total AFFN units are "+completeData.length, (err) => { if (err) throw err;});
fs.writeFileSync(__dirname+'/data/AFFN/AFFN.json', JSON.stringify({"OU" : completeData}));
