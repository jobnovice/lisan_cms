/* eslint-disable @typescript-eslint/no-unused-vars */

import type { ApiClient, ApiResponse, Unit, SubUnit, Lesson, Exercise } from './types';

// Sample data with theme field
const mockUnits: Unit[] = [
  {
    id: 'unit-1',
    title: 'Basic Amharic',
    order: 1,
    description: 'Introduction to Amharic language',
    isPublished: true,
	subUnits: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

const mockSubUnits: SubUnit[] = [
//   {
//     id: 'subunit-1',
//     unitId: 'unit-1',
//     title: 'Greetings and Introductions',
//     theme: 'Greetings',
//     order: 1,
//     estimatedTotalTime: 120,
//     createdAt: new Date().toISOString(),
//     updatedAt: new Date().toISOString(),
//   },
//   {
//     id: 'subunit-2', 
//     unitId: 'unit-1',
//     title: 'Formal Conversations',
//     theme: 'Conversations',
//     order: 2,
//     estimatedTotalTime: 90,
//     createdAt: new Date().toISOString(),
//     updatedAt: new Date().toISOString(),
//   }
];

const mockLessons: Lesson[] = [
  {
    id: 'lesson-1',
    unitId: 'unit-1',
    subUnitId: 'subunit-1',
    title: 'Basic Greetings',
    order: 1,
    estimatedTime: 30,
    objectives: ['Learn basic greetings', 'Practice pronunciation'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

const mockExercises: Exercise[] = [
  {
    id: 'exercise-1',
    unitId: 'unit-1',
    subUnitId: 'subunit-1', 
    lessonId: 'lesson-1',
    title: 'Hello and Goodbye',
    order: 1,
    type: 'vocabulary',
    instruction: 'Translate the English greetings to Amharic',
    content: {
      prompt: 'Hello',
      correctAnswer: 'ሰላም'
    },
    hints: 'Remember the formal greeting',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

// simple simulattion of network delay(not needed but,)
const simulateDelay = (): Promise<void> => 
  new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 700));

// Mock API client implementation
export class MockApiClient implements ApiClient {
  // ===== UNIT OPERATIONS =====
  async getUnits(): Promise<ApiResponse<Unit[]>> {
    await simulateDelay();
    return { success: true, data: [...mockUnits] };
  }

  async getUnit(id: string): Promise<ApiResponse<Unit>> {
    await simulateDelay();
    const unit = mockUnits.find(u => u.id === id);
    if (!unit) {
      return { success: false, error: 'Unit not found' };
    }
    return { success: true, data: { ...unit } };
  }

  async createUnit(unitData: Omit<Unit, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Unit>> {
    await simulateDelay();
    
    const newUnit: Unit = {
      ...unitData,
      id: `unit-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    mockUnits.push(newUnit);
    return { success: true, data: newUnit };
  }

  async updateUnit(id: string, unitData: Partial<Unit>): Promise<ApiResponse<Unit>> {
    await simulateDelay();
    
    const index = mockUnits.findIndex(u => u.id === id);
    if (index === -1) {
      return { success: false, error: 'Unit not found' };
    }
    
    mockUnits[index] = {
      ...mockUnits[index],
      ...unitData,
      updatedAt: new Date().toISOString(),
    };
    
    return { success: true, data: { ...mockUnits[index] } };
  }

  async deleteUnit(id: string): Promise<ApiResponse<void>> {
    await simulateDelay();
    
    const index = mockUnits.findIndex(u => u.id === id);
    if (index === -1) {
      return { success: false, error: 'Unit not found' };
    }
    
    mockUnits.splice(index, 1);
    return { success: true };
  }

  // ===== SUBUNIT OPERATIONS =====
  async getSubUnits(unitId: string): Promise<ApiResponse<SubUnit[]>> {
    await simulateDelay();
    const subunits = mockSubUnits.filter(s => s.unitId === unitId);
    return { success: true, data: [...subunits] };
  }

  async getSubUnit(id: string): Promise<ApiResponse<SubUnit>> {
    await simulateDelay();
    const subunit = mockSubUnits.find(s => s.id === id);
    if (!subunit) {
      return { success: false, error: 'SubUnit not found' };
    }
    return { success: true, data: { ...subunit } };
  }

  async createSubUnit(subUnitData: Omit<SubUnit, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<SubUnit>> {
    await simulateDelay();
    
    const newSubUnit: SubUnit = {
      ...subUnitData,
      id: `subunit-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    mockSubUnits.push(newSubUnit);
    return { success: true, data: newSubUnit };
  }

  async updateSubUnit(id: string, subUnitData: Partial<SubUnit>): Promise<ApiResponse<SubUnit>> {
    await simulateDelay();
    
    const index = mockSubUnits.findIndex(s => s.id === id);
    if (index === -1) {
      return { success: false, error: 'SubUnit not found' };
    }
    
    mockSubUnits[index] = {
      ...mockSubUnits[index],
      ...subUnitData,
      updatedAt: new Date().toISOString(),
    };
    
    return { success: true, data: { ...mockSubUnits[index] } };
  }

  async deleteSubUnit(id: string): Promise<ApiResponse<void>> {
    await simulateDelay();
    
    const index = mockSubUnits.findIndex(s => s.id === id);
    if (index === -1) {
      return { success: false, error: 'SubUnit not found' };
    }
    
    mockSubUnits.splice(index, 1);
    return { success: true };
  }

  // ===== LESSON OPERATIONS =====
  async getLessons(subUnitId: string): Promise<ApiResponse<Lesson[]>> {
    await simulateDelay();
    const lessons = mockLessons.filter(l => l.subUnitId === subUnitId);
    return { success: true, data: [...lessons] };
  }

  async getLesson(id: string): Promise<ApiResponse<Lesson>> {
    await simulateDelay();
    const lesson = mockLessons.find(l => l.id === id);
    if (!lesson) {
      return { success: false, error: 'Lesson not found' };
    }
    return { success: true, data: { ...lesson } };
  }

  async createLesson(lessonData: Omit<Lesson, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Lesson>> {
    await simulateDelay();
    
    const newLesson: Lesson = {
      ...lessonData,
      id: `lesson-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    mockLessons.push(newLesson);
    return { success: true, data: newLesson };
  }

  async updateLesson(id: string, lessonData: Partial<Lesson>): Promise<ApiResponse<Lesson>> {
    await simulateDelay();
    
    const index = mockLessons.findIndex(l => l.id === id);
    if (index === -1) {
      return { success: false, error: 'Lesson not found' };
    }
    
    mockLessons[index] = {
      ...mockLessons[index],
      ...lessonData,
      updatedAt: new Date().toISOString(),
    };
    
    return { success: true, data: { ...mockLessons[index] } };
  }

  async deleteLesson(id: string): Promise<ApiResponse<void>> {
    await simulateDelay();
    
    const index = mockLessons.findIndex(l => l.id === id);
    if (index === -1) {
      return { success: false, error: 'Lesson not found' };
    }
    
    mockLessons.splice(index, 1);
    return { success: true };
  }

  // ===== EXERCISE OPERATIONS =====
  async getExercises(lessonId: string): Promise<ApiResponse<Exercise[]>> {
    await simulateDelay();
    const exercises = mockExercises.filter(e => e.lessonId === lessonId);
    return { success: true, data: [...exercises] };
  }

  async getExercise(id: string): Promise<ApiResponse<Exercise>> {
    await simulateDelay();
    const exercise = mockExercises.find(e => e.id === id);
    if (!exercise) {
      return { success: false, error: 'Exercise not found' };
    }
    return { success: true, data: { ...exercise } };
  }

  async createExercise(exerciseData: Omit<Exercise, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Exercise>> {
    await simulateDelay();
    
    const newExercise: Exercise = {
      ...exerciseData,
      id: `exercise-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    mockExercises.push(newExercise);
    return { success: true, data: newExercise };
  }

  async updateExercise(id: string, exerciseData: Partial<Exercise>): Promise<ApiResponse<Exercise>> {
    await simulateDelay();
    
    const index = mockExercises.findIndex(e => e.id === id);
    if (index === -1) {
      return { success: false, error: 'Exercise not found' };
    }
    
    mockExercises[index] = {
      ...mockExercises[index],
      ...exerciseData,
      updatedAt: new Date().toISOString(),
    };
    
    return { success: true, data: { ...mockExercises[index] } };
  }

  async deleteExercise(id: string): Promise<ApiResponse<void>> {
    await simulateDelay();
    
    const index = mockExercises.findIndex(e => e.id === id);
    if (index === -1) {
      return { success: false, error: 'Exercise not found' };
    }
    
    mockExercises.splice(index, 1);
    return { success: true };
  }

  async reorderExercises(lessonId: string, exerciseIds: string[]): Promise<ApiResponse<void>> {
    await simulateDelay();
    
    // Validate that all exercise IDs belong to the lesson
    const lessonExercises = mockExercises.filter(e => e.lessonId === lessonId);
    const validExerciseIds = lessonExercises.map(e => e.id);
    
    const invalidIds = exerciseIds.filter(id => !validExerciseIds.includes(id));
    if (invalidIds.length > 0) {
      return { success: false, error: `Invalid exercise IDs: ${invalidIds.join(', ')}` };
    }
    
    // Update the order of exercises
    exerciseIds.forEach((exerciseId, index) => {
      const exerciseIndex = mockExercises.findIndex(e => e.id === exerciseId);
      if (exerciseIndex !== -1) {
        mockExercises[exerciseIndex] = {
          ...mockExercises[exerciseIndex],
          order: index + 1,
          updatedAt: new Date().toISOString(),
        };
      }
    });
    
    return { success: true };
  }
}

export const apiService = new MockApiClient();