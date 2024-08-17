import { useState } from 'react'

const Button = ({onClick, text}) => <button onClick = {onClick}>{text}</button> 

const Heading = props => (<h1>{props.text}</h1>)

const Anecdote = props => (<p>{props.anecdote}<br></br>has {props.votes}</p>)

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]
  
 
  const [points, setPoints] = useState(Array(anecdotes.length).fill(0))
  const [selected, setSelected] = useState(0)
  const [highestVote, setHighestVote] = useState(0)

  const setRandomAnecdote = () => {
    const getRandomInt = (Math.floor(Math.random() * (anecdotes.length)))    
    setSelected(getRandomInt)
  }

  const addVote = () => {
    const copy = [...points]
    copy[selected] +=1
    setPoints(copy)
    const getHighest = () => {
      let highest = 0
      let pos =0;
      for(let i=0; i<copy.length; i++) {
        if(copy[i]>highest) {
          highest = copy[i]
          pos = i;
        }
      }
      return pos;
    }
    setHighestVote(getHighest);
    console.log(copy[highestVote])
  }

  

  return (
    <div>
      <Heading text={"Anecdote of the day"}/>
      <Anecdote anecdote={anecdotes[selected]} votes={points[selected]}/>
      <Button
        onClick={addVote}
        text='vote'/> 
      <Button
        onClick={setRandomAnecdote}
        text='next anecdote'/> 
      <Heading text={"Anecdote with most votes"}/>
      <Anecdote anecdote={anecdotes[highestVote]} votes={points[highestVote]}/>  
    </div>
  )
}

export default App