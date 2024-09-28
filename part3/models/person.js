const mongoose = require('mongoose')
mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log(`connectiong to ${url}`)


mongoose.connect(url)
    .then(result => {
        console.log('connecting to MongoDB');
    })
    .catch(error => {
        console.log('error connecting to MongoDB', error.message);
        
    })

const personSchema = new mongoose.Schema({
        name: {
            type: String,
            minLength: [3, `Path \`name\` (\`{VALUE}\`)is shorter than the minimum allowed length(3)`],
            required: true
        },
        number: {
            type: String,
            required: true
        }
        })

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)