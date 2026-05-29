import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Reservation, DropOffRecord, PickupStatus, ContactFormSubmission, ServicePricing, UserProfile, UserRole } from '@/backend';

// User profile queries
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// User role queries
export function useGetCallerUserRole() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserRole>({
    queryKey: ['currentUserRole'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserRole();
    },
    enabled: !!actor && !actorFetching,
    retry: 1,
    retryDelay: 1000,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
  };
}

// Reservation queries
export function useGetReservation(id: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Reservation | null>({
    queryKey: ['reservation', id],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getReservation(id);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useGetAllReservations() {
  const { actor, isFetching } = useActor();

  return useQuery<Reservation[]>({
    queryKey: ['reservations'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAllReservations();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateReservation() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reservation: Reservation) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createReservation(reservation);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservation'] });
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
    },
  });
}

export function useUpdateReservationStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status, notes }: { id: string; status: string; notes: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateReservationStatus(id, status, notes);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
    },
  });
}

// Drop-off queries
export function useGetDropOffRecord(reservationId: string) {
  const { actor, isFetching } = useActor();

  return useQuery<DropOffRecord | null>({
    queryKey: ['dropoff', reservationId],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getDropOffRecord(reservationId);
    },
    enabled: !!actor && !isFetching && !!reservationId,
  });
}

export function useGetAllDropOffRecords() {
  const { actor, isFetching } = useActor();

  return useQuery<DropOffRecord[]>({
    queryKey: ['dropoffs'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAllDropOffRecords();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateDropOffRecord() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (record: DropOffRecord) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createDropOffRecord(record);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dropoff'] });
      queryClient.invalidateQueries({ queryKey: ['dropoffs'] });
    },
  });
}

export function useVerifyDropOff() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ reservationId, verified }: { reservationId: string; verified: boolean }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.verifyDropOff(reservationId, verified);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dropoffs'] });
    },
  });
}

// Pickup queries
export function useGetPickupStatus(reservationId: string) {
  const { actor, isFetching } = useActor();

  return useQuery<PickupStatus | null>({
    queryKey: ['pickup', reservationId],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getPickupStatus(reservationId);
    },
    enabled: !!actor && !isFetching && !!reservationId,
  });
}

export function useGetAllPickupStatuses() {
  const { actor, isFetching } = useActor();

  return useQuery<PickupStatus[]>({
    queryKey: ['pickups'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAllPickupStatuses();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdatePickupStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (status: PickupStatus) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updatePickupStatus(status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pickups'] });
    },
  });
}

// Contact form queries
export function useSubmitContactForm() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (form: ContactFormSubmission) => {
      if (!actor) throw new Error('Actor not available');
      return actor.submitContactForm(form);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact'] });
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
  });
}

export function useGetAllContactForms() {
  const { actor, isFetching } = useActor();

  return useQuery<ContactFormSubmission[]>({
    queryKey: ['contacts'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAllContactForms();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useMarkContactFormHandled() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.markContactFormHandled(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
  });
}

// Pricing queries
export function useGetServicePricing() {
  const { actor, isFetching } = useActor();

  return useQuery<ServicePricing | null>({
    queryKey: ['pricing'],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getServicePricing();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateServicePricing() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (pricing: ServicePricing) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateServicePricing(pricing);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pricing'] });
    },
  });
}
