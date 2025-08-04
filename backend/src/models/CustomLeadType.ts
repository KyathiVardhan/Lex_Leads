import mongoose, { Document, Schema } from 'mongoose';

export interface ICustomLeadType extends Document {
    sales_user_id: mongoose.Types.ObjectId;
    custom_type: string;
    created_at: Date;
}

const customLeadTypeSchema = new Schema<ICustomLeadType>({
    sales_user_id: {
        type: Schema.Types.ObjectId,
        ref: 'SalesUser',
        required: true,
    },
    custom_type: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 50
    },
    created_at: {
        type: Date,
        default: Date.now,
    }
});

// Compound index to ensure unique custom types per sales user
customLeadTypeSchema.index({ sales_user_id: 1, custom_type: 1 }, { unique: true });

const CustomLeadType = mongoose.model<ICustomLeadType>('CustomLeadType', customLeadTypeSchema);

export default CustomLeadType; 