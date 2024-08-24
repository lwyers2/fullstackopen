//TODO add comments as I've made this a little more confusing than it should be 

import {useState, useEffect} from 'react'
import './App.css'

const Number = (props) => {
  return (
    <li>{props.name} {props.number}</li>
  )
}

const Errors = (props) => {
  return (
    <li>{props.error}</li>
  )
}

const App = () => {
  const [persons, setPersons] = useState([
    {name: 'Arto Hellas',
    number: '040-1234567'
    }
  ])
  const [newName, setNewName] = useState('')
  const [searchName, setsearchName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [errors, setErrors] = useState([])

  const addError = (errorMessage) => {
    setErrors((prevErrors) => [...prevErrors, errorMessage])
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const validateName = () => {
    let isValid = true
    if(persons.map(person => person.name).includes(newName)) {
      addError(`${newName} is already added to the phonebook`)
      isValid = false
    } else if (newName.length===0) {
      addError(`Name is not populated`)
      isValid = false
    }
    return isValid 
  }

  const validateNumber = () => {
    let isValid = true
    if(newNumber.length===0) {
      addError(`Number is not populated`)
      isValid = false
    } else if (!validNumber(newNumber)) {
      addError(`${newNumber} is not a valid number`)
      isValid = false
    } else if ((persons.map(person => person.number).includes(newNumber))) {
      addError(`${newNumber} already exists in phonebook`)
      isValid = false
    }
    return isValid
  }

  
  const validNumber = (numberString) => {
    let valid = true
    for(const c of numberString) {
      if ((!(c >= '0' && c<='9')) || (!c === '-') ){
        valid = false;
      }
    }
    return valid
  }



  const addNameAndNumber = (event) => {
    event.preventDefault()
    setErrors([])
    const nameObject = {
      name: newName,
      number: newNumber
    }
    const isValidName = validateName()
    const isValidNumber = validateNumber()


    if(isValidName && isValidNumber) {
    setPersons(persons.concat(nameObject)) 
    setNewName('')
    setNewNumber('')
    } 
  }

  useEffect(() => {
    if (errors.length > 0) {
      const errorsString = errors.join('\n'); // Join errors with newline characters
      window.alert(errorsString); // Display errors in an alert box
    }
  }, [errors]); // Runs whenever the `errors` array is updated


  const handleSearch =() => {

  }

  return (
    <div>
      <h2>Phonebook</h2>
      <form >
        filter shown with <input
        value={searchName}
        onChange={handleSearch}/>
      </form>
      <h2>add a new</h2>
      <form onSubmit={addNameAndNumber}>
        <div>
          name: <input
          value={newName}
          onChange={handleNameChange} />
        </div>
        <div>
          number: <input
          value={newNumber}
          onChange={handleNumberChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <div>
      <ul>
      {persons.map(person =>
        <Number key={person.name} name={person.name} number={person.number}/>
      )}
      </ul>
      <div>
        <h2>Errors</h2>
        <ul>
          {errors.map(error =>
            <Errors  error={error}/>
          )}
        </ul>
      </div>
      </div> 
    </div>
  )
}

export default App

