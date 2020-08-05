const express = require('express');
const router = express.Router();
const checkAuth = require('../middlewares/checkAuth');
const db = require('../../models');

router.post('/', async (req, res) => {
    try {
        const orderBy = req.body.orderBy;
        const query = `SELECT 
       *
   FROM
       inventory.products
   WHERE
       qty < reorderLevel AND status = TRUE
   ORDER BY ${orderBy};`

        const data = await db.sequelize.query(query,
            {
                type: db.sequelize.QueryTypes.SELECT,
            });
        res.status(200).json(data);
    } catch (error) {
        res.sendStatus(500);
    }


});

module.exports = router;