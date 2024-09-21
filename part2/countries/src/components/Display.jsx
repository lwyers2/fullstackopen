import Countries from "./Countries"
import CountryProfile from "./CountryProfile"

const Display = (props) => {

    return(
        <div>
           {props.amount <=0 ? null //If amount is 0 show nothing
           : 
           props.amount > 10 ?  // then if more then 10 show text
           (
            <div>Too many matches, specify another filter</div>
           ) 
           : props.amount === 1 ?  // show only one country
           (
            <CountryProfile country={props.country} weather={props.weather}/>
           ) 
           : //then show all countries from search
           (
            <ul>
            {props.countries.map(country => <Countries country={country} key={country.name.common}/>)}    
            </ul>
           )
            } 
        </div>
    )

}



export default Display