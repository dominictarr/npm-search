console.log(Date.now())
var db = require('./db')(function (err) {
  console.log(Date.now())
 
  var name = process.argv[2]

  console.log(name)

  db.mapReduce.view({name: 'keyword', 
    start: [name || true ], 
    end: [name+'ZZ' || true ], 
//    tail: false
  })
  .on('data', console.log)

})
