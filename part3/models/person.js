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
            minLength: [3, `Path \`name\` (\`{VALUE}\`)is shorter than the minimum allowed length (3)`],
            required: [true, `Path \`name\` (\`\`)should be populated, please valid name`] 
        },
        number: {
            type: String,
            minlength: [8, `Path \`number\` (\`{VALUE}\`) is shorter than the minimum allowed length (8)`],
            validate: {
                validator: function(v) {
                    return /^\d{2,3}-\d+$/.test(v);
                },
                message: props => `Path \`number\` (\`${props.value}\`) is not a valid number`
            },
            required: [true, `Path \`number\` (\`\`)should be populated, please enter valid number`]
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