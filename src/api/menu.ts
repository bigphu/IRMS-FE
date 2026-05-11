import { apiClient } from "./client";
import type { DishCategory } from "../types/api";

export async function fetchMenu() {
  const { data, error } = await apiClient.GET("/menu/all", {
    params: {
      query: {
        availableOnly: true,
      }
    }
  });

  if (error) {
    throw(error);
  }

  return data?.data || [];
}

export async function fetchMenuByCategory(category: DishCategory) {
  const { data, error } = await apiClient.GET("/menu/items-by-category/{category}", {
    params: {
      path: {
        category: category
      },
      query: {
        availableOnly: true
      }
    }
  });

  if (error) {
    throw(error);
  }

  return data?.data || [];
}