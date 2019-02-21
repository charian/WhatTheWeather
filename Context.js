import React from "react";

const WeatherContext = React.createContext();

function withWeather(WrappedComponent) {
  return function withContext(props) {
    return (
      <WeatherContext.Consumer>
        {value => <WrappedComponent value={value} {...props} />}
      </WeatherContext.Consumer>
    );
  };
}

export { WeatherContext, withWeather };
