import React, { useState, useEffect } from 'react';
import { Text, View, Button, TextInput, StyleSheet, Switch } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Calendar from 'expo-calendar';
import DatePicker from 'react-native-datepicker';

export default function App() {
  const [billName, setBillName] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [expoPushToken, setExpoPushToken] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);

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

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const containerStyle = isDarkMode ? styles.darkContainer : styles.lightContainer;
  const textStyle = isDarkMode ? styles.darkText : styles.lightText;

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={[styles.title, textStyle]}>Bill Reminder</Text>
      <Text style={[styles.label, textStyle]}>Bill Name:</Text>
      <TextInput
        style={[styles.input, textStyle]}
        onChangeText={(text) => setBillName(text)}
        value={billName}
      />
      <Text style={[styles.label, textStyle]}>Amount:</Text>
      <TextInput
        style={[styles.input, textStyle]}
        onChangeText={(text) => setAmount(text)}
        value={amount}
      />
      <Text style={[styles.label, textStyle]}>Due Date:</Text>
      <DatePicker
        style={[styles.input, textStyle]}
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
      <View style={styles.toggleContainer}>
        <Text style={[styles.label, textStyle]}>Dark Mode:</Text>
        <Switch value={isDarkMode} onValueChange={toggleDarkMode} />
      </View>
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
  lightContainer: {
    backgroundColor: '#ffffff',
  },
  darkContainer: {
    backgroundColor: '#222222',
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
  lightText: {
    color: '#000000',
  },
  darkText: {
    color: '#ffffff',
  },
  input: {
    height: 40,
    width: '80%',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
});
