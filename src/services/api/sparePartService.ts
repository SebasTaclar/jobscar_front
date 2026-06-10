import { apiClient, type ApiResponse } from './apiConfig'
import type {
  SparePart,
  SparePartListData,
  CreateSparePartRequest,
  UpdateSparePartRequest,
  SparePartFilters,
} from '@/types/SparePartType'

const SPARE_PARTS_ENDPOINT = '/spare-parts'

const normalizeSparePartListData = (data: unknown): SparePartListData => {
  if (Array.isArray(data)) {
    return {
      count: data.length,
      spareParts: data as SparePart[],
    }
  }

  if (data && typeof data === 'object') {
    const responseData = data as Partial<SparePartListData> & { spareParts?: SparePart[] }

    if (Array.isArray(responseData.spareParts)) {
      return {
        count:
          typeof responseData.count === 'number'
            ? responseData.count
            : responseData.spareParts.length,
        spareParts: responseData.spareParts,
      }
    }
  }

  return {
    count: 0,
    spareParts: [],
  }
}

const normalizeSparePart = (data: unknown): SparePart => {
  if (data && typeof data === 'object' && 'sparePart' in data) {
    return (data as { sparePart: SparePart }).sparePart
  }

  return data as SparePart
}

class SparePartService {
  async getAll(filters?: SparePartFilters): Promise<ApiResponse<SparePartListData>> {
    try {
      let endpoint = SPARE_PARTS_ENDPOINT

      if (filters) {
        const queryParams = new URLSearchParams()
        if (filters.workOrderId) queryParams.append('workOrderId', String(filters.workOrderId))
        if (filters.invoiceId) queryParams.append('invoiceId', String(filters.invoiceId))

        const queryString = queryParams.toString()
        if (queryString) endpoint += `?${queryString}`
      }

      const result = await apiClient.get<SparePartListData>(endpoint)
      if (result.data) {
        result.data = normalizeSparePartListData(result.data)
      }
      return result
    } catch (error) {
      console.error('❌ [sparePartService] Error fetching spare parts:', error)
      throw error
    }
  }

  async getById(id: number): Promise<ApiResponse<SparePart>> {
    try {
      const result = await apiClient.get<SparePart>(`${SPARE_PARTS_ENDPOINT}/${id}`)
      if (result.data) {
        result.data = normalizeSparePart(result.data)
      }
      return result
    } catch (error) {
      console.error('❌ [sparePartService] Error fetching spare part by ID:', error)
      throw error
    }
  }

  async create(data: CreateSparePartRequest): Promise<ApiResponse<SparePart>> {
    try {
      const result = await apiClient.post<SparePart>(SPARE_PARTS_ENDPOINT, data)
      if (result.data) {
        result.data = normalizeSparePart(result.data)
      }
      return result
    } catch (error) {
      console.error('❌ [sparePartService] Error creating spare part:', error)
      throw error
    }
  }

  async update(id: number, data: UpdateSparePartRequest): Promise<ApiResponse<SparePart>> {
    try {
      const result = await apiClient.put<SparePart>(`${SPARE_PARTS_ENDPOINT}/${id}`, data)
      if (result.data) {
        result.data = normalizeSparePart(result.data)
      }
      return result
    } catch (error) {
      console.error('❌ [sparePartService] Error updating spare part:', error)
      throw error
    }
  }

  async delete(id: number): Promise<ApiResponse<unknown>> {
    try {
      const result = await apiClient.delete<unknown>(`${SPARE_PARTS_ENDPOINT}/${id}`)
      return result
    } catch (error) {
      console.error('❌ [sparePartService] Error deleting spare part:', error)
      throw error
    }
  }
}

export const sparePartService = new SparePartService()
