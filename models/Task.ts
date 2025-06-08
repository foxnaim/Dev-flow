import mongoose, { Schema, Document } from 'mongoose';

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface ITask extends Document {
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: Date;
  documentationLink?: string;
  userId: mongoose.Types.ObjectId;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    status: {
      type: String,
      enum: ['TODO', 'IN_PROGRESS', 'DONE'],
      default: 'TODO',
    },
    priority: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH'],
      default: 'MEDIUM',
    },
    dueDate: { type: Date },
    documentationLink: { type: String },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

// Обновляем updatedAt перед каждым сохранением
TaskSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

const Task = mongoose.models.Task || mongoose.model<ITask>('Task', TaskSchema);

export default Task; 
