import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import GohanTreinamentosPage from './GohanTreinamentosPage'; // Certifique-se de que o caminho está correto

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: 'white', // Cor do texto ativo
        tabBarStyle: {
          backgroundColor: 'black', // Fundo preto
        },
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarLabelStyle: {
          color: 'white', // Cor do texto das abas
        },
      }}>

      <Tabs.Screen
        name="GohanTreinamentosPage"
        options={{
          title: 'Gohan treinamentos',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="04.square.ar" color={color} />,
        }}
      />

      <Tabs.Screen
        name="Home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />

      <Tabs.Screen
        name="Explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}