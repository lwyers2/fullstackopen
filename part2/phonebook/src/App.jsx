import {useState, useEffect} from 'react'
import './App.css'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Heading from './components/Heading'
import SubHeading from './components/SubHeading'
import personService from './services/persons'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [searchName, setsearchName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [errors, setErrors] = useState([])
  const [showAll, setShowAll] = useState(true)
  const [notificationMessage, setNotificationMessage] = useState(null)


  useEffect(() => {
    personService
    .getAll()
    .then(initalPersons => {
      setPersons(initalPersons)
    })
  }, [])

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

      const isUpdateNumber = window.confirm(`${newName} is already added to the phonebook, replace the old number with a new one?`)
      if(isUpdateNumber) 
      {
        updateContactNumber(newName, newNumber)
        isValid = false
      } else 
      {
        isValid = false
      } 
    } else if (newName.length===0) {
      addError(`Name is not populated`)
      isValid = false
    }
    return isValid 
  }

  const updateContactNumber = (name, newNumber) => {
    const personToUpdate = persons.find(person => person.name === name)



    const updatedPerson = 
    {
      ...personToUpdate,
      number: newNumber, 
    }

    personService
    .update(personToUpdate.id, updatedPerson)
    .then((updatedData)=>{
        setPersons(persons.map(person => 
          person.id !== personToUpdate.id ? person : updatedData
        ))
        setNotificationMessage(
          `Updated ${name}`
        )
        setTimeout(()=>{
          setNotificationMessage(null)
        }, 5000)
    })
    

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
    const nameObject = 
    {
      name: newName,
      number: newNumber,
      id: String(persons.length +1) 
    }
    const isValidName = validateName()
    const isValidNumber = validateNumber()
    if(isValidName && isValidNumber) 
    {
      //updating on the server
    personService
    .create(nameObject)
    .then(returnedPersons => 
      {
      setPersons(persons.concat(nameObject)) 
      setNewName('')
      setNewNumber('')
      setNotificationMessage(
        `Added ${newName}`
      )
      setTimeout(()=>{
        setNotificationMessage(null)
      }, 5000)
      })  
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
  
  const handleSearch = (event) => {
    setsearchName(event.target.value)
    setShowAll(false)
  }

  const handleDelete = (event) => 
  {
    event.preventDefault()
    const idToDelete = event.target.name
    const personToDelete = persons.find(person => person.id === idToDelete)         
    const confirmDelete =  window.confirm(`Delete ${personToDelete.name} ? `)
    
    if(confirmDelete) 
      {
      personService
      .remove(idToDelete)
      .then(() => 
        {
        setPersons(persons.filter(person=> person.id !== idToDelete))
        setNotificationMessage(
          `Deleted ${personToDelete.name}`
        )
        setTimeout(()=>{
          setNotificationMessage(null)
        }, 5000)
        })
      }
    }

  return (
    <div>
      <Heading text={"Phonebook"}/>
      <Notification message={notificationMessage}/>
      <Filter searchName={searchName} handleSearch={handleSearch}/>
      <SubHeading text={"add a new"}/>
      <PersonForm addNameAndNumber={addNameAndNumber} 
      newName={newName} handleNameChange={handleNameChange} 
      newNumber={newNumber} handleNumberChange={handleNumberChange}/>
      <SubHeading text={"Numbers"}/>
      <Persons numbersToShow={numbersToShow} onClick={handleDelete}/>
    </div>
  )
}

export default App

