"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const sales_auth_middleware_1 = __importDefault(require("../middleware/sales-auth-middleware"));
const add_lead_1 = __importDefault(require("../controllers/add-lead"));
const get_leads_1 = __importDefault(require("../controllers/get-leads"));
const update_lead_1 = __importDefault(require("../controllers/update-lead"));
const column_preferences_1 = require("../controllers/column-preferences");
const router = express_1.default.Router();
router.post('/add-leads-to-sales', sales_auth_middleware_1.default, add_lead_1.default);
router.get('/leads', sales_auth_middleware_1.default, get_leads_1.default);
router.put('/leads/:leadId', sales_auth_middleware_1.default, update_lead_1.default);
router.get('/column-preferences', sales_auth_middleware_1.default, column_preferences_1.getColumnPreferences);
router.put('/column-preferences', sales_auth_middleware_1.default, column_preferences_1.saveColumnPreferences);
exports.default = router;
//# sourceMappingURL=add-leads-to-sales-route.js.map