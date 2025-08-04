"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const admin_auth_middleware_1 = __importDefault(require("../middleware/admin-auth-middleware"));
const admin_middleware_1 = __importDefault(require("../middleware/admin-middleware"));
const get_all_leads_admin_1 = __importDefault(require("../controllers/get-all-leads-admin"));
const update_lead_1 = __importDefault(require("../controllers/update-lead"));
const router = express_1.default.Router();
router.get('/welcome-admin', admin_auth_middleware_1.default, admin_middleware_1.default, (req, res) => {
    res.status(200).json({
        success: true,
        message: "Welcome to the admin dashboard",
        user: req.userInfo
    });
});
router.get('/leads', admin_auth_middleware_1.default, admin_middleware_1.default, get_all_leads_admin_1.default);
router.put('/leads/:leadId', admin_auth_middleware_1.default, admin_middleware_1.default, update_lead_1.default);
exports.default = router;
//# sourceMappingURL=admin-routes.js.map