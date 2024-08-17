const Course = props => {
    const total = props.course.parts.reduce((sum, part) => sum+part.exercises,0)
    return (
    <div>
      <Header id={props.course.id} name={props.course.name}/>
      <Content parts={props.course.parts}/>
      <Total total={total}/>
    </div>
  )
  
  }
  
  const Header = props =>(
    <>
    <h1 key={props.id}>{props.name}</h1>
    </>
  )
  
  const Content = props =>(
    <>
    {props.parts.map(part=>
      <Part key={part.id} name={part.name} exercises={part.exercises}/>
    )}
    </>
  )
  
  const Part = props => (
  <>
  <p>{props.name} {props.exercises}</p>
  </>
  )
  
  const Total = props => (
    <>
    <p><b>total of {props.total} exercises</b></p>
    </>
  )

  export default Course