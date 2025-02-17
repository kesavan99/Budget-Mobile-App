import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import Home from '../pages/Home.tsx';
import AddBudget from '../pages/AddBudget.tsx';

const Stack = createNativeStackNavigator();

const Navigation: React.FC = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen
                    name="My Money"
                    component={Home}
                    options={{
                        headerStyle: { backgroundColor: '#232B5D' },
                        headerTintColor: '#4CC9FE',
                        headerTitleStyle: { fontWeight: 'bold', fontFamily: '' },
                    }}
                />
                <Stack.Screen name="AddBudget" component={AddBudget} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default Navigation;
