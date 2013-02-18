console.log(Date.now())
var db = require('./db')(function (err) {
  console.log(Date.now())
 
  var name = process.argv[2]
//  console.log(name)

  db.mapReduce.start('keyword')

})
