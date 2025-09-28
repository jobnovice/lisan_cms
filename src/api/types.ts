/* eslint-disable @typescript-eslint/no-explicit-any */
// All type definitions in one place
export interface BaseEntity {
  id: string;
  title: string; 
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface Unit extends BaseEntity {
  description?: string;
  thumbnailUrl?: string;
  isPublished: boolean;
  subUnits: SubUnit[];
}

export interface SubUnit extends BaseEntity {
  unitId: string;
  estimatedTotalTime: number;
  theme: string;
}

export interface Lesson extends BaseEntity {
  unitId: string;
  subUnitId: string; 
  estimatedTime: number;
  objectives: string[];
}

export type ExerciseType = 'vocabulary' | 'grammar' | 'conversation' | 'listening' | 'writing';

export interface Exercise extends BaseEntity {
  unitId: string;
  subUnitId: string;
  lessonId: string;
  type: ExerciseType;
  instruction: string;
  content: any;
  hints?: string;
}

// API response format
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// API client interface
export interface ApiClient {
  // Unit operations
  getUnits(): Promise<ApiResponse<Unit[]>>;
  getUnit(id: string): Promise<ApiResponse<Unit>>;
  createUnit(unit: Omit<Unit, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Unit>>;
  updateUnit(id: string, unit: Partial<Unit>): Promise<ApiResponse<Unit>>;
  deleteUnit(id: string): Promise<ApiResponse<void>>;

  // SubUnit operations
  getSubUnits(unitId: string): Promise<ApiResponse<SubUnit[]>>;
  getSubUnit(id: string): Promise<ApiResponse<SubUnit>>;
  createSubUnit(subUnit: Omit<SubUnit, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<SubUnit>>;
  updateSubUnit(id: string, subUnit: Partial<SubUnit>): Promise<ApiResponse<SubUnit>>;
  deleteSubUnit(id: string): Promise<ApiResponse<void>>;

  // Lesson operations
  getLessons(subUnitId: string): Promise<ApiResponse<Lesson[]>>;
  getLesson(id: string): Promise<ApiResponse<Lesson>>;
  createLesson(lesson: Omit<Lesson, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Lesson>>;
  updateLesson(id: string, lesson: Partial<Lesson>): Promise<ApiResponse<Lesson>>;
  deleteLesson(id: string): Promise<ApiResponse<void>>;

  // Exercise operations
  getExercises(lessonId: string): Promise<ApiResponse<Exercise[]>>;
  getExercise(id: string): Promise<ApiResponse<Exercise>>;
  createExercise(exercise: Omit<Exercise, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Exercise>>;
  updateExercise(id: string, exercise: Partial<Exercise>): Promise<ApiResponse<Exercise>>;
  deleteExercise(id: string): Promise<ApiResponse<void>>;
  reorderExercises(lessonId: string, exerciseIds: string[]): Promise<ApiResponse<void>>;
}



// Adapter (when needed)
// export const exerciseAdapter = {
//   fromBackend: (backendData: any): Exercise => ({
//     id: backendData._id || backendData.id,
//     title: backendData.exerciseTitle || backendData.title,
//     // ... field mappings
//   }),
  
//   toBackend: (frontendData: Exercise): any => ({
//     _id: frontendData.id,
//     exerciseTitle: frontendData.title,
//     // ... reverse mappings
//   })
// };