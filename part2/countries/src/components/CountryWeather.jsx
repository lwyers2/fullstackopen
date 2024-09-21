

const CountryWeather = (props) => {
    
    console.log(props.weather)
    //<p>temperature {props.weather}</p>
    //<img src={props.weather} alt={props.weather} />
    //<p>wind {props.weather}</p>
    const imageUrl = (`https://openWeathermap.org/img/wn/${props.weather.weather[0].icon}@2x.png`) 
    
    return(
        <div>
        <h2>Weather in {props.capital}</h2>
        <p>temperature {props.weather.main.temp} Celcius</p>
        <img src={imageUrl} alt={props.weather.weather[0].description}/>
        <p>wind {props.weather.wind.speed} m/s</p>
        </div>
    )
}

export default CountryWeather