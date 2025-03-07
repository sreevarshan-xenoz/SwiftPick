"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const path_1 = __importDefault(require("path"));
// Import routes
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const delivery_routes_1 = __importDefault(require("./routes/delivery.routes"));
const wallet_routes_1 = __importDefault(require("./routes/wallet.routes"));
const kyc_routes_1 = __importDefault(require("./routes/kyc.routes"));
const bank_routes_1 = __importDefault(require("./routes/bank.routes"));
// Load environment variables
dotenv_1.default.config();
// Initialize express app
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Middleware
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)({
    origin: process.env.NODE_ENV === 'production'
        ? process.env.FRONTEND_URL
        : 'http://localhost:3000',
    credentials: true
}));
app.use((0, helmet_1.default)());
app.use((0, morgan_1.default)(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use((0, express_fileupload_1.default)({
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max file size
    useTempFiles: true,
    tempFileDir: '/tmp/'
}));
// Routes
app.use('/api/auth', auth_routes_1.default);
app.use('/api/users', user_routes_1.default);
app.use('/api/deliveries', delivery_routes_1.default);
app.use('/api/wallet', wallet_routes_1.default);
app.use('/api/kyc', kyc_routes_1.default);
app.use('/api/bank', bank_routes_1.default);
// Serve static files in production
if (process.env.NODE_ENV === 'production') {
    // Set static folder
    app.use(express_1.default.static(path_1.default.join(__dirname, '../../frontend/out')));
    app.get('*', (req, res) => {
        res.sendFile(path_1.default.resolve(__dirname, '../../frontend/out', 'index.html'));
    });
}
// Health check route
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        message: 'Server is running',
        environment: process.env.NODE_ENV
    });
});
// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : {}
    });
});
// Connect to MongoDB
mongoose_1.default
    .connect(process.env.MONGODB_URI)
    .then(() => {
    console.log('Connected to MongoDB');
    // Start the server
    app.listen(PORT, () => {
        console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });
})
    .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
});
exports.default = app;
