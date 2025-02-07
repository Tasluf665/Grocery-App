import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export async function getSpecialSectionProducts(sectionId) {
    const sectionRef = doc(db, "special_sections", sectionId);
    const sectionSnap = await getDoc(sectionRef);

    if (!sectionSnap.exists()) {
        console.log("No such section found!");
        return [];
    }

    // Get product references (Firestore stores them as actual document references)
    const productRefs = sectionSnap.data().products;

    // Fetch product details using Firestore references
    const productPromises = productRefs.map(async (productRef) => {
        const productSnap = await getDoc(productRef); // Get the document using reference
        return productSnap.exists() ? { id: productSnap.id, ...productSnap.data() } : null;
    });

    const products = await Promise.all(productPromises);
    return products.filter((product) => product !== null); // Filter out any null values
}

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

// Fetch all categories from Firestore
export const fetchCategories = async () => {
    try {
        const categoriesRef = collection(db, "categories");
        const snapshot = await getDocs(categoriesRef);

        // Convert documents into an array
        const categories = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        return categories;
    } catch (error) {
        console.error("Error fetching categories:", error);
        return [];
    }
};

// Fetch products by category (Uses product references)
export const fetchProductsByCategory = async (categoryId) => {
    try {
        const categoryRef = doc(db, "categories", categoryId);
        const categorySnap = await getDoc(categoryRef);

        if (!categorySnap.exists()) {
            console.log("Category not found!");
            return [];
        }

        const productRefs = categorySnap.data().products; // Get product references
        // Fetch all product details using references
        const productPromises = productRefs.map(async (productRef) => {
            const productSnap = await getDoc(productRef);
            return productSnap.exists() ? { id: productSnap.id, ...productSnap.data() } : null;
        });

        const products = await Promise.all(productPromises);
        return products.filter((product) => product !== null); // Remove null values
    } catch (error) {
        console.error("Error fetching products:", error);
        return [];
    }
};
