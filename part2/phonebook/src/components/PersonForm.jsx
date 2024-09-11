import Button from './Button'
const PersonForm = (props) => {
    return(
    <form onSubmit={props.addNameAndNumber}>
    <div>
      name: <input
      value={props.newName}
      onChange={props.handleNameChange} />
    </div>
    <div>
      number: <input
      value={props.newNumber}
      onChange={props.handleNumberChange} />
    </div>
    <div>
      <Button type="submit" text="add"/>
    </div>
  </form>
    )
}

export default PersonForm