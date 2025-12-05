import mongoose, { Schema, models } from 'mongoose';

// Define a single task structure
export interface ITask {
  title: string;         // What you did
  timeSpent?: number;    // Hours spent (optional)
  priority?: string;     // Low, Medium, High (optional)
}

// Define a challenge structure
export interface IChallenge {
  description: string;   // What the challenge was
  solution?: string;     // How you solved it (optional)
}

// Define the complete Weekly Report structure
export interface IReport {
  _id: string;
  userId: string;                      // Who created this report
  weekStartDate: Date;                 // Week start date
  weekEndDate: Date;                   // Week end date
  
  // Main sections of the report
  tasksCompleted: ITask[];             // List of completed tasks
  workInProgress: ITask[];             // List of ongoing tasks
  challenges: IChallenge[];            // List of challenges faced
  improvements: string;                // What you learned/improved
  nextWeekPlan: string;                // Plans for next week
  summary: string;                     // Overall summary
  
  status: 'draft' | 'submitted';       // Is it a draft or submitted?
  submittedAt?: Date;                  // When it was submitted
  createdAt: Date;                     // When report was created
  updatedAt: Date;                     // When report was last updated
}

// Create the Report Schema
const ReportSchema = new Schema<IReport>(
  {
    userId: {
      type: String,
      required: true,
      index: true,           // Makes searching by userId faster
    },
    weekStartDate: {
      type: Date,
      required: [true, 'Week start date is required'],
    },
    weekEndDate: {
      type: Date,
      required: [true, 'Week end date is required'],
    },
    
    // Tasks completed this week
    tasksCompleted: {
      type: [{
        title: { type: String, required: true },
        timeSpent: { type: Number },
        priority: { type: String, enum: ['Low', 'Medium', 'High'] },
      }],
      default: [],
    },
    
    // Work still in progress
    workInProgress: {
      type: [{
        title: { type: String, required: true },
        timeSpent: { type: Number },
        priority: { type: String, enum: ['Low', 'Medium', 'High'] },
      }],
      default: [],
    },
    
    // Challenges faced
    challenges: {
      type: [{
        description: { type: String, required: true },
        solution: { type: String },
      }],
      default: [],
    },
    
    // Text fields
    improvements: {
      type: String,
      default: '',
    },
    nextWeekPlan: {
      type: String,
      default: '',
    },
    summary: {
      type: String,
      default: '',
    },
    
    // Status tracking
    status: {
      type: String,
      enum: ['draft', 'submitted'],
      default: 'draft',
    },
    submittedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,        // Add createdAt and updatedAt automatically
  }
);

// Create indexes for faster queries
ReportSchema.index({ userId: 1, weekStartDate: -1 });
ReportSchema.index({ status: 1 });

// Export the Report model
const Report = models.Report || mongoose.model<IReport>('Report', ReportSchema);
export default Report;