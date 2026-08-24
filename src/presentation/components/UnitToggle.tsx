import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { toggleUnit } from '../../store/slices/settingsSlice';

export function UnitToggle() {
  const unit = useAppSelector((state) => state.settings.unit);
  const dispatch = useAppDispatch();

  const onValueChange = () => {
    dispatch(toggleUnit());
  };

  return (
    <View style={styles.container} testID="unit-toggle">
      <Text>°C</Text>
      <Switch
        testID="unit-toggle-switch"
        value={unit === 'fahrenheit'}
        onValueChange={onValueChange}
      />
      <Text>°F</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
});
