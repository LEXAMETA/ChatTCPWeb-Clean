// app/index.tsx
import React from 'react';
import { View, Text, Button } from 'react-native';

export default function ChatMenu() {
  console.log('ChatMenu mounted');
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>ChatTCP-Web-Clean Test Page</Text>
      <Button title="Test Button" onPress={() => console.log('Button pressed')} />
    </View>
  );
}
