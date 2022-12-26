import React from 'react';
import { View, ActivityIndicator, StyleSheet, Dimensions } from 'react-native';

export function Loading() {
    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color="#394867" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EFEEEE',
        justifyContent: 'center',
        alignItems: 'center'
    }
})