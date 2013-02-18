console.log(Date.now())
var db = require('./db')(function (err) {
  console.log(Date.now())
 
  var name = process.argv[2]
  console.log(name)

  db.readStream({start: name, end: name+'~' /*, values: false*/})
    .on('data', function (d) { console.log(d.key)})
    .on('end', function () {
      console.log(Date.now())

    })
})
