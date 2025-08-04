import mongoose, { Document } from 'mongoose';
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
declare const SalesUser: mongoose.Model<ISalesUser, {}, {}, {}, mongoose.Document<unknown, {}, ISalesUser, {}> & ISalesUser & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default SalesUser;
//# sourceMappingURL=SalesUser.d.ts.map