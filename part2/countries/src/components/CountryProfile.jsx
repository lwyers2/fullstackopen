import CountryName from './CountryName'
import CountryInformation from './CountryInformation'
import CountryLanguages from './CountryLanguages'
import CountryFlag from './CountryFlag'

const CountryProfile = (props) => {
    const country = props.country[0]
    return (
        <div>
            <CountryName title={country.name.common}/>
            <CountryInformation capital={country.capital} area={country.area}/>
            <ul>
                {Object.values(country.languages).map(language => <CountryLanguages language={language} key={language}/>)
                }
            </ul>
            <CountryFlag source={country.flags.png} alt={country.name.common + ' Flag'}/>
        </div>
    )
}

export default CountryProfile