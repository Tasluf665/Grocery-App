import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase"; // Your Firebase configuration

export const fetchBannerImages = async () => {
    const querySnapshot = await getDocs(collection(db, "promotional_image"));
    const images = [];
    querySnapshot.forEach((doc) => {
        images.push({ id: doc.id, ...doc.data() });
    });
    return images;
};