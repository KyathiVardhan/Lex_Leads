"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const isAdminUser = (req, res, next) => {
    if (!req.userInfo || req.userInfo.role !== 'admin') {
        res.status(403).json({
            success: false,
            message: 'Access denied. You are not authorized to access this resource'
        });
        return;
    }
    next();
};
exports.default = isAdminUser;
//# sourceMappingURL=admin-middleware.js.map