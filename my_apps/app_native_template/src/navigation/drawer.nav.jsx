import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View } from 'react-native';

// Componentes para o Drawer e Bottom Tabs
const HomeScreen = () => (
    <View>
        <Text>Home Screen</Text>
    </View>
);
const ProfileScreen = () => (
    <View>
        <Text>Profile Screen</Text>
    </View>
);
const SettingsScreen = () => (
    <View>
        <Text>Settings Screen</Text>
    </View>
);

const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

const BottomTabs = () => (
    <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
);

const DrawerNavigator = () => {
    return (
        <Drawer.Navigator>
            <Drawer.Screen name="Home" component={BottomTabs} />
            <Drawer.Screen name="Profile" component={ProfileScreen} />
        </Drawer.Navigator>
    );
};

const AppNavigator = () => {
    return (
        <NavigationContainer>
            <DrawerNavigator />
        </NavigationContainer>
    );
};

export default AppNavigator;
