export interface Appointment {
  id: number
  date: string
  plate: string
  client: string
  subject: string
  createdAt: string
  updatedAt: string
}

export interface AppointmentListData {
  count: number
  appointments: Appointment[]
}

export interface CreateAppointmentRequest {
  date: string
  plate: string
  client: string
  subject: string
}

export interface UpdateAppointmentRequest {
  date?: string
  plate?: string
  client?: string
  subject?: string
}
