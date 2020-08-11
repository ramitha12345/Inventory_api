const express = require('express');
const router = express.Router();
const checkAuth = require('../middlewares/checkAuth');

const db = require('../../models');

const modelName = 'customer';

//create customer
router.post('/', checkAuth, async (req, res) => {
    try {
        console.log(req.body);
        await db[modelName].create(req.body)
        res.sendStatus(200);
    } catch (error) {
        res.sendStatus(500);
    }
});

//Retrieve all the customers from DB
router.get('/', checkAuth, async (req, res) => {
    try {
        const data = await db[modelName].findAll();
        //db simulation
        res.status(200).json(data);
    } catch (error) {
        res.sendStatus(500);
    }
});

//Retrieve one customers from DB
router.get('/:id', checkAuth, async (req, res) => {
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

//Update customer(delete customer)
router.put('/:id', checkAuth, async (req, res) => {
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