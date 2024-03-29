const express = require('express');
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const checkAuth = require('../middlewares/checkAuth');
const db = require('../../models');

//const modelName = 'auth';

//create auth
router.post('/register', checkAuth, async (req, res) => {
    const transaction = await db.sequelize.transaction();
    try {
        const { firstName, lastName, role, nic, gender } = req.body;
        let { email, password } = req.body;

        email = String(email).trim().toLowerCase();
        password = await bcrypt.hash(password, 12);

        //is email already exists
        const isEmail = await db.user.findOne(
            {
                where: {
                    email: email
                },
                raw: true
            }
        )
        if (isEmail) {
            await transaction.rollback();
            res.sendStatus(422)
        } else {
            await db.user.create(
                {
                    firstName,
                    lastName,
                    role,
                    nic,
                    gender,
                    email,
                    password,
                }, { transaction }
            )
            await transaction.commit();
            res.sendStatus(200);
        }
        //console.log("*******", isEmail)

    } catch (error) {
        await transaction.rollback();
        res.sendStatus(500);
    }
});

router.post('/login', async (req, res) => {
    try {
        let { email, password } = req.body;
        email = String(email).trim().toLowerCase();
        //check email exists and status is activated
        const isEmail = await db.user.findOne(
            {
                where: {
                    email: email,
                    status: true,
                },
                raw: true
            }
        )
        if (!isEmail) {
            res.sendStatus(401)
        }
        //check password matches
        const passwordMatches = await bcrypt.compare(password, isEmail.password);
        //console.log("is password matches", passwordMatches)

        if (passwordMatches) {
            //JWT token
            const token = jwt.sign(
                {
                    data: isEmail.id,
                },
                "secret",
            );
            res.status(200).json({
                token,
                role: isEmail.role,
                name:'ramitha'
            });

        } else {
            res.sendStatus(401)
        }

    } catch (error) {
        console.log(error)
        res.sendStatus(500);
    }
});

module.exports = router;