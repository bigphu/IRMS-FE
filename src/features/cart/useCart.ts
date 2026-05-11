import type { CreateOrderPayload } from "../../types/api";
import { submitOrder } from "../../api/order";
import { useMutation } from "@tanstack/react-query";


export const useCart = () => {
  return useMutation({
    mutationKey: ["create-order"],
    mutationFn: (orderInfo: CreateOrderPayload) => submitOrder(orderInfo)
  })
}