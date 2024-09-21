import {useState, useEffect} from 'react'
import FilterForm from './components/FilterForm'
import Display from './components/Display'
import countriesService from './services/countries'
import weatherService from './services/weather'




const App = () => {
  const [countries, setCountries] = useState(null)
  const [filteredCountries, setFilteredCountries] = useState([])
  const [country, setCountry] = useState(null)
  const [searchText, setSearchText] = useState('')
  const api_key = import.meta.env.VITE_SOME_KEY
  const [weather, setWeather] = useState(null)


  
  useEffect(() => {
    countriesService
      .getAll()
      .then(initialCountries => {
        setCountries(initialCountries)
      })
  }, [])

  //for some reason if I take the below out, then it runs. if I keep it, everything breaks

  // if (!countries) {
  //   return null
  // }


  const handleSearch = (event) => {
    event.preventDefault()
    const searchValue = event.target.value
    setSearchText(searchValue)
    setFilteredCountries(countries.filter(country => 
      country.name.common.toLowerCase().includes(searchValue.toLowerCase())
    ))
  }

  useEffect(() => {
    if (filteredCountries.length === 1) {
      setCountry(filteredCountries[0])
    } else {
      setCountry(null)
    }
  }, [filteredCountries])

  useEffect(() => {
    if (country) {
       const lat = country.capitalInfo.latlng[0];
       const lon = country.capitalInfo.latlng[1];

      weatherService.getWeather(lat, lon, api_key)
        .then((initialWeather) => {
          setWeather(initialWeather);
        });
    }
  }, [country]);

  return (
    <div>
      <FilterForm search = {searchText} handleChange={handleSearch}/>
      <Display amount = {filteredCountries.length} countries={filteredCountries} country={country} weather={weather}/>
    </div>
  )

}

export default App
