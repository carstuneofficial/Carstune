import { useMutation } from '@tanstack/react-query'
import { recognizeCar, type RecognizeCarInput } from '@/features/recognition/api/recognizeCar'

export function useRecognizeCarMutation() {
  return useMutation({
    mutationKey: ['recognize-car'],
    mutationFn: (input: RecognizeCarInput) => recognizeCar(input),
  })
}

