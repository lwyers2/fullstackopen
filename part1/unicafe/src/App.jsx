import {useState} from 'react'

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const all = (good + neutral + bad)
  const average = isNaN((good-bad)/all) ? 0 : (good-bad)/all
  const positive = isNaN(good/all) ? 0 : good/all

  const Section = (props) => (
    <h1>{props.text}</h1>
  )

  const Button = props => (
    <button onClick={props.handleClick}>{props.text}</button>
  )

  const Statistics = (props) => {
    console.log(props)
    
    if(props.all == 0){
      return (<p>No feedback given</p>)
    }
    return (
    <div>
      <table>
    <StatisticLine text="good" value={props.good}/>  
    <StatisticLine text="neutral" value={props.neutral}/>  
    <StatisticLine text="bad" value={props.bad}/>  
    <StatisticLine text="all" value={props.all}/>  
    <StatisticLine text="average" value={props.average}/>  
    <StatisticLine text="positive" value={props.positive} delimiter={props.delimiter}/>  
    </table>
    </div>
  )}

  const StatisticLine = props => (
    <tbody>
    <tr>
    <td>{props.text}</td> 
    <td>{props.value}</td>
    <td>{props.delimiter}</td>
    </tr>
    </tbody>
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
      <Statistics good={good} neutral={neutral} bad={bad} all={all} average={average} positive={positive} delimiter={"%"}/>

    </div>
  )
}

export default App
