import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRoute } from '@react-navigation/native';
import sampleTraces from '../data/sampleTraces';
import ProductTraceCard from '../components/ProductTraceCard';

const ProductDetailScreen = () => {
    const route = useRoute();
    const { traceId } = route.params;

    const productTrace = sampleTraces.find(trace => trace.id === traceId);

    if (!productTrace) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>Product trace not found.</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>{productTrace.productName}</Text>
            <ProductTraceCard trace={productTrace} />
            <Text style={styles.sectionTitle}>History</Text>
            <Text>{productTrace.history}</Text>
            <Text style={styles.sectionTitle}>Origin</Text>
            <Text>{productTrace.origin}</Text>
            <Text style={styles.sectionTitle}>Certifications</Text>
            <Text>{productTrace.certifications.join(', ')}</Text>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginTop: 16,
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        marginTop: 20,
    },
});

export default ProductDetailScreen;