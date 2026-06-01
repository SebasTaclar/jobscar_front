export interface WorkshopClient {
  id: number
  name: string
  phone: string
  email: string
  notes?: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface WorkshopClientListData {
  count: number
  clients: WorkshopClient[]
}

export interface CreateWorkshopClientRequest {
  name: string
  phone: string
  email: string
  notes?: string
}

export interface UpdateWorkshopClientRequest {
  name?: string
  phone?: string
  email?: string
  notes?: string | null
  isActive?: boolean
}
