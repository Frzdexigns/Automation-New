import { supabase } from "./supabaseClient";
import { Product } from "../types";
import { useAuthStore } from "../store/authStore";

// Introduce artificial delay for performance_glitch_user
const getDelay = () => {
  const user = useAuthStore.getState().user;
  return user?.type === "performance_glitch" ? 2000 : 0;
};

const { data: session } = await supabase.auth.getSession();
console.log("Session Data:", session);

if (!session?.session) {
  console.error("No session found, trying to refresh...");
  await supabase.auth.refreshSession(); // Forces a refresh
}


// Fetch all products from Supabase
export const fetchProducts = async (): Promise<Product[]> => {
  return new Promise(async (resolve, reject) => {
    setTimeout(async () => {
      const { data, error } = await supabase.from("products").select("*");

      if (error) {
        reject(new Error("Failed to fetch products"));
        return;
      }

      const user = useAuthStore.getState().user;

      if (user?.type === "visual") {
        resolve(
          data.map((product) => ({
            ...product,
            image:
              "https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=764&q=80",
          }))
        );
      } else {
        resolve(data);
      }
    }, getDelay());
  });
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
  return new Promise(async (resolve, reject) => {
    setTimeout(async () => {
      const { data, error } = await supabase.from("products").update(updates).eq("id", id).select().single();

      if (error) {
        reject(new Error("Failed to update product"));
        return;
      }

      resolve(data);
    }, getDelay());
  });
};

// Delete a product
export const deleteProduct = async (id: number): Promise<void> => {
  return new Promise(async (resolve, reject) => {
    setTimeout(async () => {
      const { error } = await supabase.from("products").delete().eq("id", id);

      if (error) {
        reject(new Error("Failed to delete product"));
        return;
      }

      resolve();
    }, getDelay());
  });
};
