const express = require('express')
const app = express()
require('dotenv').config()
const Person = require('./models/person')
app.use(express.json())
const morgan = require('morgan')





app.use(express.static('dist'))
app.use(express.json())

const captureResponseBody = (req, res, next) => {
    const originalSend = res.send

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

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if(error.name === 'CastError') {
        return response.status(400).send({error: 'malformed id'})
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({error:error.message})
    }
    next(error)
}

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
  })

app.get('/info', (request, response) => {
    Person.find({}).then(persons => {
    const responseDate = new Date()
    response.send(`<p>Phonebook has info for ${persons.length} people <br/> ${responseDate}</p>`)
    })
})

//For exercise 2.18
app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
    .then(note => {
        response.json(note)
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id' , (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
    .then(result => {
        response.status(204).end()
    })
    .catch(error => next(error))
})


app.post('/api/persons', (request, response, next) => {
    const number = request.body.number
    const name = request.body.name

    // Check if the name already exists
    Person.findOne({ name: name })
        .then(existingPerson => {
            if (existingPerson) {
                // If a person with the same name exists, respond with a conflict status
                // Here, you can return the existing person's details to handle it in the frontend
                return response.status(409).json({ 
                    message: `Name '${name}' already exists in the phonebook. Do you want to update the number?`, 
                    existingPerson 
                })
            }

            // If no existing person, create a new person
            const person = new Person({
                name: name,
                number: number
            })

            // Save the new person
            return person.save()
        })
        .then(savedPerson => {
            response.status(201).json(savedPerson) // Return created person with 201 status
        })
        .catch(error => next(error))
})

// PUT endpoint to update person's number
app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body

    const person = {
        name: body.name, 
        number: body.number
    }

    // Update the existing person's number
    Person.findByIdAndUpdate(request.params.id, person, { new: true, runValidators: true })
        .then(updatedPerson => {
            if (updatedPerson) {
                response.json(updatedPerson)
            } else {
                // If no person found with that ID
                return response.status(404).send({ error: 'Person not found' })
            }
        })
        .catch(error => next(error))
})




app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {

console.log(`Server running on port ${PORT}`)

})

app.use(errorHandler)