const express = require('express');
const router = express.Router();
const checkAuth = require('../middlewares/checkAuth');
const db = require('../../models');

const modelName = 'user';

//create user
router.post('/', async (req, res) => {
    try {
        console.log(req.body);
        await db[modelName].create(req.body)
        res.sendStatus(200);
    } catch (error) {
        res.sendStatus(500);
    }
});

//Retrieve all the user from DB
router.get('/', async (req, res) => {
    try {
        const data = await db[modelName].findAll(
            // { raw: true }
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

//Update user(delete user)
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