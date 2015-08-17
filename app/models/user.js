/**
 * Created by timfulmer on 7/4/15.
 */
function loadCollection(options){
  options=options || {};
  options.orm.loadCollection(
    options.waterline.Collection.extend(
      {
        identity: 'user',
        connection: 'localhostMongo',
        attributes: {
          username:{type:'string',required:true},
          password:{type:'string',required:true}
        }
      }
    )
  );
}

module.exports={
  loadCollection:loadCollection
};