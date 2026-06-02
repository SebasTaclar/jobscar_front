import { apiClient, type ApiResponse } from './apiConfig'
import type {
  Appointment,
  AppointmentListData,
  CreateAppointmentRequest,
  UpdateAppointmentRequest,
} from '@/types/AppointmentType'

const APPOINTMENTS_ENDPOINT = '/appointments'

const normalizeAppointmentListData = (data: unknown): AppointmentListData => {
  if (Array.isArray(data)) {
    return {
      count: data.length,
      appointments: data as Appointment[],
    }
  }

  if (data && typeof data === 'object') {
    const responseData = data as Partial<AppointmentListData> & { appointments?: Appointment[] }

    if (Array.isArray(responseData.appointments)) {
      return {
        count:
          typeof responseData.count === 'number'
            ? responseData.count
            : responseData.appointments.length,
        appointments: responseData.appointments,
      }
    }
  }

  return {
    count: 0,
    appointments: [],
  }
}

const normalizeAppointment = (data: unknown): Appointment => {
  if (data && typeof data === 'object' && 'appointment' in data) {
    return (data as { appointment: Appointment }).appointment
  }

  return data as Appointment
}

class AppointmentService {
  async getAppointments(): Promise<ApiResponse<AppointmentListData>> {
    try {
      const result = await apiClient.get<AppointmentListData>(APPOINTMENTS_ENDPOINT)
      if (result.data) {
        result.data = normalizeAppointmentListData(result.data)
      }
      return result
    } catch (error) {
      console.error('❌ [appointmentService] Error fetching appointments:', error)
      throw error
    }
  }

  async getAppointmentById(id: number): Promise<ApiResponse<Appointment>> {
    try {
      const result = await apiClient.get<Appointment>(`${APPOINTMENTS_ENDPOINT}/${id}`)
      if (result.data) {
        result.data = normalizeAppointment(result.data)
      }
      return result
    } catch (error) {
      console.error('❌ [appointmentService] Error fetching appointment by ID:', error)
      throw error
    }
  }

  async createAppointment(data: CreateAppointmentRequest): Promise<ApiResponse<Appointment>> {
    try {
      const result = await apiClient.post<Appointment>(APPOINTMENTS_ENDPOINT, data)
      if (result.data) {
        result.data = normalizeAppointment(result.data)
      }
      return result
    } catch (error) {
      console.error('❌ [appointmentService] Error creating appointment:', error)
      throw error
    }
  }

  async updateAppointment(
    id: number,
    data: UpdateAppointmentRequest,
  ): Promise<ApiResponse<Appointment>> {
    try {
      const result = await apiClient.put<Appointment>(`${APPOINTMENTS_ENDPOINT}/${id}`, data)
      if (result.data) {
        result.data = normalizeAppointment(result.data)
      }
      return result
    } catch (error) {
      console.error('❌ [appointmentService] Error updating appointment:', error)
      throw error
    }
  }

  async deleteAppointment(id: number): Promise<ApiResponse<unknown>> {
    try {
      const result = await apiClient.delete<unknown>(`${APPOINTMENTS_ENDPOINT}/${id}`)
      return result
    } catch (error) {
      console.error('❌ [appointmentService] Error deleting appointment:', error)
      throw error
    }
  }
}

export const appointmentService = new AppointmentService()
