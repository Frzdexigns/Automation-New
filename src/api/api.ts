import { supabase } from "./supabaseClient";
import { Product } from "../types";

// Fetch all products from Supabase
export const fetchProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase.from("products").select("*");

  if (error) {
    throw new Error("Failed to fetch products");
  }

  return data;
};

// Add a new product
export const addProduct = async (product: Omit<Product, "id">): Promise<Product> => {
  try {
    // Ensure the user is authenticated before inserting a product
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      throw new Error("User must be logged in to add products.");
    }

    // Insert product into database
    const { data, error } = await supabase
      .from("products")
      .insert([product])
      .select()
      .single();

    if (error) throw new Error(error.message || "Failed to add product.");

    return data;
  } catch (error) {
    console.error("Error adding product:", error);

    // Ensure 'error' is properly typed and handled
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("An unknown error occurred while adding the product.");
    }
  }
};

// Update an existing product
export const updateProduct = async (id: number, updates: Partial<Product>): Promise<Product> => {
  const { data, error } = await supabase
    .from("products")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error("Failed to update product");
  }

  return data;
};

// Delete a product
export const deleteProduct = async (id: number): Promise<void> => {
  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) {
    throw new Error("Failed to delete product");
  }
};