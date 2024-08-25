//Also adding useEffect to display errors when they occure
import {useState, useEffect} from 'react'
import './App.css'

const Number = props => <li>{props.name} {props.number}</li>

const Title = props => <h2>{props.title}</h2>

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ])
  const [newName, setNewName] = useState('')
  const [searchName, setsearchName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [errors, setErrors] = useState([])
  const [showAll, setShowAll] = useState(true)

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
    console.log(numbersToShow)
  }

  return (
    <div>
      <Title title={"Phonebook"}/>
        <div>
        filter shown with <input
        value={searchName}
        onChange={handleSearch}/>
        </div>
      <Title title={"add a new"}/>
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
      <Title title={"Numbers"}/>
      <div>
      <ul>
      {numbersToShow.map(person =>
        <Number key={person.id} name={person.name} number={person.number}/>
      )}
      </ul>
      </div> 
    </div>
  )
}

export default App

