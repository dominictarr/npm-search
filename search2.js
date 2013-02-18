var fs = require('fs')
var split = require('split')
var through = require('through')
var http = require('http')
var opts = require('optimist').argv

require('levelup')(process.env.HOME + '/.npm-index', function (err, db) {
  if(err) throw err

  function search (query, cb) {

    var acc = null, n = 0

    /*var query = process.argv.slice(2)*/

    query.filter(function (e) {
      return !!e
    }).map(function (e) {
        return e.toUpperCase()
    }).forEach(function (e) {
      n ++

      var group = {}
    //if the search term ends in ~
      db.readStream({
        start: e.replace('~', ''), end: e
      })
      .pipe(through(function (data) {
  //      if(!group)
          group = or(group, JSON.parse(data.value), data.key.toString())
      }, function () {
        if(!acc) acc = group
        else acc = and(acc, group)
        if(--n) return
//        console.log(acc)
        cb(null, acc)
      }))
    })

    function or (acc, item, e) {
  /*    if(item === true)
        for(var k in item) {
          if(!Array.isArray(acc[k]))
            acc[k] = [[e, acc[k]]]
        }*/
  //    else
        for(var k in item) {
          if(acc[k])
            acc[k].push([e, item[k]])
          else
            acc[k] = [[e, item[k]]]
        }
      return acc
    }

    function and (acc, item) {
      var r = {}
      for(var k in acc) {
        if(item[k]) r[k] = acc[k].concat(item[k])
        if(item === true) r[k] = acc[k]
      }
      return r
    }
  }

if(opts.port || opts.server)
  http.createServer(function (req, res) {
    search(req.url.split('/'), function (err, results) {
      res.end(JSON.stringify(results) + '\n')
    })
  }).listen(opts.port || 6789)
else
  search(opts._, function (_, r) { console.log(r) })
})




