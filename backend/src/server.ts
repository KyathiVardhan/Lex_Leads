import express from "express";
import cors from "cors";
import connectDB from "./database/db";
import authRoutes from "./routes/admin-auth-route";
import adminRoutes from "./routes/admin-routes";
import addSalesRoutes from "./routes/add-sales-routes"; 
import salesAuthRoutes from "./routes/sales-auth-route";
import dotenv from "dotenv";
import addLeadsToSales from "./routes/add-leads-to-sales-route";
import customLeadTypesRoutes from "./routes/custom-lead-types-route";
import conversationRoutes from "./routes/conversation-routes";


dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

//routes
app.use("/api/auth", authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin', addSalesRoutes); 
app.use('/api/login-sales', salesAuthRoutes);
app.use('/api/sales', addLeadsToSales);
app.use('/api/sales', customLeadTypesRoutes);
app.use('/api/sales/conversations', conversationRoutes);


const PORT = process.env.PORT || 3001;

connectDB();

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
}); 