import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const HomeScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome to the Traceability App</Text>
            <Text style={styles.description}>
                Explore the features of product traceability and ensure transparency in your supply chain.
            </Text>
            <Button
                title="Scan Product"
                onPress={() => navigation.navigate('TraceScanner')}
            />
            <Button
                title="View Product Details"
                onPress={() => navigation.navigate('ProductDetail')}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    description: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 30,
    },
});

export default HomeScreen;