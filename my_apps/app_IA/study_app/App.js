import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import HomeScreen from './screens/HomeScreen';
import PomodoroScreen from './screens/PomodoroScreen';
import FlashcardsScreen from './screens/FlashcardsScreen';
import SettingsScreen from './screens/SettingsScreen';

const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route, navigation }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Home':
              iconName = 'home';
              break;
            case 'Pomodoro':
              iconName = 'timer';
              break;
            case 'Flashcards':
              iconName = 'style';
              break;
            case 'Settings':
              iconName = 'settings';
              break;
            default:
              iconName = 'help';
          }

          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => navigation.openDrawer()}
            style={{ marginLeft: 16 }}
          >
            <MaterialIcons name="menu" size={24} color="white" />
          </TouchableOpacity>
        ),
        tabBarStyle: {
          backgroundColor: 'black',
        },
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: '#666',
        headerStyle: {
          backgroundColor: 'black',
        },
        headerTintColor: 'white',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Pomodoro" component={PomodoroScreen} />
      <Tab.Screen name="Flashcards" component={FlashcardsScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        screenOptions={{
          headerShown: false,
          drawerStyle: {
            backgroundColor: '#1a1a1a',
          },
          drawerLabelStyle: {
            color: 'white',
          },
          drawerActiveBackgroundColor: '#333',
          drawerActiveTintColor: 'white',
          drawerInactiveTintColor: '#999',
        }}
      >
        <Drawer.Screen 
          name="MainTabs" 
          component={TabNavigator}
          options={{
            drawerLabel: 'Home',
            drawerIcon: ({ color, size }) => (
              <MaterialIcons name="home" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen 
          name="PomodoroDrawer" 
          component={PomodoroScreen}
          options={{
            drawerLabel: 'Pomodoro',
            drawerIcon: ({ color, size }) => (
              <MaterialIcons name="timer" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen 
          name="FlashcardsDrawer" 
          component={FlashcardsScreen}
          options={{
            drawerLabel: 'Flashcards',
            drawerIcon: ({ color, size }) => (
              <MaterialIcons name="style" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen 
          name="SettingsDrawer" 
          component={SettingsScreen}
          options={{
            drawerLabel: 'Settings',
            drawerIcon: ({ color, size }) => (
              <MaterialIcons name="settings" size={size} color={color} />
            ),
          }}
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}