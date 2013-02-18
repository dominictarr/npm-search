
var fs         = require('fs')
var JSONStream = require('JSONStream')
var through    = require('through')
var from       = require('from')
var log        = require('./log')

//TODO conver semvers so that they are lexiographically sortable.
function lexiographize (semver) {

}

require('levelup')(process.env.HOME+'/.npm-index', function (err, db) {

  if(err) throw err

  var words = {}

  fs.createReadStream('./npm.json')
    .pipe(JSONStream.parse(['rows', true, 'doc']))
    .on('data', function (d) {
//      log(d.name+'@'+d.version)
    })
    .pipe(through(function (data) { 
      var name = data.name, added = {}
      function split (ary) {
        if(!ary) return
        if('string' == typeof ary)
          ary = ary.split(/[\W\d]+/).filter(function (e) {
            return !!e
          })
        if(!ary.forEach) return
        ary.forEach(function (w) {
          w = w.toUpperCase()
          words[w] = words[w] || {}
          words[w][name] = (words[w][name] || 0) + 1
          added[w] = 1
        })
        /*for(word in words) {
          emit([''+word], JSON.stringify([pkg.name]))
        }*/
         
      }

      split(data.name)
      split(data.keywords)
      split(data.description)
      split(data.readme)
//      console.log(data.readme)
      if(Math.random() < 0.01)
        console.log(name, '->', Object.keys(added))

      //})
    })).on('end', function () {
//      console.log(words)
      from(Object.keys(words).sort())
        .pipe(through(function (key) {
          if(Math.random() < 0.01)
            console.log(key, words[key])
          this.queue({key: key, value: JSON.stringify(words[key])})
        }))
        .on('error', function () {
          console.log('done')
        })

        //.pipe(fs.createWriteStream(__dirname+'/inverted-index.json'))
        .pipe(db.writeStream())
      //, JSON.stringify(words))
    })
    
//    .pipe(db.writeStream())
})

