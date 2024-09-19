import {useState, useEffect} from 'react'
import FilterForm from './components/FilterForm'
import Display from './components/Display'
import countriesService from './services/countries'

const App = () => {
  const [countries, setCountries] = useState(null)
  const [filterdCountries, setFilteredCountries] = useState([])
  const [country, setCountry] = useState([])
  const [searchText, setSearchText] = useState('')




  useEffect(() => {
    countriesService
    .getAll()
    .then(initialCountries => {
      setCountries(initialCountries)
    })
  }, [])

  if (!countries) {
    return null
  }

  const handleSearch = (event) => {
    event.preventDefault()
    const searchValue = event.target.value
    setSearchText(searchValue)
    setFilteredCountries(countries.filter(country=>country.name.common.toLowerCase().includes(searchValue.toLowerCase())))
  }


  console.log(filterdCountries.length);
  

  return (
    <div>
      <FilterForm search = {searchText} handleChange={handleSearch}/>
      <Display amount = {filterdCountries.length} countries={filterdCountries} country={filterdCountries}/>
    </div>
  )

}

export default App
