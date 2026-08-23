import React from 'react';
import { Provider } from 'react-redux';
import { store } from './src/store/store';
import { HomeScreen } from './src/presentation/screens/HomeScreen';

export default function App() {
  return (
    <Provider store={store}>
      <HomeScreen />
    </Provider>
  );
}
