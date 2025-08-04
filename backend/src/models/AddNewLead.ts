import mongoose, { Document, Schema } from 'mongoose';

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

const addNewLeadSchema = new Schema<IAddNewLead>({
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
        type: Schema.Types.ObjectId,
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

const AddNewLead = mongoose.model<IAddNewLead>('AddNewLead', addNewLeadSchema);

export default AddNewLead; 