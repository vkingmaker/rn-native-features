/** @format */

import React, { useEffect, useCallback } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import ReduxThunk from 'redux-thunk';
import { Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';

import HeaderButton from './components/HeaderButton';
import PlacesListScreen from './screens/PlacesListScreen';
import PlaceDetailScreen from './screens/PlaceDetailScreen';
import NewPlaceScreen from './screens/NewPlaceScreen';
import MapScreen from './screens/MapScreen';
import Colors from './constants/Colors';
import placesReducer from './store/places-reducer';
import { init } from './helpers/db';

init()
	.then(() => {
		console.log('Initialized database');
	})
	.catch((err) => {
		console.log('Initializing db failed.');
		console.log(err);
	});

const rootReducer = combineReducers({
	places: placesReducer,
});

const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

const Stack = createStackNavigator();

export default function App() {
	return (
		<Provider store={store}>
			<NavigationContainer>
				<Stack.Navigator>
					<Stack.Screen
						name='Places'
						component={PlacesListScreen}
						options={(props) => ({
							title: 'All Screens',
							headerRight: () => {
								return (
									<HeaderButtons
										HeaderButtonComponent={HeaderButton}>
										<Item
											title='Add Place'
											iconName={
												Platform.OS === 'android'
													? 'md-add'
													: 'ios-add'
											}
											onPress={() =>
												props.navigation.navigate(
													'NewPlace',
												)
											}
										/>
									</HeaderButtons>
								);
							},
							headerStyle: { backgroundColor: '#000' },
							headerTintColor: '#fff',
						})}
					/>
					<Stack.Screen
						name='PlaceDetail'
						component={PlaceDetailScreen}
						options={({ route }) => ({
							title: route.params.placeTitle,
						})}
					/>
					<Stack.Screen
						name='NewPlace'
						component={NewPlaceScreen}
						options={{
							headerStyle: { backgroundColor: Colors.primary },
							headerTintColor: '#fff',
						}}
					/>
					<Stack.Screen
						name='Map'
						component={MapScreen}
						options={(props) => ({
							title: 'Map Screen',
							headerRight: () => {
								return (
									<TouchableOpacity
										style={styles.headerButton}
										onPress={() => {}}>
										<Text style={styles.headerButtonText}>
											Save
										</Text>
									</TouchableOpacity>
								);
							},
							headerStyle: { backgroundColor: Colors.primary },
							headerTintColor: '#fff',
						})}
					/>
				</Stack.Navigator>
			</NavigationContainer>
		</Provider>
	);
}



const styles = StyleSheet.create({
	headerButton: {
		marginHorizontal: 20
	},
	headerButtonText: {
		fontSize: 16,
		color: Platform.OS === 'android' ? 'white' : Colors.primary
	},
});
