const express = require('express');
const router = express.Router();
const checkAuth = require('../middlewares/checkAuth');
const db = require('../../models');

const modelName = 'user';

//create user
router.post('/', checkAuth, async (req, res) => {
    const transaction = await db.sequelize.transaction();
    try {
        let nic = req.body.nic;
        //check nic already existed
        const isProduct = await db[modelName].findOne(
            {
                where: {
                    nic: nic
                },
                raw: true
            }
        )
        if (isProduct) {
            await transaction.rollback();
            res.sendStatus(422)
        } else {
            await db[modelName].create(req.body, { transaction });
            await transaction.commit();
            res.sendStatus(200);
        }
    } catch (error) {
        await transaction.rollback();
        res.sendStatus(500);
    }
});

//Retrieve all the user from DB
router.get('/', checkAuth, async (req, res) => {
    try {
        const data = await db[modelName].findAll(
            { attributes: { exclude: ['password'] } }
        );
        // data.forEach(element => {
        //     if (element.gender) {
        //         element.gender = "Male"
        //     } else {
        //         element.gender = "Female"
        //     }
        // });
        //db simulation
        res.status(200).json(data);
    } catch (error) {
        res.sendStatus(500);
    }
});

//Retrieve one user from DB
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

//Update user(delete user)
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