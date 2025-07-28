const sampleTraces = [
    {
        traceId: "TRC123456",
        productName: "Organic Coffee Beans",
        status: "Verified",
        history: [
            { date: "2023-01-01", event: "Harvested from farm XYZ" },
            { date: "2023-01-15", event: "Processed at facility ABC" },
            { date: "2023-02-01", event: "Shipped to distributor 123" }
        ]
    },
    {
        traceId: "TRC789012",
        productName: "Artisan Olive Oil",
        status: "Pending Verification",
        history: [
            { date: "2023-02-10", event: "Harvested from grove DEF" },
            { date: "2023-02-20", event: "Bottled at facility GHI" }
        ]
    },
    {
        traceId: "TRC345678",
        productName: "Fresh Avocados",
        status: "Verified",
        history: [
            { date: "2023-03-01", event: "Harvested from farm JKL" },
            { date: "2023-03-05", event: "Inspected and packaged" },
            { date: "2023-03-10", event: "Delivered to retailer MNO" }
        ]
    }
];

export default sampleTraces;