import mongoose, { Document } from 'mongoose';
export interface IAddNewLead extends Document {
    type_of_lead: string;
    project_name: string;
    name_of_lead: string;
    designation_of_lead: string;
    company_name: string;
    phone_number_of_lead: string;
    email_of_lead: string;
    source_of_lead: string;
    reference_name: string;
    reference_phone_number: string;
    intrested: 'HOT' | 'COLD' | 'WARM' | 'NOT INTERESTED';
    follow_up_conversation: string;
    status: 'Open' | 'Close';
    created_by: mongoose.Types.ObjectId;
    created_at: Date;
    updated_at: Date;
}
declare const AddNewLead: mongoose.Model<IAddNewLead, {}, {}, {}, mongoose.Document<unknown, {}, IAddNewLead, {}> & IAddNewLead & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default AddNewLead;
//# sourceMappingURL=AddNewLead.d.ts.map