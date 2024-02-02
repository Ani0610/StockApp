/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import type { PropsWithChildren } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import AuthNavigator from './src/navigator/AuthNavigator';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';
import { RootState } from './src/redux/store';
import SideMenuNavigator from './src/navigator/SideMenuNavigator';
import BottomTabNavigator from './src/navigator/BottomTabNavigator';
import CreateSampleDesign from './src/pages/Design master/CreateSampleDesign';

type SectionProps = PropsWithChildren<{
  title: string;
}>;



function App(): React.JSX.Element {

  const Stack = createNativeStackNavigator();
  const user = useSelector((state: RootState) => state.user)
  const [isLoggedIn, setIsLogged] = useState(false);
  useEffect(() => {
    if (user?.user) {
      setIsLogged(true)
    } else {
      setIsLogged(false)
    }
  }, [user])
  return (
    <SafeAreaView style={{ backgroundColor: 'white', height: '100%', flex: 1 }}>

      <NavigationContainer theme={DefaultTheme}>
        {isLoggedIn ?
          // <SideMenuNavigator />
          <Stack.Navigator >
            <Stack.Screen name='AppDrawerStack' component={SideMenuNavigator} options={{
              headerShown: false
            }} />
            <Stack.Screen name='Add Design' component={CreateSampleDesign} options={{
              headerShown: false
            }} />
            {/* <Stack.Screen name='BottomTabNavigator' component={BottomTabNavigator} options={{
              headerShown: false
            }} /> */}
          </Stack.Navigator>
          :
          <Stack.Navigator initialRouteName="Login">
            <Stack.Screen name="Auth" options={{ headerShown: false }}
              component={AuthNavigator} />
          </Stack.Navigator>}

      </NavigationContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
