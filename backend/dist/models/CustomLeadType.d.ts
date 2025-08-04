import mongoose, { Document } from 'mongoose';
export interface ICustomLeadType extends Document {
    sales_user_id: mongoose.Types.ObjectId;
    custom_type: string;
    created_at: Date;
}
declare const CustomLeadType: mongoose.Model<ICustomLeadType, {}, {}, {}, mongoose.Document<unknown, {}, ICustomLeadType, {}> & ICustomLeadType & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default CustomLeadType;
//# sourceMappingURL=CustomLeadType.d.ts.map