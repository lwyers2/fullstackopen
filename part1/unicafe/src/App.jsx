import {useState} from 'react'

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)


  const Section = (props) => (
    <h1>{props.text}</h1>
  )

  const Button = props => (
    <button onClick={props.handleClick}>{props.text}</button>
  )

  const Statistics = props => (
    <p>{props.text} {props.tally}</p>
  )

  const handleGood = () => {
    const updatedGood = good + 1
    setGood(updatedGood)
  }

  const handleNeutral = () => {
    const updatedNeutral = neutral +1
    setNeutral(updatedNeutral)
  }

  const handleBad = () => {
    const updatedBad = bad +1
    setBad(updatedBad)
  }

  return (
    <div>
      <Section text='give feedback'/>
      <Button handleClick={() => handleGood()} text ='good' />
      <Button handleClick={() => handleNeutral()} text ='neutral' />
      <Button handleClick={() => handleBad()} text='bad'/>
      <Section text='statistics'/>
      <Statistics text='good' tally={good}/>
      <Statistics text='neutral' tally={neutral}/>
      <Statistics text='bad' tally={bad}/> 

    </div>
  )
}

export default App
