import { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
  const [countries, setCountries] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [weather, setWeather] = useState([]);
  const [icon, setIcon] = useState({});
  const [lat, setLat] = useState([]);
  const [long, setLong] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      axios.get("https://restcountries.com/v3.1/all").then((response) => {
        setCountries(response.data);
      });
    };
    fetchData();
  }, [lat, long, countries]);

  
    const fetchWeather = async () => {
      if(filtered.length===1){
      await fetch(
        `${process.env.REACT_APP_API_URL}/weather/?lat=${filtered[0]?.capitalInfo.latlng[0]}&lon=${filtered[0]?.capitalInfo.latlng[1]}&units=metric&APPID=${process.env.REACT_APP_API_KEY}`
      )
        .then((res) => res.json())
        .then((result) => {
          setWeather(result);
        });
    }};

  const SearchCountry = (event) => {
    const countrytoSearch = event.target.value;
    var copyCountries = [...countries];
    copyCountries = copyCountries.filter(
      (item) =>
        item.name.common
          .toLowerCase()
          .indexOf(countrytoSearch.toLowerCase()) !== -1
    );
    filtered.length === 1 && console.log(copyCountries)
    setFiltered(copyCountries);
  };

  const Filter = () => {
    return (
      <div>
        {filtered.map((country, key) => (
          <p key={key}>
            {country.name.common}
            <button
              onClick={() => {
                setFiltered([country]);
                Country(filtered);
              }}
            >
              show
            </button>
          </p>
        ))}
      </div>
    );
  };

  const Country = () => {
    filtered.length === 1 && fetchWeather()
    return (
      <div>
        {filtered.map((element, key) => (
          <div key={key}>
            <h2>{element.name.common}</h2>
            <p>Capital : {element.capital}</p>
            <p>Area : {element.area}</p>
            <h3>languages : </h3>
            <p>
              {Object.entries(element.languages).map(([key, val], i) => (
                <li key={i}>{val}</li>
              ))}
            </p>
            <p>
              {Object.entries(element.flags).map(([key, val], i) => (
                <img key={i} src={val} alt="flag" />
              ))}
            </p>
          </div>
        ))}
        <div>
          {/* <h2>Weather in {weather.name}</h2>
          <p>temperature - {weather.main.temp} Celcius</p>
          <p>Wind - {weather.wind.speed} m/s</p> */}
        </div>
      </div>
    );
  };
  

  return (
    <div>
      <div>
        find countries <input onChange={SearchCountry} />
      </div>
      {filtered.length > 10 ? (
        <p>Too many search queries</p>
      ) : filtered.length === 1 ? (
        <Country /> 
      ) :<Filter /> }
    </div>
  );
};

export default App;
