import { View, Text, Button } from 'react-native';
import { useEffect } from 'react';

export default function App() {
  useEffect(() => {
    alert('ChatMenu mounted');
    console.log('ChatMenu mounted');
  }, []);
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>ChatTCP-Web-Clean Test Page</Text>
      <Button
        title="Press Me"
        onPress={() => {
          alert('Button pressed');
          console.log('Button pressed');
        }}
      />
    </View>
  );
}
