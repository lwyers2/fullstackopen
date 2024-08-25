import Numbers from './Numbers'

const Persons = (props) => {
    return(
        <div>
        <ul>
        {props.numbersToShow.map(person =>
          <Numbers key={person.id} name={person.name} number={person.number}/>
        )}
        </ul>
        </div>     
    )
}


export default Persons