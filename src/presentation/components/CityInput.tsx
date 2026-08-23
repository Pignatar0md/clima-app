import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';

interface CityInputProps {
  onSearch: (city: string) => void;
}

export function CityInput({ onSearch }: CityInputProps) {
  const [value, setValue] = useState('');

  return (
    <View style={styles.container} testID="city-input-container">
      <TextInput
        testID="city-input"
        style={styles.input}
        placeholder="Buscar ciudad..."
        value={value}
        onChangeText={setValue}
        onSubmitEditing={() => onSearch(value)}
        returnKeyType="search"
      />
      <Button
        testID="search-button"
        title="Buscar"
        onPress={() => onSearch(value)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 16,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
});
