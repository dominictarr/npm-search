
var levelup   = require('levelup')
var MapReduce = require('map-reduce')
var log       = require('./log')


module.exports = function (cb) {

  var db = levelup(process.env.HOME + '/.npm-search',
  {createIfMissing: true}, cb || function () {})
  MapReduce(db)

  db.mapReduce.add({
    name: 'keyword',
    map: function (key, val, emit) {
      log('map:'+ key)
      var pkg = JSON.parse(val)
      var readme = pkg
      var words = {}
      function split (ary) {
        if(!ary) return
        if('string' == typeof ary)
          ary = ary.split(/\W+/).filter(function (e) {
            return !!e
          })

        ary.forEach(function (w) {
          w = w.toUpperCase()
          words[w] = (words[w] || 0) + 1 
        })
        for(word in words) {
          emit([''+word], JSON.stringify([pkg.name]))
        }
      }
      split(pkg.description)
      split(pkg.keywords)
      split(pkg.readme)
      split(pkg.name)

    }, reduce: function (acc, item, key) {
      //console.log('REDUCE', acc, item)
      var acc  = JSON.parse(acc)
      var item = JSON.parse(item)
      var a = []
      acc.concat(item).forEach(function (e) {
        if(!~a.indexOf(e))
          a.push(e)
      })
      log(key)
      return JSON.stringify(a.sort())
    },
    initial: '[]'
  })

  return db

}
