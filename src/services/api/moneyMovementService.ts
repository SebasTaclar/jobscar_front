import { apiClient, type ApiResponse } from './apiConfig'
import type {
  MoneyMovement,
  MoneyMovementListData,
  CreateMoneyMovementRequest,
  UpdateMoneyMovementRequest,
  MoneyMovementFilters,
} from '@/types/MoneyMovementType'

const MONEY_MOVEMENTS_ENDPOINT = '/money-movements'

const normalizeMoneyMovementListData = (data: unknown): MoneyMovementListData => {
  if (Array.isArray(data)) {
    return {
      count: data.length,
      moneyMovements: data as MoneyMovement[],
    }
  }

  if (data && typeof data === 'object') {
    const responseData = data as Partial<MoneyMovementListData> & { moneyMovements?: MoneyMovement[] }

    if (Array.isArray(responseData.moneyMovements)) {
      return {
        count:
          typeof responseData.count === 'number'
            ? responseData.count
            : responseData.moneyMovements.length,
        moneyMovements: responseData.moneyMovements,
      }
    }
  }

  return {
    count: 0,
    moneyMovements: [],
  }
}

const normalizeMoneyMovement = (data: unknown): MoneyMovement => {
  if (data && typeof data === 'object' && 'moneyMovement' in data) {
    return (data as { moneyMovement: MoneyMovement }).moneyMovement
  }

  return data as MoneyMovement
}

class MoneyMovementService {
  async getAll(filters?: MoneyMovementFilters): Promise<ApiResponse<MoneyMovementListData>> {
    try {
      let endpoint = MONEY_MOVEMENTS_ENDPOINT

      if (filters) {
        const queryParams = new URLSearchParams()
        if (filters.movement) queryParams.append('movement', filters.movement)
        if (filters.account) queryParams.append('account', filters.account)
        if (filters.name) queryParams.append('name', filters.name)

        const queryString = queryParams.toString()
        if (queryString) endpoint += `?${queryString}`
      }

      const result = await apiClient.get<MoneyMovementListData>(endpoint)
      if (result.data) {
        result.data = normalizeMoneyMovementListData(result.data)
      }
      return result
    } catch (error) {
      console.error('❌ [moneyMovementService] Error fetching money movements:', error)
      throw error
    }
  }

  async getById(id: number): Promise<ApiResponse<MoneyMovement>> {
    try {
      const result = await apiClient.get<MoneyMovement>(`${MONEY_MOVEMENTS_ENDPOINT}/${id}`)
      if (result.data) {
        result.data = normalizeMoneyMovement(result.data)
      }
      return result
    } catch (error) {
      console.error('❌ [moneyMovementService] Error fetching money movement by ID:', error)
      throw error
    }
  }

  async create(data: CreateMoneyMovementRequest): Promise<ApiResponse<MoneyMovement>> {
    try {
      const result = await apiClient.post<MoneyMovement>(MONEY_MOVEMENTS_ENDPOINT, data)
      if (result.data) {
        result.data = normalizeMoneyMovement(result.data)
      }
      return result
    } catch (error) {
      console.error('❌ [moneyMovementService] Error creating money movement:', error)
      throw error
    }
  }

  async update(id: number, data: UpdateMoneyMovementRequest): Promise<ApiResponse<MoneyMovement>> {
    try {
      const result = await apiClient.put<MoneyMovement>(`${MONEY_MOVEMENTS_ENDPOINT}/${id}`, data)
      if (result.data) {
        result.data = normalizeMoneyMovement(result.data)
      }
      return result
    } catch (error) {
      console.error('❌ [moneyMovementService] Error updating money movement:', error)
      throw error
    }
  }

  async delete(id: number): Promise<ApiResponse<unknown>> {
    try {
      const result = await apiClient.delete<unknown>(`${MONEY_MOVEMENTS_ENDPOINT}/${id}`)
      return result
    } catch (error) {
      console.error('❌ [moneyMovementService] Error deleting money movement:', error)
      throw error
    }
  }
}

export const moneyMovementService = new MoneyMovementService()
