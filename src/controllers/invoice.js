const express = require('express');
const router = express.Router();
const checkAuth = require('../middlewares/checkAuth');
const db = require('../../models');
const { request } = require('express');

router.post('/', checkAuth, async (req, res) => {
  const transaction = await db.sequelize.transaction();
  try {
    const productsList = req.body.productsList;
    // first insert to invoice_masters table
    const data = await db.invoice_master.create(
      { customerId: req.body.customerId },
      { transaction }
    );
    //console.log(data)
    //console.log('*************************************')
    //console.log(data.dataValues)

    // then insert to invoice_details
    productsList.forEach((element) => {
      element.invoiceId = data.dataValues.id;
    });
    // then insert to invoice_details
    await db.invoice_detail.bulkCreate(productsList, { transaction });
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
          transaction,
        }
      );
    }
    await transaction.commit();
    res.sendStatus(200);
  } catch (error) {
    //console.log('**1111***********', error);
    await transaction.rollback();
    res.sendStatus(500);
  }
});

router.get('/util-for-report', checkAuth, async (req, res) => {
  try {
    const query = `SELECT 
        customerId AS value,
        CONCAT(customers.firstName,
                ' ',
                customers.lastName) AS text
    FROM
        invoice_masters
            INNER JOIN
        customers ON invoice_masters.customerId = customers.id
    GROUP BY customerId;`;

    const data = await db.sequelize.query(query, {
      type: db.sequelize.QueryTypes.SELECT,
    });

    res.status(200).json(data);
  } catch (error) {
    res.sendStatus(500);
  }
});

router.get('/util', checkAuth, async (req, res) => {
  try {
    const customers = await db.customer.findAll({
      where: {
        isSupplier: false,
        status: true,
      },
      raw: true,
    });
    customers.forEach((e) => {
      e.fullName = e.firstName + ' ' + e.lastName;
    });
    const products = await db.product.findAll({
      where: {
        status: true,
      },
    });
    //db simulation
    res.status(200).json({ customers, products });
  } catch (error) {
    res.sendStatus(500);
  }
});

//Retrieve one invoice details from DB
router.get('/:id', checkAuth, async (req, res) => {
  try {
    const id = req.params.id;
    //db simulation
    const data = await db.invoice_master.findOne({
      where: {
        id,
      },
      include: [
        {
          model: db.customer,
          required: true,
        },
        {
          model: db.invoice_detail,
          required: true,
        },
      ],
    });
    res.status(200).json(data);
  } catch (error) {
    //console.log('**1111***********', error)
    res.sendStatus(500);
  }
});

//Retrieve all the invoice details from DB
router.get('/', checkAuth, async (req, res) => {
  try {
    const data = await db.invoice_master.findAll({
      include: [
        {
          model: db.customer,
          required: true,
        },
      ],
      raw: true,
    });
    data.forEach((e) => {
      //console.log(e)
      e.fullName = e['customer.firstName'] + ' ' + e['customer.lastName'];
    });
    //db simulation
    res.status(200).json(data);
  } catch (error) {
    res.sendStatus(500);
  }
});

module.exports = router;
