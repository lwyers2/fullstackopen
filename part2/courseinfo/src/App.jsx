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


const App =() => {
  const courses = [{
    id: 1,
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10,
        id: 1
      },
      {
        name: 'Using props to pass data',
        exercises: 7,
        id: 2
      },
      {
        name: 'State of a component',
        exercises: 14,
        id: 3
      }, 
      {
        name: 'Redux',
        exercises: 11,
        id:4
      }
    ]
  },
  {
    name: 'Node.js',
    id: 2,
    parts: [
      {
        name: 'Routing',
        exercises: 3,
        id: 1
      },
      {
        name: 'Middlewares',
        exercises: 7,
        id: 2
      }
    ]
  }
  ]

  return (

    <>
    {courses.map(course=>
      <Course key={course.id} course={course}/>
    )}
    </>
    

  ) 
}

export default App