import CountryName from './CountryName'
import CountryInformation from './CountryInformation'
import CountryLanguages from './CountryLanguages'
import CountryFlag from './CountryFlag'
import CountryWeather from './CountryWeather'

const CountryProfile = (props) => {
        
    if(!props.country) {
        return null
    }


    return (
        <div>
            <CountryName title={props.country.name.common}/>
            <CountryInformation capital={props.country.capital} area={props.country.area}/>
            <ul>
                {Object.values(props.country.languages).map(language => <CountryLanguages language={language} key={language}/>)
                }
            </ul>
            <CountryFlag source={props.country.flags.png} alt={props.country.name.common + ' Flag'}/>
            <CountryWeather weather={props.weather} capital={props.country.capital}/>
        </div>
    )
}

export default CountryProfile