import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Weather, describeWeatherCode } from "../../domain/entities/Weather";

interface WeatherCardProps {
  weather: Weather;
}

export function WeatherCard({ weather }: WeatherCardProps) {
  const unitSymbol = weather.unit === "celsius" ? "°C" : "°F";

  return (
    <View style={styles.card} testID="weather-card" accessible>
      <Text style={styles.city} testID="weather-city">
        {weather.cityName}
      </Text>
      <Text style={styles.temperature} testID="weather-temperature">
        {Math.round(weather.temperature)}
        {unitSymbol}
      </Text>
      <Text style={styles.description} testID="weather-description">
        {describeWeatherCode(weather.weatherCode)}
      </Text>
      <Text style={styles.wind} testID="weather-wind">
        Viento: {Math.round(weather.windSpeedKmh)} km/h
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 16,
    padding: 20,
    borderRadius: 12,
    backgroundColor: "#f2f6fc",
    alignItems: "center",
  },
  city: {
    fontSize: 20,
    fontWeight: "600",
  },
  temperature: {
    fontSize: 48,
    fontWeight: "700",
    marginVertical: 4,
  },
  description: {
    fontSize: 16,
    color: "#555",
  },
  wind: {
    fontSize: 14,
    color: "#777",
    marginTop: 4,
  },
});
