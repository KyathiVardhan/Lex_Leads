import mongoose, { Document, Schema } from 'mongoose';

export interface ISalesUser extends Document {
    name: string;
    email: string;
    password: string;
    role: 'admin' | 'sales';
    createdAt: Date;
    updatedAt: Date;
    isActive: boolean;
    columnPreferences?: {
        type_of_lead: boolean;
        project_name: boolean;
        name_of_lead: boolean;
        designation_of_lead: boolean;
        company_name: boolean;
        phone_number_of_lead: boolean;
        email_of_lead: boolean;
        source_of_lead: boolean;
        reference_name: boolean;
        reference_phone_number: boolean;
        intrested: boolean;
        follow_up_conversation: boolean;
        status: boolean;
        created_at: boolean;
        actions: boolean;
    };
}

const salesUserSchema = new Schema<ISalesUser>({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: [3, "Name must be at least 3 characters long"],
        maxlength: [50, "Name must be less than 50 characters long"],
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please enter a valid email"]
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
        enum: ["admin", "sales"],
        default: "sales",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    columnPreferences: {
        type_of_lead: { type: Boolean, default: true },
        project_name: { type: Boolean, default: true },
        name_of_lead: { type: Boolean, default: true },
        designation_of_lead: { type: Boolean, default: true },
        company_name: { type: Boolean, default: true },
        phone_number_of_lead: { type: Boolean, default: true },
        email_of_lead: { type: Boolean, default: true },
        source_of_lead: { type: Boolean, default: true },
        reference_name: { type: Boolean, default: false },
        reference_phone_number: { type: Boolean, default: false },
        intrested: { type: Boolean, default: true },
        follow_up_conversation: { type: Boolean, default: true },
        status: { type: Boolean, default: true },
        created_at: { type: Boolean, default: true },
        actions: { type: Boolean, default: true },
    },
});

const SalesUser = mongoose.model<ISalesUser>("SalesUser", salesUserSchema);

export default SalesUser; 