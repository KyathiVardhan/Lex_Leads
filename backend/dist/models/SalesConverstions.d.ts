import mongoose, { Document } from 'mongoose';
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
declare const conversations: mongoose.Model<SalesConverstions, {}, {}, {}, mongoose.Document<unknown, {}, SalesConverstions, {}> & SalesConverstions & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default conversations;
//# sourceMappingURL=SalesConverstions.d.ts.map