import React, { useState } from 'react';
import { FlatList, View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const generateTimeSlots = (interval = 30, openingTime = 0, closingTime = 22.5) => {
    const slots = [];
    let hours, minutes, ampm;

    // Get the current time
    const currentDate = new Date();
    const currentHour = currentDate.getHours();
    const currentMinutes = currentDate.getMinutes();

    for (let i = 0; i < 24 * 60; i += interval) {
        hours = Math.floor(i / 60);
        minutes = i % 60;

        // Skip times before the current time
        if (hours < currentHour || (hours === currentHour && minutes <= currentMinutes)) {
            continue;
        }

        // Stop generating after the closing time
        if (hours + minutes / 60 > closingTime) {
            break;
        }

        ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        slots.push(hours + ':' + minutes + ' ' + ampm);
    }

    return slots;
};

const TimePicker = ({ onTimeChange }) => {
    const [selectedTime, setSelectedTime] = useState(null);
    const timeSlots = generateTimeSlots();

    const handleTimeSlotClick = (item) => {
        setSelectedTime(item);
        onTimeChange(item);
    }

    return (
        <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={timeSlots}
            renderItem={({ item }) => (
                <TouchableOpacity
                    style={selectedTime === item ? styles.selectedTimeSlot : styles.timeSlot}
                    onPress={() => handleTimeSlotClick(item)}
                >
                    <Text style={selectedTime === item ? styles.selectedTimeText : styles.timeText}>{item}</Text>
                </TouchableOpacity>
            )}
            keyExtractor={(item) => item}
        />
    );
};

const styles = StyleSheet.create({
    timeSlot: {
        padding: 10,
        margin: 5,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#d9d9d9',
    },
    selectedTimeSlot: {
        padding: 10,
        margin: 5,
        borderRadius: 15,
        backgroundColor: '#325964', // or any color of your choice
    },
    timeText: {
        fontSize: 16,
        color: '#696969',
    },
    selectedTimeText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFAF51',
    },
});

export default TimePicker;
