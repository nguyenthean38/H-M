import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query'
import { catalogService } from '@/api'
import { qk } from './queryClient'

export const useDepartments = () => useQuery({ queryKey: qk.departments, queryFn: catalogService.departments, staleTime: Infinity })

export const useCategory = (slug) =>
  useQuery({ queryKey: qk.category(slug), queryFn: () => catalogService.category(slug), enabled: Boolean(slug), staleTime: 5 * 60_000 })

export const useProducts = (filters, { enabled = true } = {}) =>
  useQuery({ queryKey: qk.products(filters), queryFn: () => catalogService.products(filters), placeholderData: keepPreviousData, enabled })

export const useProduct = (slug) => useQuery({ queryKey: qk.product(slug), queryFn: () => catalogService.product(slug), enabled: Boolean(slug) })

export const useRecommendations = (id, type = 'similar') =>
  useQuery({ queryKey: qk.recommendations(id, type), queryFn: () => catalogService.recommendations(id, type), enabled: Boolean(id) })

export const useReviews = (id, sort) =>
  useQuery({ queryKey: qk.reviews(id, sort), queryFn: () => catalogService.reviews(id, { sort }), enabled: Boolean(id), placeholderData: keepPreviousData })

export const useAvailability = (id, colorCode, size, { enabled = true } = {}) =>
  useQuery({ queryKey: qk.availability(id, colorCode, size), queryFn: () => catalogService.availability(id, { colorCode, size }), enabled: Boolean(id) && enabled })

export const useSuggestions = (q) =>
  useQuery({ queryKey: qk.suggestions(q), queryFn: () => catalogService.suggestions(q), placeholderData: keepPreviousData, staleTime: 60_000 })

export const useNotifyMe = () => useMutation({ mutationFn: ({ id, ...body }) => catalogService.notifyMe(id, body) })
