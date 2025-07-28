import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { validateTraceID } from '../utils/traceUtils';
import { fetchTraceData } from '../services/api';

const TraceScannerScreen = () => {
    const [traceID, setTraceID] = useState('');
    const [traceData, setTraceData] = useState(null);
    const [error, setError] = useState('');

    const handleScan = async () => {
        if (!validateTraceID(traceID)) {
            setError('Invalid Trace ID');
            return;
        }
        setError('');
        try {
            const data = await fetchTraceData(traceID);
            setTraceData(data);
        } catch (err) {
            setError('Failed to fetch trace data');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Trace Scanner</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter Trace ID"
                value={traceID}
                onChangeText={setTraceID}
            />
            <Button title="Scan" onPress={handleScan} />
            {error ? <Text style={styles.error}>{error}</Text> : null}
            {traceData && (
                <View style={styles.result}>
                    <Text>Product Name: {traceData.productName}</Text>
                    <Text>Trace ID: {traceData.traceID}</Text>
                    <Text>Status: {traceData.status}</Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 16,
    },
    title: {
        fontSize: 24,
        marginBottom: 16,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 16,
        paddingHorizontal: 8,
    },
    error: {
        color: 'red',
        marginBottom: 16,
    },
    result: {
        marginTop: 16,
    },
});

export default TraceScannerScreen;