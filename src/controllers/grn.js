const express = require('express');
const router = express.Router();
const checkAuth = require('../middlewares/checkAuth');
const db = require('../../models');
const { request } = require('express');



router.post('/', checkAuth, async (req, res) => {
    const transaction = await db.sequelize.transaction();
    try {
        const productsList = req.body.productsList;
        // first insert to grn_masters table
        const data = await db.grn_master.create({ supplierId: req.body.supplierId }, { transaction })
        //console.log(data)
        //console.log('*************************************')
        //console.log(data.dataValues)


        // then insert to grn_details
        productsList.forEach((element) => {
            element.grnId = data.dataValues.id;
        });
        // then insert to grn_details
        await db.grn_detail.bulkCreate(productsList, { transaction });
        // then update products table qty column
        for (const element of productsList) {
            await db.product.update(
                {
                    qty: db.Sequelize.literal(`qty + ${element.qty}`),
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
        await transaction.rollback();
        //console.log('**1111***********', error)
        res.sendStatus(500);
    }
});


router.get('/util', checkAuth, async (req, res) => {
    try {
        const suppliers = await db.customer.findAll(
            {
                where: {
                    isSupplier: true,
                    status: true
                },
                raw: true
            }
        );
        suppliers.forEach(e => {
            e.fullName = e.firstName + " " + e.lastName;
        })
        const products = await db.product.findAll(
            {
                where: {
                    status: true
                }
            }
        );
        //db simulation
        res.status(200).json({ suppliers, products });
    } catch (error) {
        res.sendStatus(500);
    }
});

//Retrieve one drn detail from DB
router.get('/:id', checkAuth, async (req, res) => {
    try {
        const id = req.params.id;
        //db simulation
        const data = await db.grn_master.findOne(
            {
                where: {
                    id
                },
                include: [{
                    model: db.customer,
                    required: true
                },
                {
                    model: db.grn_detail,
                    required: true
                }
                ]
            }
        )
        res.status(200).json(data);
    } catch (error) {
        //console.log('**1111***********', error)
        res.sendStatus(500);
    }
});

//Retrieve all the drn details from DB
router.get('/', checkAuth, async (req, res) => {
    try {
        const data = await db.grn_master.findAll(
            {
                include: [{
                    model: db.customer,
                    required: true,
                }
                ],    
                raw:true
            }
        ); 
        data.forEach(e => {
            //console.log(e)
            e.fullName = e["customer.firstName"] + " " + e["customer.lastName"];
        })
        //db simulation
        res.status(200).json(data);
    } catch (error) {
        res.sendStatus(500);
    }
});



module.exports = router;