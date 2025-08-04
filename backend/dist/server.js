"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const db_1 = __importDefault(require("./database/db"));
const admin_auth_route_1 = __importDefault(require("./routes/admin-auth-route"));
const admin_routes_1 = __importDefault(require("./routes/admin-routes"));
const add_sales_routes_1 = __importDefault(require("./routes/add-sales-routes"));
const sales_auth_route_1 = __importDefault(require("./routes/sales-auth-route"));
const dotenv_1 = __importDefault(require("dotenv"));
const add_leads_to_sales_route_1 = __importDefault(require("./routes/add-leads-to-sales-route"));
const custom_lead_types_route_1 = __importDefault(require("./routes/custom-lead-types-route"));
const conversation_routes_1 = __importDefault(require("./routes/conversation-routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use("/api/auth", admin_auth_route_1.default);
app.use('/api/admin', admin_routes_1.default);
app.use('/api/admin', add_sales_routes_1.default);
app.use('/api/login-sales', sales_auth_route_1.default);
app.use('/api/sales', add_leads_to_sales_route_1.default);
app.use('/api/sales', custom_lead_types_route_1.default);
app.use('/api/sales/conversations', conversation_routes_1.default);
const PORT = process.env.PORT || 3001;
(0, db_1.default)();
app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
});
//# sourceMappingURL=server.js.map