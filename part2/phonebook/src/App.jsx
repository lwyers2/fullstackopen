import {useState, useEffect} from 'react'
import './App.css'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Heading from './components/Heading'
import SubHeading from './components/SubHeading'
import personService from './services/persons'
import Notification from './components/Notification'
import ErrorDisplay from './components/ErrorDisplay'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [searchName, setsearchName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [errors, setErrors] = useState([])
  const [showAll, setShowAll] = useState(true)
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [displayError, setDisplayError] = useState(null)


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



  const addNameAndNumber = (event) => {
    event.preventDefault()

    const nameObject = {
        name: newName,
        number: newNumber
    }

    // Updating on the server
    personService
        .create(nameObject)
        .then(returnedPersons => {
            setPersons(persons.concat(returnedPersons))
            setNewName('')
            setNewNumber('')
            setNotificationMessage(`Added ${newName}`)
            setTimeout(() => {
                setNotificationMessage(null)
            }, 5000)
        })
        .catch(error => {
            if (error.response && error.response.status === 409) {
                const existingPerson = error.response.data.existingPerson
                const confirmUpdate = window.confirm(`The name '${existingPerson.name}' already exists. Do you want to update the number to '${newNumber}'?`)

                if (confirmUpdate) {
                    // If confirmed, send a PUT request to update the existing person's number
                    personService
                        .update(existingPerson.id, { number: newNumber }) // Only update the number
                        .then(updatedPerson => {
                            setPersons(persons.map(person => (person.id === updatedPerson.id ? updatedPerson : person)))
                            setNewName('')
                            setNewNumber('')
                            setNotificationMessage(`Updated ${updatedPerson.name}'s number`)
                            setTimeout(() => {
                                setNotificationMessage(null)
                            }, 5000)
                        })
                        .catch(updateError => {
                            setDisplayError(`Failed to update: ${updateError.message}`)
                            setTimeout(() => {
                                setDisplayError(null)
                            }, 10000)
                        })
                }
            } else {
                // Handle other errors
                setDisplayError(`Failed to add: ${error.message}`)
                setTimeout(() => {
                    setDisplayError(null)
                }, 10000)
            }
        })
}
  

  useEffect(() => {
    if (errors.length > 0) {
      const errorsString = errors.join('\n') // Join errors with newline characters
      window.alert(errorsString) // Display errors in an alert box
    }
  }, [errors]) // Runs whenever the `errors` array is updated

  
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
      .catch(error => {
        setDisplayError(
          `Information of ${personToDelete.name} has already been removed from the server`
        )
        setTimeout(()=>{
          setDisplayError(null)
        }, 10000)
      })
      }
    }

  return (
    <div>
      <Heading text={"Phonebook"}/>
      <Notification message={notificationMessage}/>
      <ErrorDisplay message={displayError}/>
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

