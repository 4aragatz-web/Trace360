export const formatTraceData = (trace) => {
    return {
        id: trace.traceId,
        name: trace.productName,
        status: trace.status,
        history: trace.history.map(item => ({
            date: item.date,
            event: item.event,
            location: item.location,
        })),
    };
};

export const validateTraceId = (traceId) => {
    const traceIdPattern = /^[A-Z0-9]{10}$/; // Example pattern for trace ID
    return traceIdPattern.test(traceId);
};

export const fetchTraceData = async (traceId) => {
    try {
        const response = await fetch(`https://api.example.com/traces/${traceId}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return formatTraceData(data);
    } catch (error) {
        console.error('Error fetching trace data:', error);
        throw error;
    }
};