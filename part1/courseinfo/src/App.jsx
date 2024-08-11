const App = () => {

  //const definitions
  const course = 'Half Stack application development'
  const part1 = {
    name: 'Fundamentals of React',
    exercises: 10
  }
  const part2 = {
    name: 'Using props to pass data',
    exercises: 7
  }
  const part3 = {
    name: 'State of a component',
    exercises: 10
  }

  return (
    <div>
      
      <Header course={course}/>
      <Content part1={part1} part2={part2} part3={part3}/>
      <Total part1={part1} part2={part2} part3={part3}/>

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

const Content = (part) => {
  return (
    <div>
    <Part part={part.part1.name} exercises={part.part1.exercises}/>
    <Part part={part.part2.name} exercises={part.part2.exercises}/>
    <Part part={part.part3.name} exercises={part.part3.exercises}/>
    </div>
  )
}

const Part = (part) => {
  return (
    <>
    <p>{part.part} {part.exercises}</p>
    </>
  )
}

const Total = (total) => {
  return (
    <>
    <p>Number of exercises {total.part1.exercises+total.part2.exercises+total.part3.exercises}</p>
    </>
  )
}

export default App