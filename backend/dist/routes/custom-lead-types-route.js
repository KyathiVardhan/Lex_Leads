"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const get_custom_lead_types_1 = __importDefault(require("../controllers/get-custom-lead-types"));
const sales_auth_middleware_1 = __importDefault(require("../middleware/sales-auth-middleware"));
const router = express_1.default.Router();
router.get('/custom-lead-types', sales_auth_middleware_1.default, get_custom_lead_types_1.default);
exports.default = router;
//# sourceMappingURL=custom-lead-types-route.js.map