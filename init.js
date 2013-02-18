
var fs         = require('fs')
var JSONStream = require('JSONStream')
var through    = require('through')
var log        = require('./log')

//TODO conver semvers so that they are lexiographically sortable.
function lexiographize (semver) {

}

var db = require('./db')(function (err) {

  if(err) throw err

  fs.createReadStream('./npm.json')
    .pipe(JSONStream.parse(['rows', true, 'doc', 'versions', true]))
    .on('data', function (d) {
      log(d.name+'@'+d.version)
    })
    .pipe(through(function (data) { 
      this.queue({
        type: 'put',
        key: data.name + '!' + data.version,
        value: JSON.stringify({
          name:         data.name,
          version:      data.version,
          author:       data.author,
          repository:   data.repository,
          readme:       data.readme,
          description:  data.description,
          keywords:     data.keywords,
          licenses:     data.licenses,
          dist:         data.dist,
          homepage:     data.homepage,
          dependencies: data.dependencies,
          devDependencies: data.devDependencies
        })
      })
    }))
    .pipe(db.writeStream())
})
