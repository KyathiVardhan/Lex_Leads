"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const salesLogin_1 = __importDefault(require("../controllers/salesLogin"));
const sales_auth_middleware_1 = __importDefault(require("../middleware/sales-auth-middleware"));
const router = express_1.default.Router();
router.post("/login", salesLogin_1.default);
router.get("/welcome-sales", sales_auth_middleware_1.default, (req, res) => {
    res.status(200).json({
        success: true,
        message: "Welcome! You are authenticated as a sales person.",
        user: req.userInfo
    });
});
exports.default = router;
//# sourceMappingURL=sales-auth-route.js.map