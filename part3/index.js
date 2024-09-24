const express = require('express')
const app = express()
app.use(express.json())
const morgan = require('morgan')

let persons = 
[
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    },
    {
        "id": "5",
        "name": "Michael Johnstone", 
        "number": "59865515"
    }
]

app.use(express.static('dist'))
app.use(express.json())

const captureResponseBody = (req, res, next) => {
    const originalSend = res.send;

    res.send = function (body) {
        res.locals.responseBody = body
        originalSend.call(this, body)
    }

    next()
}

app.use(captureResponseBody)

app.use(morgan(
    function (tokens, req, res) {
        let responseBody = res.locals.responseBody

        try{
            responseBody = JSON.stringify(JSON.parse(responseBody))
        } catch (e) {
            responseBody = responseBody || 'No body/Non-JSON response'
        }


        return[
            tokens.method(req, res),
            tokens.url(req, res), 
            tokens.status(req, res),
            tokens.res(req, res, 'content-length'),
            String('-'),
            tokens['response-time'](req, res), 'ms',
            responseBody
        ].join(' ')
    }
))

const cors = require('cors')

app.use(cors())

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }

app.get('/api/persons', (request, response) => {
    response.json(persons)
  })

app.get('/info', (request, response) => {
    const responseDate = new Date()
    response.send(`<p>Phonebook has info for ${persons.length} people <br/> ${responseDate}</p>`)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)

    if(person) {
        response.json(person)
    } else {
        response.sendStatus(404).end()
    }
    response.json(person)
})

app.delete('/api/persons/:id' , (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

const generateId = () => {
   
    Id = Math.floor(Math.random() * 3650000)

    return String(Id)
  }

app.post('/api/persons', (request, response) => {

    const number = request.body.number
    const name = request.body.name

    
    if(!number) {
        return response.status(400).json({
            error: 'number missing'
        })
    }

    if(!name) {
        return response.status(400).json({
            error: 'name missing'
        })
    }

    if(persons.find(person => person.name === name)) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }
    
    const person = {
        id: generateId(),
        name: name,
        number: number
    }

    persons = persons.concat(person)
    response.json(person)
    
})

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {

console.log(`Server running on port ${PORT}`)

})