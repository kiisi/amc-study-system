import { z } from "zod";

// User Schema
export const userSchema = z.object({
  _id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  password: z.string(),
  isAdmin: z.boolean().default(false),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const insertUserSchema = userSchema.omit({ 
  _id: true, 
  createdAt: true, 
  updatedAt: true 
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const registerSchema = insertUserSchema.extend({
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Question Schema
export const questionSchema = z.object({
  _id: z.string(),
  questionText: z.string(),
  options: z.array(z.object({
    letter: z.enum(['A', 'B', 'C', 'D', 'E']),
    text: z.string(),
  })),
  correctAnswer: z.enum(['A', 'B', 'C', 'D', 'E']),
  explanation: z.string(),
  subject: z.string(),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']),
  images: z.array(z.string()).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const insertQuestionSchema = questionSchema.omit({ 
  _id: true, 
  createdAt: true, 
  updatedAt: true 
});

// User Answer Schema
export const userAnswerSchema = z.object({
  _id: z.string(),
  userId: z.string(),
  questionId: z.string(),
  selectedAnswer: z.enum(['A', 'B', 'C', 'D', 'E']),
  isCorrect: z.boolean(),
  timeSpent: z.number(),
  sessionId: z.string(),
  createdAt: z.date(),
});

export const insertUserAnswerSchema = userAnswerSchema.omit({ 
  _id: true, 
  createdAt: true 
});

// Study Session Schema
export const studySessionSchema = z.object({
  _id: z.string(),
  userId: z.string(),
  type: z.enum(['practice', 'exam', 'subject', 'bookmark']),
  questionIds: z.array(z.string()),
  subject: z.string().optional(),
  startTime: z.date(),
  endTime: z.date().optional(),
  score: z.number().optional(),
  totalQuestions: z.number(),
  correctAnswers: z.number().optional(),
  timeLimit: z.number().optional(), // in minutes
  completed: z.boolean().default(false),
});

export const insertStudySessionSchema = studySessionSchema.omit({ 
  _id: true 
});

// Bookmark Schema
export const bookmarkSchema = z.object({
  _id: z.string(),
  userId: z.string(),
  questionId: z.string(),
  createdAt: z.date(),
});

export const insertBookmarkSchema = bookmarkSchema.omit({ 
  _id: true, 
  createdAt: true 
});

// Progress Schema
export const progressSchema = z.object({
  _id: z.string(),
  userId: z.string(),
  subject: z.string(),
  totalAttempted: z.number(),
  correctAnswers: z.number(),
  accuracy: z.number(),
  lastUpdated: z.date(),
});

export const insertProgressSchema = progressSchema.omit({ 
  _id: true 
});

// Types
export type User = z.infer<typeof userSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type LoginData = z.infer<typeof loginSchema>;
export type RegisterData = z.infer<typeof registerSchema>;

export type Question = z.infer<typeof questionSchema>;
export type InsertQuestion = z.infer<typeof insertQuestionSchema>;

export type UserAnswer = z.infer<typeof userAnswerSchema>;
export type InsertUserAnswer = z.infer<typeof insertUserAnswerSchema>;

export type StudySession = z.infer<typeof studySessionSchema>;
export type InsertStudySession = z.infer<typeof insertStudySessionSchema>;

export type Bookmark = z.infer<typeof bookmarkSchema>;
export type InsertBookmark = z.infer<typeof insertBookmarkSchema>;

export type Progress = z.infer<typeof progressSchema>;
export type InsertProgress = z.infer<typeof insertProgressSchema>;

export const subjects = [
  'Internal Medicine',
  'Surgery', 
  'Pediatrics',
  'Obstetrics & Gynecology',
  'Psychiatry',
  'Emergency Medicine',
  'Radiology',
  'Pathology',
  'Cardiology',
  'Neurology',
  'Dermatology',
  'Ophthalmology',
  'Orthopedics',
  'Anesthesiology',
  'Family Medicine'
] as const;
