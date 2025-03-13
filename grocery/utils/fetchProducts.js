import { collection, doc, getDoc, getDocs, query, where, limit } from "firebase/firestore";
import { db } from "../firebase";

// Fetch all special sections and their products
export const fetchAllSpecialSections = async () => {
    try {
        const sectionsRef = collection(db, "special_sections");
        const snapshot = await getDocs(sectionsRef);

        if (snapshot.empty) {
            console.log("No special sections found!");
            return [];
        }

        // Convert all documents into an array
        const sectionPromises = snapshot.docs.map(async (docSnap) => {
            const sectionData = docSnap.data();
            const productRefs = sectionData.products || [];

            // Fetch product details using references
            const productPromises = productRefs.map(async (productRef) => {
                if (!productRef) return null; // Handle invalid reference
                const productSnap = await getDoc(productRef);
                return productSnap.exists() ? { id: productSnap.id, ...productSnap.data() } : null;
            });

            const products = await Promise.all(productPromises);

            return {
                id: docSnap.id,
                name: sectionData.name || docSnap.id, // Default name if missing
                products: products.filter((product) => product !== null), // Filter out null values
            };
        });

        const sections = await Promise.all(sectionPromises);
        return sections;
    } catch (error) {
        console.error("Error fetching special sections:", error);
        return [];
    }
};

// Function to fetch product details by ID
export const fetchProductDetails = async (productId) => {
    try {
        const productRef = doc(db, "products", productId);
        const productSnap = await getDoc(productRef);

        if (productSnap.exists()) {
            return { id: productSnap.id, ...productSnap.data() };
        } else {
            console.log("No such product found!");
            return null;
        }
    } catch (error) {
        console.error("Error fetching product:", error);
        return null;
    }
};

// 🔹 Fetch all categories from Firestore and resolve product references
export const fetchCategories = async () => {
    try {
        const categoriesRef = collection(db, "categories");
        const snapshot = await getDocs(categoriesRef);

        // 🔹 Convert Firestore documents into an array
        const categories = snapshot.docs.map(docSnap => ({
            id: docSnap.id,
            ...docSnap.data()
        }));

        // 🔹 Resolve product references for each category
        const categoryPromises = categories.map(async (category) => {
            const productRefs = category.products || [];

            // 🔹 Convert product references into real product objects
            const productPromises = productRefs.map(async (productRef) => {
                if (!productRef || typeof productRef.id !== "string") return null;
                return await fetchProductDetails(productRef.id); // Fetch product details
            });

            const products = await Promise.all(productPromises);
            return { ...category, products: products.filter(p => p !== null) }; // Remove null values
        });

        return await Promise.all(categoryPromises);
    } catch (error) {
        console.error("Error fetching categories:", error);
        return [];
    }
};

// Fetch products by category (Uses product references)
export const fetchProductsByCategoryOrSection = async (id, type) => {
    try {
        // Determine Firestore collection based on `type`
        const collectionName = type === "special_section" ? "special_sections" : "categories";
        const ref = doc(db, collectionName, id);
        const snap = await getDoc(ref);

        if (!snap.exists()) {
            console.log(`${type} not found!`);
            return [];
        }

        const productRefs = snap.data().products || []; // Get product references

        // Fetch product details using references
        const productPromises = productRefs.map(async (productRef) => {
            const productSnap = await getDoc(productRef);
            return productSnap.exists() ? { id: productSnap.id, ...productSnap.data() } : null;
        });

        const products = await Promise.all(productPromises);
        return products.filter((product) => product !== null); // Remove null values
    } catch (error) {
        console.error(`Error fetching products from ${type}:`, error);
        return [];
    }
};

// Search products by name (case-insensitive)
export const fetchProductsBySearch = async (searchQuery) => {
    try {
        if (!searchQuery.trim()) return []; // Return empty array if no query

        const productsRef = collection(db, "products");
        const searchQ = query(
            productsRef,
            where("keywords", "array-contains", searchQuery.toLowerCase()),
            limit(20) // Limit to 20 results
        );

        const querySnapshot = await getDocs(searchQ);
        console.log("Query snapshot:", querySnapshot.docs);
        const products = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        console.log("Products found:", products);

        return products;
    } catch (error) {
        console.error("Error searching products:", error);
        return [];
    }
};


