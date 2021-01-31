const moment = require('moment');
const express = require('express');
const db = require('../../models');

const router = express.Router();
const { Op } = db.Sequelize;

router.post('/category', async (req, res) => {
  try {
    // total number of categories
    const s = req.body.status;

    const { from, to, isLimitByRange } = req.body;

    const preparedQuery = {};
    preparedQuery.where = {};
    if (String(s) === 'Inactive') {
      preparedQuery.where.status = 0;
    }
    if (String(s) === 'Active') {
      preparedQuery.where.status = 1;
    }

    if (isLimitByRange) {
      preparedQuery.where.createdAt = {};
      preparedQuery.where.createdAt.$between = [];
      preparedQuery.where.createdAt.$between.push(from);
      preparedQuery.where.createdAt.$between.push(to);
    }

    const data = await db.category.findAll(preparedQuery);
    res.status(200).json({
      data,
      masterData: req.body,
    });
  } catch (error) {
    res.sendStatus(500);
  }
});

router.post('/subcategory', async (req, res) => {
  try {
    const s = req.body.status;

    const { isLimitByRange } = req.body;

    const { from } = req.body;
    const { to } = req.body;

    const preparedQuery = {
      where: {
        parentId: {
          [Op.ne]: null,
        },
      },
    };
    preparedQuery.where = {};
    if (s == 1) {
      preparedQuery.where.status = 1;
    }
    if (s == 0) {
      preparedQuery.where.status = 0;
    }

    if (isLimitByRange) {
      preparedQuery.where.createdAt = {};
      preparedQuery.where.createdAt.$between = [];
      preparedQuery.where.createdAt.$between.push(from);
      preparedQuery.where.createdAt.$between.push(to);
    }

    const data = await db.category.findAll(preparedQuery);
    res.status(200).json({
      data,
      masterData: req.body,
    });
  } catch (error) {
    res.sendStatus(500);
  }
});

