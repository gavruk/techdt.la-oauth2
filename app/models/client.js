/**
 * Created by timfulmer on 7/4/15.
 */
function loadCollection(options){
  options=options || {};
  options.orm.loadCollection(
    options.waterline.Collection.extend(
      {
        identity: 'client',
        connection: 'localhostMongo',
        attributes: {
          name:{type:'string',required:true},
          clientId:{type:'string',required:true},
          clientSecret:{type:'string',required:true}
        }
      }
    )
  );
}

module.exports={
  loadCollection:loadCollection
};