import mongoose, { Document, Schema } from 'mongoose';

export interface ConversationEntry {
    conversation_notes: string;
    conversation_date: Date;
    updated_at: Date;
}

export interface SalesConverstions extends Document {
    sales_user_id: mongoose.Types.ObjectId;
    lead_id: mongoose.Types.ObjectId;
    conversations: ConversationEntry[];
    last_updated: Date;
}

const conversationEntrySchema = new Schema<ConversationEntry>({
    conversation_notes: {
        type: String,
        required: true,
    },
    conversation_date: {
        type: Date,
        default: Date.now,
        required: true,
    },
    updated_at: {
        type: Date,
        default: Date.now,
    }
});

const salesConverstionsSchema = new Schema<SalesConverstions>({
    sales_user_id: {
        type: Schema.Types.ObjectId,
        ref: 'SalesUser',
        required: true,
    },
    lead_id: {
        type: Schema.Types.ObjectId,
        ref: 'Lead',
        required: true,
    },
    conversations: [conversationEntrySchema],
    last_updated: {
        type: Date,
        default: Date.now,
    }
}, {
    timestamps: true
});

// Create compound index to ensure one document per sales person per lead
salesConverstionsSchema.index({ sales_user_id: 1, lead_id: 1 }, { unique: true });

const conversations = mongoose.model<SalesConverstions>("SalesConversations", salesConverstionsSchema);

export default conversations; 