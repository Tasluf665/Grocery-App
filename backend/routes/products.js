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
} from 'firebase/firestore';

const db = getFirestore(firebase);

router.get(
    "/",
    asyncMiddleware(async (req, res) => {
        try {
            const products = await getDocs(collection(db, 'products'));
            const productArray = [];

            if (products.empty) {
                res.status(400).send('No Products found');
            } else {
                products.forEach((doc) => {
                    const product = {
                        "id": doc.id,
                        "name": doc.data().name,
                        "price": doc.data().price,
                        "description": doc.data().description,
                        "image": doc.data().image,
                        "rating": doc.data().rating,
                        "priceDescription": doc.data().priceDescription,
                        "nutrition": doc.data().nutrition,
                        "lowercaseName": doc.data().lowercaseName,
                    }
                    productArray.push(product);
                });
                res.status(200).send(productArray);
            }
        } catch (error) {
            res.status(400).send(error.message);
        }
    })
)

router.post('/new', asyncMiddleware(async (req, res) => {
    try {
        const data = req.body;
        const docRef = await addDoc(collection(db, 'products'), data);
        const newProduct = await getDoc(docRef);

        if (newProduct.exists()) {
            const product = {
                id: newProduct.id,
                ...newProduct.data()
            };
            res.status(200).send({
                message: 'Product created successfully',
                product
            });
        } else {
            res.status(400).send('Failed to retrieve the newly created product');
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
}));

router.put('/update/:id', asyncMiddleware(async (req, res) => {
    try {
        const id = req.params.id;
        const data = req.body;
        const productRef = doc(db, 'products', id);
        await updateDoc(productRef, data);
        const updatedProduct = await getDoc(productRef);

        if (updatedProduct.exists()) {
            const product = {
                id: updatedProduct.id,
                ...updatedProduct.data()
            };
            res.status(200).send({
                message: 'Product updated successfully',
                product
            });
        } else {
            res.status(400).send('Failed to retrieve the updated product');
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
}));

router.delete('/delete/:id', asyncMiddleware(async (req, res) => {
    try {
        const id = req.params.id;
        const productRef = doc(db, 'products', id);
        await deleteDoc(productRef);
        res.status(200).send({
            message: 'Product deleted successfully'
        });
    } catch (error) {
        res.status(400).send(error.message);
    }
}));

export default router;



// Product fetch from walmart
// let name = $("#main-title").innerText
// let price = $("span[data-fs-element='price']").textContent.replace("$", "")
// let img = $("div[data-testid='zoom-image']").getElementsByTagName("img")[0].getAttribute("src")
// let description = $("#product-description-atf").innerText

// let data = `{"name": "${name}", "price": "${price}", "description": "${description}", "image": "${img}", "rating": 5, "priceDescription": "per kg", "nutrition": ["Calories 52g", "Fat 0g", "Sodium 4mg", "Carbohydrate 12g", "Dietary Fiber 2g"], "lowercaseName": "${name.toLowerCase()}" }`

// data