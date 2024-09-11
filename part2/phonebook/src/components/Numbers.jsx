import Button from './Button'
const Numbers = props => <li>{props.name} {props.number} &ensp;
<Button 
type="button" 
onClick={props.onClick} 
text="delete" 
buttonID={props.buttonID}/> </li>

export default Numbers