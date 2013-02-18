

module.exports = function (m) {
  if(Math.random() < 0.01)
    process.stdout.write((typeof m == 'string' ? m : JSON.stringify(m)) + '\n') 
}
