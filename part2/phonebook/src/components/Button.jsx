const Button = props => 
<button 
type={props.type} 
onClick={props.onClick} 
name={props.buttonID}>
    {props.text}
</button>

export default Button