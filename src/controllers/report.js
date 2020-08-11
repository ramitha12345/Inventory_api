const express = require('express');
const router = express.Router();
const checkAuth = require('../middlewares/checkAuth');
const db = require('../../models');

router.post('/reorderLevel', async (req, res) => {
    try {
        const orderBy = req.body.orderBy;
        const status = req.body.status;
        const query = `SELECT 
       *
   FROM
       inventory.products
   WHERE
       qty < reorderLevel ${status === 'all' ? "" : `AND status =${status}`}
   ORDER BY ${orderBy};`

        const data = await db.sequelize.query(query,
            {
                type: db.sequelize.QueryTypes.SELECT,
                logging: console.log()
            });
        res.status(200).json(data);
    } catch (error) {
        res.sendStatus(500);
    }


});

module.exports = router;