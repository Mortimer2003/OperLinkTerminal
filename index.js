/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import * as React from "react";
import SplashScreen from './src/SplashScreen'

AppRegistry.registerComponent(appName, () =>  () => <App />);
