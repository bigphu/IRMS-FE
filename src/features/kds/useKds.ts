import { useQuery, useMutation } from "@tanstack/react-query";
import { 
  getKdsQueue, 
  getKdsAlerts, 
  startCookingItem, 
  markItemReady, 
  completeItem 
} from "../../api/kds";
import { queryClient } from "../../query";

// --- QUERIES ---

export const useKdsQueue = (isChef: boolean) => {
  return useQuery({
    queryKey: ["kdsQueue", isChef], 
    queryFn: () => getKdsQueue(!isChef),
    refetchOnWindowFocus: true,
  });
};

export const useKdsAlerts = () => {
  return useQuery({
    queryKey: ["kdsAlerts"],
    queryFn: () => getKdsAlerts(),
    refetchOnWindowFocus: true, 
  });
};

// --- MUTATIONS ---

export const useKdsMutations = () => {
  const refreshQueue = () => {
    queryClient.invalidateQueries({ queryKey: ["kdsQueue"] });
    queryClient.invalidateQueries({ queryKey: ["kdsAlerts"] });
  };

  const startMutation = useMutation({
    mutationFn: ({ orderId, itemId }: { orderId: number; itemId: number }) => 
      startCookingItem(orderId, itemId),
      onSuccess: () => refreshQueue(), // Refetch queue to get updated statuses
  });

  const readyMutation = useMutation({
    mutationFn: ({ orderId, itemId }: { orderId: number; itemId: number }) => 
      markItemReady(orderId, itemId),
      onSuccess: () => refreshQueue(), // Refetch queue to get updated statuses 
  });

  const completeMutation = useMutation({
    mutationFn: ({ orderId, itemId }: { orderId: number; itemId: number }) => 
      completeItem(orderId, itemId),
      onSuccess: () => refreshQueue(), // Refetch queue to get updated statuses
  });

  return { startMutation, readyMutation, completeMutation };
};