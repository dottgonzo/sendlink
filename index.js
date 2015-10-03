var timerdaemon=require('timerdaemon'),
verb=require('verbo'),
PouchDB=require('pouchdb');

module.exports = function(url,time) {
if(!time){
  time=300000;//5 minuti
}
  timerdaemon.pre(time,function(){
    var remoteDB=PouchDB(url);
        remoteDB.get('linkstatus').then(function(doc){
          doc.connectedAt=new Date().getTime();
        doc.dbtype="linkstatus";
          remoteDB.put(doc);
          verb("new document","info","updating the state");
        }).catch(function(err){
          console.log(err);
          if (err.status==404) {
            verb("new document","warn","Getting document");
            remoteDB.put({_id:"linkstatus",dbtype:"linkstatus","updatedAt":new Date().getTime()})
          } else{
            verb("can't get the document","error","Getting document");
          }
        })

  })

  }