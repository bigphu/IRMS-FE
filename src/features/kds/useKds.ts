import { useQuery, useMutation } from "@tanstack/react-query";
import { 
  getKdsQueue, 
  getKdsAlerts, 
  startCookingItem, 
  markItemReady, 
  completeItem 
} from "../../api/kds";

// --- QUERIES ---

export const useKdsQueue = () => {
  return useQuery({
    queryKey: ["kdsQueue"],
    queryFn: getKdsQueue,
    // Optional: Refetch full queue silently in background when user returns to app
    refetchOnWindowFocus: true, 
  });
};

export const useKdsAlerts = () => {
  return useQuery({
    queryKey: ["kdsAlerts"],
    queryFn: getKdsAlerts,
    refetchOnWindowFocus: true, 
  });
};

// --- MUTATIONS ---

export const useKdsMutations = () => {
  // const queryClient = useQueryClient();

  const startMutation = useMutation({
    mutationFn: ({ orderId, itemId }: { orderId: number; itemId: number }) => 
      startCookingItem(orderId, itemId),
  });

  const readyMutation = useMutation({
    mutationFn: ({ orderId, itemId }: { orderId: number; itemId: number }) => 
      markItemReady(orderId, itemId),
  });

  const completeMutation = useMutation({
    mutationFn: ({ orderId, itemId }: { orderId: number; itemId: number }) => 
      completeItem(orderId, itemId),
  });

  return { startMutation, readyMutation, completeMutation };
};