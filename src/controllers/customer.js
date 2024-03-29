const express = require('express');
const router = express.Router();
const checkAuth = require('../middlewares/checkAuth');

const db = require('../../models');

const modelName = 'customer';

//create customer
router.post('/', checkAuth, async (req, res) => {
    const transaction = await db.sequelize.transaction();
    try {
        console.log(req.body);
        await db[modelName].create(req.body, { transaction })
        await transaction.commit();
        res.sendStatus(200);
    } catch (error) {
        await transaction.rollback();
        res.sendStatus(500);
    }
});

//Retrieve all the customers from DB
router.get('/cus', checkAuth, async (req, res) => {
    try {
        const data = await db[modelName].findAll(
            {
                where: {
                    isSupplier: false,
                },
            }
        );
        res.status(200).json(data);
    } catch (error) {
        res.sendStatus(500);
    }
});

//Retrieve all the customers from DB
router.get('/sup', checkAuth, async (req, res) => {
    try {
        const data = await db[modelName].findAll(
            {
                where: {
                    isSupplier: true,
                },
            }
        );
        res.status(200).json(data);
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
    const transaction = await db.sequelize.transaction();
    try {
        const id = req.params.id;
        await db[modelName].update(req.body, {
            where: {
                id
            },
            transaction
        });
        await transaction.commit();
        res.sendStatus(200);
    } catch (error) {
        await transaction.rollback();
        res.sendStatus(500);
    }
})

module.exports = router;