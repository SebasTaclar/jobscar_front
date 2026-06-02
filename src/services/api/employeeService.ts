import { apiClient, type ApiResponse } from './apiConfig'
import type {
  Employee,
  EmployeeListData,
  CreateEmployeeRequest,
  UpdateEmployeeRequest,
} from '@/types/EmployeeType'

const normalizeEmployee = (employee: any): Employee => ({
  id: Number(employee?.id ?? 0),
  name: String(employee?.name ?? ''),
  role: String(employee?.role ?? ''),
  specialty: employee?.specialty ? String(employee.specialty) : undefined,
  email: employee?.email ? String(employee.email) : undefined,
  phone: employee?.phone ? String(employee.phone) : undefined,
  status: employee?.status ? String(employee.status) : 'Activo',
  entryDate: employee?.entryDate ? String(employee.entryDate) : undefined,
  notes: employee?.notes ? String(employee.notes) : undefined,
  createdAt: employee?.createdAt ? String(employee.createdAt) : undefined,
  updatedAt: employee?.updatedAt ? String(employee.updatedAt) : undefined,
  activeOrders: typeof employee?.activeOrders === 'number' ? employee.activeOrders : 0,
})

class EmployeeService {
  async getEmployees(params?: { name?: string }): Promise<ApiResponse<EmployeeListData>> {
    try {
      let endpoint = '/employees'

      if (params) {
        const queryParams = new URLSearchParams()
        if (params.name) queryParams.append('name', params.name)
        const queryString = queryParams.toString()
        if (queryString) endpoint += `?${queryString}`
      }

      const result = await apiClient.get<EmployeeListData>(endpoint)
      if (result.data?.employees) {
        result.data.employees = result.data.employees.map(normalizeEmployee)
      }
      return result
    } catch (error) {
      console.error('❌ [employeeService] Error fetching employees:', error)
      throw error
    }
  }

  async getEmployeeById(id: number): Promise<ApiResponse<Employee>> {
    try {
      const result = await apiClient.get<Employee>(`/employees/${id}`)
      if (result.data) {
        result.data = normalizeEmployee(result.data)
      }
      return result
    } catch (error) {
      console.error('❌ [employeeService] Error fetching employee by ID:', error)
      throw error
    }
  }

  async createEmployee(data: CreateEmployeeRequest): Promise<ApiResponse<Employee>> {
    try {
      const result = await apiClient.post<Employee>('/employees', data)
      if (result.data) {
        result.data = normalizeEmployee(result.data)
      }
      return result
    } catch (error) {
      console.error('❌ [employeeService] Error creating employee:', error)
      throw error
    }
  }

  async updateEmployee(id: number, data: UpdateEmployeeRequest): Promise<ApiResponse<Employee>> {
    try {
      const result = await apiClient.put<Employee>(`/employees/${id}`, data)
      if (result.data) {
        result.data = normalizeEmployee(result.data)
      }
      return result
    } catch (error) {
      console.error('❌ [employeeService] Error updating employee:', error)
      throw error
    }
  }

  async deleteEmployee(id: number): Promise<ApiResponse<unknown>> {
    try {
      return await apiClient.delete<unknown>(`/employees/${id}`)
    } catch (error) {
      console.error('❌ [employeeService] Error deleting employee:', error)
      throw error
    }
  }
}

export const employeeService = new EmployeeService()
