import { useMutation } from '@tanstack/react-query'
import { prepareCarModel, type PrepareCarModelInput } from '@/features/car3d/api/prepareCarModel'

export function usePrepareCarModelMutation() {
  return useMutation({
    mutationKey: ['car-model:prepare'],
    mutationFn: (input: PrepareCarModelInput) => prepareCarModel(input),
  })
}

