import React from 'react';
import { View, Text } from 'react-native';
import Card from './Card';

const HomeScreen = () => (
    <View>
        <Card title="Card Title" content="This is the content of the card." />
        <Card title="Another Card" content="This is another content." />
    </View>
);

export default HomeScreen;