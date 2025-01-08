import { Image, StyleSheet, Platform, View, Text } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

// Componente para o cabeçalho com título
const TitleSection = () => (
  <ThemedView style={styles.titleContainer}>
    <ThemedText type="title">Ola mundo!!! </ThemedText>
    <HelloWave />
  </ThemedView>
);

// Componente para a primeira seção
const TryItSection = () => (
  <ThemedView style={styles.stepContainer}>
    <ThemedText type="subtitle">Step 1: Try it</ThemedText>
    <ThemedText>
      Edit <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> to see changes.
      Press{' '}
      <ThemedText type="defaultSemiBold">
        {Platform.select({
          ios: 'cmd + d',
          android: 'cmd + m',
          web: 'F12'
        })}
      </ThemedText>{' '}
      to open developer tools.
    </ThemedText>
  </ThemedView>
);

// Componente para a segunda seção
const ExploreSection = () => (
  <ThemedView style={styles.stepContainer}>
    <ThemedText type="subtitle">Step 2: Explore</ThemedText>
    <ThemedText>
      Tap the Explore tab to learn more about what's included in this starter app.
    </ThemedText>
  </ThemedView>
);

// Componente para a terceira seção
const FreshStartSection = () => (
  <ThemedView style={styles.stepContainer}>
    <ThemedText type="subtitle">Step 3: Get a fresh start</ThemedText>
    <ThemedText>
      When you're ready, run{' '}
      <ThemedText type="defaultSemiBold">npm run reset-project</ThemedText> to get a fresh{' '}
      <ThemedText type="defaultSemiBold">app</ThemedText> directory. This will move the current{' '}
      <ThemedText type="defaultSemiBold">app</ThemedText> to{' '}
      <ThemedText type="defaultSemiBold">app-example</ThemedText>.
    </ThemedText>
  </ThemedView>
);

// Renomear o componente para começar com letra maiúscula
const MeuComponente = () => {
  return (
    <View>
      <Text>Como ficar rico vendendo aplicativos mobile?</Text>
      <Text>Como ficar rico vendendo modelos de IA mobile?</Text>
      <Text>Como ficar rico vendendo dashboards??</Text>
    </View>
  );
};

// Componente principal
export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>  
      <TitleSection />
      <TryItSection />
      <FreshStartSection />
      <MeuComponente />
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
