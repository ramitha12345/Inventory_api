const express = require('express');
const router = express.Router();
const checkAuth = require('../middlewares/checkAuth');
const db = require('../../models');
const { request } = require('express');

router.post('/', checkAuth, async (req, res) => {
    const transaction = await db.sequelize.transaction();
    try {
        const productsList = req.body.productsList;
        // first insert to pr_masters table
        const data = await db.pr_master.create({ grnId: req.body.grnId }, { transaction })
        //console.log(data)
        //console.log('*************************************')
        //console.log(data.dataValues)


        // then insert to pr_details
        productsList.forEach((element) => {
            element.prId = data.dataValues.id;
        });
        // then insert to pr_details
        await db.pr_detail.bulkCreate(productsList, { transaction });
        // then update products table qty column
        for (const element of productsList) {
            await db.product.update(
                {
                    qty: db.Sequelize.literal(`qty - ${element.qty}`),
                },
                {
                    where: {
                        id: element.productId,
                    },
                    transaction
                }
            );
        }
        await transaction.commit();
        res.sendStatus(200)
    } catch (error) {
        //console.log('**1111***********', error);
        await transaction.rollback();
        res.sendStatus(500);
    }
});

//Retrieve one pr detail from DB
router.get('/:id', checkAuth, async (req, res) => {
    try {
        const id = req.params.id;
        //db simulation
        const data = await db.pr_master.findOne(
            {
                where: {
                    id
                },
                include: [{
                    model: db.pr_detail,
                    required: true
                }
                ]
            }
        )
        res.status(200).json(data);
    } catch (error) {
        res.sendStatus(500);
    }
});

//Retrieve all the pr details from DB
router.get('/', checkAuth, async (req, res) => {
    try {
        const data = await db.pr_master.findAll();
        //db simulation
        res.status(200).json(data);
    } catch (error) {
        res.sendStatus(500);
    }
});

module.exports = router;