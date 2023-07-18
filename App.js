import React, { useState, useEffect, useRef } from 'react';
import { Text, View, Button, Platform, TextInput } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Calendar from 'expo-calendar';

export default function App() {
  const [billName, setBillName] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [expoPushToken, setExpoPushToken] = useState('');

  const scheduleReminder = async () => {
    const { status } = await Calendar.requestCalendarPermissionsAsync();
    if (status === 'granted') {
      const calendars = await Calendar.getCalendarsAsync();
      const defaultCalendar = calendars.find((calendar) => calendar.source.name === 'Default');
      if (defaultCalendar) {
        const event = {
          title: billName,
          startDate: new Date(dueDate),
          endDate: new Date(dueDate),
          timeZone: 'GMT',
        };
        const { id } = await Calendar.createEventAsync(defaultCalendar.id, event);
        console.log(`Event created with ID: ${id}`);
        setBillName('');
        setAmount('');
        setDueDate('');
      }
    }
  };

  useEffect(() => {
    const registerForPushNotificationsAsync = async () => {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      const token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log(token);
      setExpoPushToken(token);
    };

    registerForPushNotificationsAsync();
  }, []);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Bill Name:</Text>
      <TextInput
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10 }}
        onChangeText={(text) => setBillName(text)}
        value={billName}
      />
      <Text>Amount:</Text>
      <TextInput
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10 }}
        onChangeText={(text) => setAmount(text)}
        value={amount}
      />
      <Text>Due Date:</Text>
      <TextInput
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10 }}
        onChangeText={(text) => setDueDate(text)}
        value={dueDate}
      />
      <Button title="Add Bill" onPress={scheduleReminder} />
    </View>
  );
}
