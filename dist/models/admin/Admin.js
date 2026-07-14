import mongoose from 'mongoose';
const adminSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    refreshToken: { type: String, default: null },
    refreshTokenExpiry: { type: Date, default: null },
}, { timestamps: true });
const Admin = mongoose.model('Admin', adminSchema);
export default Admin;
