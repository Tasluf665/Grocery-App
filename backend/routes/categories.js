import express from 'express';
const router = express.Router();
import asyncMiddleware from '../middleware/async.js';
import firebase from '../firebase.js';
import {
    getFirestore,
    collection,
    doc,
    addDoc,
    getDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    arrayUnion
} from 'firebase/firestore';

const db = getFirestore(firebase);

router.get(
    "/",
    asyncMiddleware(async (req, res) => {
        try {
            const categories = await getDocs(collection(db, 'categories'));
            const categoriesArray = [];

            if (categories.empty) {
                res.status(400).send('No Category found');
            } else {
                categories.forEach((doc) => {
                    const productArray = [];
                    doc.data().products.forEach((product) => {
                        console.log(product.id);
                        productArray.push(product.id);
                    }
                    );

                    console.log(productArray);
                    const category = {
                        "id": doc.id,
                        "name": doc.data().name,
                        "image": doc.data().image,
                        "products": productArray,
                    }
                    categoriesArray.push(category);
                });
                res.status(200).send(categoriesArray);
            }
        } catch (error) {
            res.status(400).send(error.message);
        }
    })
)

router.post('/new', asyncMiddleware(async (req, res) => {
    try {
        const data = req.body;
        await addDoc(collection(db, 'categories'), data);
        res.status(200).send('Category created successfully');
    } catch (error) {
        res.status(400).send(error.message);
    }
}));

router.put('/update/:id', asyncMiddleware(async (req, res) => {
    try {
        const id = req.params.id;
        const data = req.body;
        const category = doc(db, 'categories', id);
        await updateDoc(category, data);
        res.status(200).send('Category updated successfully');
    } catch (error) {
        res.status(400).send(error.message);
    }
}));

router.put('/add-product/:id', asyncMiddleware(async (req, res) => {
    try {
        const id = req.params.id;
        const { productId } = req.body;
        const categoryRef = doc(db, 'categories', id);
        const productRef = doc(db, 'products', productId);

        // Add the product reference to the category's products array
        await updateDoc(categoryRef, {
            products: arrayUnion(productRef)
        });

        res.status(200).send('Product added to category successfully');
    } catch (error) {
        res.status(400).send(error.message);
    }
}));

export default router;