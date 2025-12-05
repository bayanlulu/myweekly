import mongoose, { Schema, models } from 'mongoose';

// Define the structure of a User
export interface IUser {
  _id: string;           // Unique ID (MongoDB creates this automatically)
  email: string;         // User's email
  password: string;      // User's password (will be encrypted)
  name: string;          // User's full name
  department?: string;   //  User's department
  createdAt: Date;       // When the user registered
}

// Create the User Schema (database structure)
const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,        // No two users can have the same email
      lowercase: true,     // Convert to lowercase automatically
      trim: true,          // Remove extra spaces
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    department: {
      type: String,
      default: '',         // Optional field
    },
  },
  {
    timestamps: true,      // Automatically add createdAt and updatedAt
  }
);

// Export the User model
const User = models.User || mongoose.model<IUser>('User', UserSchema);
export default User;
