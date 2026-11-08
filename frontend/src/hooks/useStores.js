import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query'
import { newsletterService, storeService } from '@/api'
import { qk } from './queryClient'

export const useStores = (params = {}) =>
  useQuery({ queryKey: qk.stores(params), queryFn: () => storeService.list(params), placeholderData: keepPreviousData, staleTime: 5 * 60_000 })

export const useStore = (slug) => useQuery({ queryKey: qk.store(slug), queryFn: () => storeService.get(slug), enabled: Boolean(slug) })

export const useSubscribeNewsletter = () => useMutation({ mutationFn: newsletterService.subscribe })
