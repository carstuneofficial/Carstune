import { useMutation } from '@tanstack/react-query'
import { createScanSession, type CreateScanSessionInput } from '@/features/scan/api/createScanSession'

export function useCreateScanSessionMutation() {
  return useMutation({
    mutationKey: ['scan-session:create'],
    mutationFn: (input: CreateScanSessionInput) => createScanSession(input),
  })
}