router.post('/product', async (req, res) => {
  try {
    const s = req.body.status;

    const { isLimitByRange } = req.body;

    const { from } = req.body;
    const { to } = req.body;

    const preparedQuery = {};
    preparedQuery.where = {};
    if (Number(s) === 0) {
      preparedQuery.where.status = 0;
    }
    if (Number(s) === 1) {
      preparedQuery.where.status = 1;
    }

    if (isLimitByRange) {
      preparedQuery.where.createdAt = {};
      preparedQuery.where.createdAt.$between = [];
      preparedQuery.where.createdAt.$between.push(from);
      preparedQuery.where.createdAt.$between.push(to);
    }

    const data = await db.product.findAll(preparedQuery);
    res.status(200).json({
      data,
      masterData: req.body,
    });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

router.get('/stock', async (req, res) => {
  try {
    const query = `SELECT 
    items.name,
    SUM(Stocks.qty) AS qty,
    categories.name AS category
FROM
    inventory.Stocks
        INNER JOIN
    items ON Stocks.item_id = items.id
        INNER JOIN
    categories ON items.categoryId = categories.id
WHERE
    qty > 0
GROUP BY Stocks.item_id`;

    const data = await db.sequelize.query(query, {
      type: db.sequelize.QueryTypes.SELECT,
    });
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

router.post('/customer', async (req, res) => {
  try {
    const s = req.body.status;
    const meta = req.body;
    const { order } = req.body;
    const { type } = req.body;
    const preparedQuery = {};
    preparedQuery.where = {};
    preparedQuery.type = type;
    if (Number(s) === 1) {
      preparedQuery.where.status = 1;
    }

    if (Number(s) === 0) {
      preparedQuery.where.status = 0;
    }

    preparedQuery.order = db.sequelize.literal(order);
    const data = await db.customer.findAll(preparedQuery);
    res.status(200).json({
      data,
      meta,
    });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

router.post('/user', async (req, res) => {
  try {
    const { order, type, s } = req.body;

    const preparedQuery = {};
    preparedQuery.where = {};

    preparedQuery.type = type;
    preparedQuery.order = db.sequelize.literal(order);
    if (Number(s) === 1) {
      preparedQuery.where.status = 1;
    }

    if (Number(s) === 0) {
      preparedQuery.where.status = 0;
    }

    const data = await db.user.findAll(preparedQuery);
    const meta = req.body;
    res.status(200).json({
      data,
      meta,
    });
  } catch (error) {
    console.log('ERR', error);
    res.sendStatus(500);
  }
});

router.post('/sr', async (req, res) => {
  try {
    const data = req.body;

    const preparedQuery = {
      include: [
        {
          model: db.Invoice_master,
          include: [
            {
              model: db.customer,
            },
          ],
        },
      ],
    };
    if (!data.is_all_customers) {
      preparedQuery.include[0].include[0].where = {};
      preparedQuery.include[0].include[0].where.id = data.customer_id;
    }
    if (!data.is_all_dates) {
      preparedQuery.where = {};
      preparedQuery.where.createdAt = {};
      preparedQuery.where.createdAt.$between = [];
      preparedQuery.where.createdAt.$between.push(data.from);
      preparedQuery.where.createdAt.$between.push(data.to);
    }

    const data2 = await db.Sales_return_master.findAll(preparedQuery);
    res.status(200).json({
      data2,
      data,
    });
  } catch (error) {
    res.sendStatus(500);
  }
});

router.post('/invoice', async (req, res) => {
  try {
    const data = req.body;
    const from = new Date(data.from);
    const to = new Date(data.to);
    to.setDate(to.getDate() + 1)

    const preparedQuery = {
      include: [
        {
          model: db.customer,
        },
      ],
    };
    if (!data.is_all_customers) {
      preparedQuery.include[0].where = {};
      preparedQuery.include[0].where.id = data.customer_id;
    }
    if (!data.is_all_dates) {
      preparedQuery.where = {};
      preparedQuery.where.createdAt = {
        [Op.between]:[from,to]
      };
      // preparedQuery.where.createdAt.$between = [];
      // preparedQuery.where.createdAt.$between.push(data.from);
      // preparedQuery.where.createdAt.$between.push(data.to);
    }

    const data2 = await db.invoice_master.findAll(preparedQuery);
    res.status(200).json({
      data2,
      data,
    });
  } catch (error) {
    console.log(error)
    res.sendStatus(500);
  }
});

router.post('/pr', async (req, res) => {
  try {
    const data = req.body;

    const from = new Date(data.from);
    const to = new Date(data.to);
    to.setDate(to.getDate() + 1)

    const preparedQuery = {
      include: [
        {
          model: db.grn_master,
          include: [
            {
              model: db.customer,
            },
          ],
        },
      ],
      logging:console.log
    };
    if (!data.is_all_suppliers) {
      preparedQuery.include[0].include[0].where = {};
      preparedQuery.include[0].include[0].where.id = data.supplier_id;
    }
    if (!data.is_all_dates) {
      preparedQuery.where = {};
      preparedQuery.where.createdAt = {
        [Op.between]:[from,to]
      };
      // preparedQuery.where.createdAt.$between = [];
      // preparedQuery.where.createdAt.$between.push(data.from);
      // preparedQuery.where.createdAt.$between.push(data.to);
    }

    const data2 = await db.pr_master.findAll(preparedQuery);
    res.status(200).json({
      data2,
      data,
    });
  } catch (error) {
    console.log(error)
    res.sendStatus(500);
  }
});

router.post('/grn', async (req, res) => {
  try {
    const data = req.body;

    const from = new Date(data.from);
    const to = new Date(data.to);
    to.setDate(to.getDate() + 1)


    const preparedQuery = {
      include: [
        {
          model: db.customer,
        },
      ],
      logging: console.log,
    };
    if (!data.is_all_suppliers) {
      preparedQuery.include[0].where = {};
      preparedQuery.include[0].where.id = data.supplier_id;
    }
    if (!data.is_all_dates) {
      preparedQuery.where = {};
     
      // preparedQuery.where.createdAt.$between = [];
      // preparedQuery.where.createdAt.$between.push(from);
      // preparedQuery.where.createdAt.$between.push(to);

      preparedQuery.where.createdAt={
        [Op.between]:[from,to]
      }



     
    }

    const data2 = await db.grn_master.findAll(preparedQuery);
    console.log(data2);
    res.status(200).json({
      data2,
      data,
    });
  } catch (error) {
    console.log(error)
    res.sendStatus(500);
  }
});

async function todayTransactions(req, res, next) {
  try {
    const today_grn = await db.Grn_master.findAll({
      where: {
        createdAt: {
          [Op.gte]: db.Sequelize.fn('CURRENT_DATE'),
        },
        //  db.Sequelize.fn('CURRENT_DATE')
      },
      include: [
        {
          model: db.customer,
        },
      ],
    });

    const today_invoice = await db.Invoice_master.findAll({
      where: {
        // createdAt: db.Sequelize.fn('CURRENT_DATE')
        createdAt: {
          [Op.gte]: db.Sequelize.fn('CURRENT_DATE'),
        },
      },
      include: [
        {
          model: db.customer,
        },
      ],
    });

    const today_pr = await db.Purchase_return_master.findAll({
      where: {
        // createdAt: db.Sequelize.fn('CURRENT_DATE')
        createdAt: {
          [Op.gte]: db.Sequelize.fn('CURRENT_DATE'),
        },
      },
      include: [
        {
          model: db.Grn_master,
          include: [
            {
              model: db.customer,
            },
          ],
        },
      ],
    });

    const today_sr = await db.Sales_return_master.findAll({
      where: {
        // createdAt: db.Sequelize.fn('CURRENT_DATE')
        createdAt: {
          [Op.gte]: db.Sequelize.fn('CURRENT_DATE'),
        },
      },
      include: [
        {
          model: db.Invoice_master,
          include: [
            {
              model: db.customer,
            },
          ],
        },
      ],
    });

    res.status(200).json({
      today_grn,
      today_invoice,
      today_pr,
      today_sr,
    });
  } catch (error) {
    res.sendStatus(500);
  }
}

module.exports = router;
