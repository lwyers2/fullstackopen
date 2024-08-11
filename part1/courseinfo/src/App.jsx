const App = () => {

  //const definitions
  const course = 'Half Stack application development'
  const parts =[ {
    name: 'Fundamentals of React',
    exercises: 10
  },
  {
    name: 'Using props to pass data',
    exercises: 7
  },
  {
    name: 'State of a component',
    exercises: 10
  }]

  return (
    <div>
      
      <Header course={course}/>
      <Content parts={parts}/>
      <Total parts={parts}/>
      

    </div>
  )
}

const Header = (course) => {
  return (
    <>
    <h1>{course.course}</h1>
    </>
  )
}

const Content = (parts) => {
  return (
    <div>
    <Part parts={{name:parts.parts[0].name, exercises:parts.parts[0].exercises}}/>
    <Part parts={{name:parts.parts[1].name, exercises:parts.parts[1].exercises}}/>
    <Part parts={{name:parts.parts[2].name, exercises:parts.parts[2].exercises}}/>
    
    </div>
  )
}

const Part = (parts) => {
  return (
    <>
    <p>{parts.parts.name} {parts.parts.exercises}</p>
    </>
  )
}

const Total = (total) => {
  return (
    <>
    <p>Number of exercises {total.parts[0].exercises+total.parts[1].exercises+total.parts[2].exercises}</p>
    </>
  )
}

export default App