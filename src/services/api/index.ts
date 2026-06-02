// Exportar configuración de API
export * from './apiConfig'

// Exportar servicios
export * from './authService'
export * from './categoryService'
export * from './productService'
export * from './playerService'
export * from './teamService'
export * from './tournamentService'
export * from './paymentService'
export * from './wallpaperService'
export * from './workshopClientService'
export * from './vehicleService'
export * from './workOrderService'
export * from './employeeService'
export * from './appointmentService'

// Exportar tipos comunes
export type { ApiResponse, ApiError } from './apiConfig'
export type { LoginCredentials, LoginResponse, DecodedToken, UserInfo } from './authService'
export type {
  Category,
  CreateCategoryRequest,
  CreateCategoryResponse,
  GetCategoriesResponse,
} from '@/types/CategoryType'
export type {
  Employee,
  EmployeeListData,
  CreateEmployeeRequest,
  UpdateEmployeeRequest,
} from '@/types/EmployeeType'
