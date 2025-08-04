"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const add_conversation_1 = require("../controllers/add-conversation");
const sales_auth_middleware_1 = __importDefault(require("../middleware/sales-auth-middleware"));
const router = express_1.default.Router();
router.post('/add', sales_auth_middleware_1.default, add_conversation_1.addConversation);
router.get('/lead/:lead_id', sales_auth_middleware_1.default, add_conversation_1.getConversationsByLead);
exports.default = router;
//# sourceMappingURL=conversation-routes.js.map