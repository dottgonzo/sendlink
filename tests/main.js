var sendlink=require('../index.js'),
verb=require('verbo'),
PouchDB=require('pouchdb'),
timerdaemon=require('timerdaemon'),
testdb='dbtest';

sendlink(testdb,{time:5000,over:{_id:"sss"}});

timerdaemon.pre(5000,function(){

  PouchDB(testdb).allDocs({include_docs:true}).then(function(docs){
    verb(JSON.stringify(docs))
  })

})
