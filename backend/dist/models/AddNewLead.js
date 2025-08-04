"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const addNewLeadSchema = new mongoose_1.Schema({
    type_of_lead: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 150
    },
    project_name: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
    },
    name_of_lead: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
    },
    designation_of_lead: {
        type: String,
        required: true,
        trim: true,
        minlength: 3
    },
    company_name: {
        type: String,
        required: true,
        trim: true,
    },
    phone_number_of_lead: {
        type: String,
        required: true,
        trim: true,
        minlength: 10,
        maxlength: 10
    },
    email_of_lead: {
        type: String,
        required: true,
        trim: true,
        minlength: 3
    },
    source_of_lead: {
        type: String,
        required: true,
        trim: true,
        minlength: 3
    },
    reference_name: {
        type: String,
        trim: true,
        minlength: 3
    },
    reference_phone_number: {
        type: String,
        trim: true,
        minlength: 10,
        maxlength: 10
    },
    intrested: {
        type: String,
        enum: ['HOT', 'COLD', 'WARM', "NOT INTERESTED"],
        default: 'COLD',
        trim: true,
    },
    follow_up_conversation: {
        type: String,
        trim: true,
        default: ''
    },
    status: {
        type: String,
        enum: ['Open', 'Close'],
        default: 'Open',
        trim: true,
    },
    created_by: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'SalesUser',
        required: true,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    updated_at: {
        type: Date,
        default: Date.now,
    }
});
const AddNewLead = mongoose_1.default.model('AddNewLead', addNewLeadSchema);
exports.default = AddNewLead;
//# sourceMappingURL=AddNewLead.js.map