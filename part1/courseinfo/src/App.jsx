const App = () => {

  const course = {
    name : 'Half Stack application development',
    parts: [
    {name: 'Fundamentals of React',
    exercises: 10
  },
  {
    name: 'Using props to pass data',
    exercises: 7
  },
  {
    name: 'State of a component',
    exercises: 10  
  }
]
 }
  return (
    <div>
      
      <Header course={course}/>
      <Content course={course}/>
      <Total course={course}/>
      

    </div>
  )
}

const Header = (course) => {
  return (
    <>
    <h1>{course.course.name}</h1>
    </>
  )
}

const Content = (course) => {
  return (

    <div>
    <Part parts={{name:course.course.parts[0].name, exercises:course.course.parts[0].exercises}}/>
    <Part parts={{name:course.course.parts[1].name, exercises:course.course.parts[1].exercises}}/>
    <Part parts={{name:course.course.parts[2].name, exercises:course.course.parts[2].exercises}}/>
    
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

const Total = (course) => {
  console.log(course.course.parts[0].exercises)
  return (
    <>
    <p>Number of exercises {course.course.parts[0].exercises+course.course.parts[1].exercises+course.course.parts[2].exercises}</p>
    </>
  )
}

export default App