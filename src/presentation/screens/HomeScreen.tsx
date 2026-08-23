import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Text,
  StyleSheet,
} from 'react-native';
import { CityInput } from '../components/CityInput';
import { WeatherCard } from '../components/WeatherCard';
import { UnitToggle } from '../components/UnitToggle';
import { useWeather } from '../hooks/useWeather';

export function HomeScreen() {
  const { weather, isLoading, errorMessage, searchCity } = useWeather();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Clima por Ciudad</Text>
        <UnitToggle />
        <CityInput onSearch={searchCity} />

        {isLoading && (
          <ActivityIndicator testID="loading-indicator" size="large" />
        )}

        {errorMessage && !isLoading && (
          <Text testID="error-message" style={styles.error}>
            {errorMessage}
          </Text>
        )}

        {weather && !isLoading && !errorMessage && (
          <WeatherCard weather={weather} />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    paddingTop: 24,
    alignItems: 'stretch',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
  },
  error: {
    color: '#c0392b',
    textAlign: 'center',
    marginTop: 12,
  },
});
