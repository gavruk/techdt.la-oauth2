/**
 * Created by timfulmer on 7/4/15.
 */
function loadCollection(options){
  options=options || {};
  options.orm.loadCollection(
    options.waterline.Collection.extend(
      {
        identity: 'accessToken',
        connection: 'mongo',
        attributes: {
          token:{type:'string',required:true},
          expirationDate:{type:'date',required:true},
          userId:{type:'string',required:true},
          clientId:{type:'string',required:true}
        }
      }
    )
  );
}

module.exports={
  loadCollection:loadCollection
};