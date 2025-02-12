const express = require('express')
const console = require('console')

const Piscina = require('piscina') 

const piscina = new Piscina({
  filename: './worker.js',
  minThreads: 4,
  maxThreads: 4
})

//Tweak this to change how easily spotted the long operation is going to be.
//When set to 100 it should be the only visible operation
const HOW_OBVIOUS_THE_FLAME_GRAPH_SHOULD_BE_ON_SCALE_1_TO_100 = 1

const app = express()

app.get('/', (req, res) => {
  res.send(`
    <h2>Take a look at the network tab in devtools</h2>
    <script>
        function loops(func) {
          return func().then(_ => setTimeout(loops, 20, func))
        }

        loops(_ => fetch('api/tick'))
    </script>
    `)
})

app.get('/api/tick', (req, res) => {
  Promise.resolve('asynchronous flow will make our stacktrace more realistic'.repeat(HOW_OBVIOUS_THE_FLAME_GRAPH_SHOULD_BE_ON_SCALE_1_TO_100))
  .then(text => {
    const randomText = Math.random().toString(32).repeat(HOW_OBVIOUS_THE_FLAME_GRAPH_SHOULD_BE_ON_SCALE_1_TO_100)
    return piscina.run({ text, randomText })
  })
  .then(result => res.end(`result: ${result}`))
  .catch(err => { throw new Error(err) })
})

app.get('/api/end', () => process.exit())

app.listen(8081, () => {
  console.log(`go to http://localhost:8081/ to generate traffic`)
})
