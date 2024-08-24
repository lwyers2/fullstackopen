import {useState} from 'react'
import './App.css'

const Number = (props) => {
  return (
    <li>{props.name}</li>
  )
}

const App = () => {
  const [persons, setPersons] = useState([
    {name: 'Arto Hellas'}
  ])
  const [newName, setNewName] = useState('')

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const addName = (event) => {
    event.preventDefault()
    const nameObject = {
      name: newName
    }    
    if(!(persons.map(person => person.name).includes(newName))) 
    {  
    setPersons(persons.concat(nameObject)) 
    setNewName('')
    } else 
    {
      window.alert(`${newName} is already added to phonebook`)
    }


  }

  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={addName}>
        <div>
          name: <input
          value={newName}
          onChange={handleNameChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <div>
      <ul>
      {persons.map(person =>
        <Number key={person.name} name={person.name}/>
      )}
      </ul>
      </div> 
    </div>
  )
}

export default App

