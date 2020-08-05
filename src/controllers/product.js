const express = require('express');
const router = express.Router();
const checkAuth = require('../middlewares/checkAuth');
const db = require('../../models');

const modelName = 'product';

//create product
router.post('/', async (req, res) => {
    try {
        let name = req.body.name;
        name = String(name).trim();
        //is product name already exists
        const isProduct = await db[modelName].findOne(
            {
                where: {
                    name: name
                },
                raw: true
            }
        )
        if (isProduct) {
            res.sendStatus(422)
        } else {
            await db[modelName].create(req.body);
            res.sendStatus(200);
        }
    } catch (error) {
        console.log("***", error);
        res.sendStatus(500);
    }

    /*try {
        console.log(req.body);
        await db[modelName].create(req.body)
        res.sendStatus(200);
    } catch (error) {
        res.sendStatus(500);
    }*/
});

//Retrieve all the product from DB
router.get('/', async (req, res) => {
    try {
        const data = await db[modelName].findAll(
            { raw: true }
        );
        data.forEach(element => {
            if (element.isImported) {
                element.isImported = "Imported"
            } else {
                element.isImported = "Local"
            }
        });
        //db simulation
        res.status(200).json(data);
    } catch (error) {
        res.sendStatus(500);
    }
});

//Retrieve one product from DB
router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        //db simulation
        const data = await db[modelName].findOne(
            {
                where: {
                    id
                }
            }
        )
        res.status(200).json(data);
    } catch (error) {
        res.sendStatus(500);
    }
});

//Update product(delete product)
router.put('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        await db[modelName].update(req.body, {
            where: {
                id
            }
        });
        res.sendStatus(200);
    } catch (error) {
        res.sendStatus(500);
    }
})

module.exports = router;