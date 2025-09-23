/* eslint-disable @typescript-eslint/no-unused-vars */
// Correct import syntax for TypeScript strict mode
import type { ApiClient, ApiResponse, Unit, SubUnit, Lesson, Exercise } from './types';

// Sample data
const mockUnits: Unit[] = [
  {
    id: 'unit-1',
    title: 'Basic Amharic',
    order: 1,
    description: 'Introduction to Amharic language',
    isPublished: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

const mockSubUnits: SubUnit[] = [];
const mockLessons: Lesson[] = [];
const mockExercises: Exercise[] = [];

// Helper function to simulate network delay
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

  // ===== PLACEHOLDER METHODS =====
  // For now, let's create simple placeholder implementations for the rest
  // We can flesh these out as needed
  
  async updateSubUnit(id: string, subUnitData: Partial<SubUnit>): Promise<ApiResponse<SubUnit>> {
    await simulateDelay();
    return { success: false, error: 'Not implemented yet' };
  }

  async deleteSubUnit(id: string): Promise<ApiResponse<void>> {
    await simulateDelay();
    return { success: false, error: 'Not implemented yet' };
  }

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
    return { success: false, error: 'Not implemented yet' };
  }

  async deleteLesson(id: string): Promise<ApiResponse<void>> {
    await simulateDelay();
    return { success: false, error: 'Not implemented yet' };
  }

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
    return { success: false, error: 'Not implemented yet' };
  }

  async deleteExercise(id: string): Promise<ApiResponse<void>> {
    await simulateDelay();
    return { success: false, error: 'Not implemented yet' };
  }

  async reorderExercises(lessonId: string, exerciseIds: string[]): Promise<ApiResponse<void>> {
    await simulateDelay();
    return { success: false, error: 'Not implemented yet' };
  }
}