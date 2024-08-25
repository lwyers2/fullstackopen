//Also adding useEffect to display errors when they occure
import {useState, useEffect} from 'react'
import axios from 'axios'
import './App.css'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Heading from './components/Heading'
import SubHeading from './components/SubHeading'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [searchName, setsearchName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [errors, setErrors] = useState([])
  const [showAll, setShowAll] = useState(true)

  const hook = () => {
    axios.get('http://localhost:3001/persons')
    .then(response => {
      setPersons(response.data)
    })
  }

  useEffect(hook, []);

  const addError = (errorMessage) => {
    //replacing with prevErrors to keep them correct 
    setErrors((prevErrors) => [...prevErrors, errorMessage])
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const validateName = () => {
    //need a value to return. Set it to true initialy and only change to false if it doesn't follow below rules.
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

  /*
  This is obviously a very simple validation, but for this its okay
  */
  const validNumber = (numberString) => {
    let valid = true
    for(const c of numberString) {
      if (!(c >= '0' && c<='9')){
        if( (!c === '-') )
        {
        valid = false;
        }
      }
    }
    return valid
  }

  const addNameAndNumber = (event) => {
    event.preventDefault()
    setErrors([])
    const nameObject = {
      name: newName,
      number: newNumber,
      id : persons.length+1
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

  
  const numbersToShow = showAll
  ? persons
  : persons.filter(person=>person.name.toLowerCase().includes(searchName.toLowerCase()))
  
  const handleSearch =(event) => {
    setsearchName(event.target.value)
    setShowAll(false)
  }

  return (
    <div>
      <Heading text={"Phonebook"}/>
      <Filter searchName={searchName} handleSearch={handleSearch}/>
      <SubHeading text={"add a new"}/>
      <PersonForm addNameAndNumber={addNameAndNumber} 
      newName={newName} handleNameChange={handleNameChange} 
      newNumber={newNumber} handleNumberChange={handleNumberChange}/>
      <SubHeading text={"Numbers"}/>
      <Persons numbersToShow={numbersToShow}/>
    </div>
  )
}

export default App

