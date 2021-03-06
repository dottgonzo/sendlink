var timerdaemon=require('timerdaemon'),
verb=require('verbo'),
PouchDB=require('pouchdb'),
diff=require('deep-diff');


function overr(data,overrides){
  diff.observableDiff(data, overrides, function (d) {
      // Apply all changes except those to the 'name' property...
      if (d.kind != 'D') {
          diff.applyChange(data, overrides, d);
      }
  });
}


module.exports = function(url,json) {



if(!json||!json.time){
  time=300000;//5 minuti
} else{
  time=json.time;//5 minuti
}


  timerdaemon.pre(time,function(){

    if(json&&json.over){
      over=json.over;
    } else{
      over={};
    }

    if(!over._id){
      over._id="linkstatus";
    }


    var remoteDB=PouchDB(url);


        remoteDB.get(over._id).then(function(doc){
          overr(doc,over);
          doc.updatedAt=new Date().getTime();
          remoteDB.put(doc).then(function(){
            verb("update","info","Sendlink");
          }).catch(function(err){
            verb(err,"error","Sendlink")

          });
        }).catch(function(err){

          if (err.status==404) {
            over.updatedAt=new Date().getTime();
            remoteDB.put(over).then(function(){
              verb("update","info","Sendlink");
            }).catch(function(err){
              verb(err,"error","Sendlink")

            })
          } else{
            verb("can't get the remote db","error","Sendlink");
          }
        })

  })

  }
