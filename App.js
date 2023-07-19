import React, { useState, useEffect } from 'react';
import { Text, View, Button, TextInput, StyleSheet } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Calendar from 'expo-calendar';
import DatePicker from 'react-native-datepicker';

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
    };

    registerForPushNotificationsAsync();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bill Reminder</Text>
      <Text style={styles.label}>Bill Name:</Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => setBillName(text)}
        value={billName}
      />
      <Text style={styles.label}>Amount:</Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => setAmount(text)}
        value={amount}
      />
      <Text style={styles.label}>Due Date:</Text>
      <DatePicker
        style={styles.input}
        date={dueDate}
        mode="date"
        placeholder="Select a date"
        format="YYYY-MM-DD"
        minDate={new Date()}
        confirmBtnText="Confirm"
        cancelBtnText="Cancel"
        onDateChange={(date) => setDueDate(date)}
      />
      <Button title="Add Bill" onPress={scheduleReminder} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    height: 40,
    width: '80%',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});
