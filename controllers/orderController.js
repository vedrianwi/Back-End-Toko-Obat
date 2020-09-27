// import helper untuk query
const { generateQuery, asyncQuery } = require('../helper/queryHelp')

module.exports = {
    addToCart: async (req, res) => {
        console.log('body', req.body)
        const { qty, total, user_id, product_id } = req.body
        try {
            //check status order user
            const checkOrder = `SELECT order_number from orders WHERE user_id = '${user_id}' AND status = 1`
            const result = await asyncQuery(checkOrder)
            console.log('result', result)

            const order_number = result.length ? result[0].order_number : Date.now()
            console.log(order_number)
            if (!result.length) {
                //  masukan data ke order
                const insertOrders = `INSERT INTO orders (order_number, user_id, status) VALUES
                                    ('${order_number}', '${user_id}', 1)`
                const resultInsert = await asyncQuery(insertOrders)
            }

            const checkQty = `SELECT * FROM order_details WHERE order_number = '${order_number}' and product_id = '${product_id}'`
            const resultQty = await asyncQuery(checkQty)
            console.log('res', resultQty)

            if (resultQty.length) {
                const updateQty = `UPDATE order_details SET qty ='${qty}' , total = ${total} WHERE order_number = '${order_number}' and product_id = '${product_id}'`
                const resultUpdate = await asyncQuery(updateQty)
            } else {
                // insert orderdetails
                const insertDetails = `INSERT INTO order_details (order_number, qty, total, product_id, satuan) VALUES
                ('${order_number}', '${qty}', '${total}', '${product_id}', 1)`
                const resultDetails = await asyncQuery(insertDetails)
            }

            //send response
            res.status(200).send('product succes')
        } catch (err) {
            console.log(err)
            res.status(500).send(err)
        }
    },
    editCartQty: async (req, res) => {
        const { id, newQty, total } = req.body
        console.log(req.body)
        try {
            const editCart = `UPDATE order_details SET qty =${newQty}, total =${total} WHERE id =${id}`

            const result = await asyncQuery(editCart)

            // const getCart = `SELECT * FROM order_details WHERE order_number = '${order_number}'`
            res.status(200).send('edit succes')
        } catch (err) {
            console.log(err)
            res.status(500).send(err)
        }
    },
    deleteCart: async (req, res) => {
        const id = parseInt(req.params.id)
        try {
            const deleteCart = `DELETE FROM order_details WHERE id = '${id}'`
            const result = await asyncQuery(deleteCart)

            res.status(200).send('delete succes')

        } catch (err) {
            console.log(err)
            res.status(500).send(err)
        }
    },
    checkOut: async (req, res) => {
        const order_number = parseInt(req.params.on)
        try {
            const checkoutQuery = `UPDATE orders SET STATUS = 2 WHERE order_number = '${order_number}' `
            const result = await asyncQuery(checkoutQuery)

            const getLastDetails = `SELECT * FROM order_details WHERE order_number = ${order_number}`
            const resultLastDetails = await asyncQuery(getLastDetails)
            res.status(200).send('checkout succes')
        } catch (err) {
            console.log(err)
            res.status(500).send(err)
        }
    },
    getCartData: async (req, res) => {
        const user_id = parseInt(req.params.id)
        try {
            const getData = `SELECT  od.id, od.order_number, p.harga, p.nama, od.qty,od.satuan
                                FROM orders o
                                JOIN order_details od ON o.order_number = od.order_number
                                JOIN product_obat p ON od.product_id = p.id
                                WHERE user_id = '${user_id}' AND o.status = 1
                                HAVING od.satuan = 1;`
            const result = await asyncQuery(getData)

            const getDetails = `SELECT SUM(od.total) as total, od.order_number, od.satuan
                                FROM orders o
                                JOIN order_details od ON o.order_number = od.order_number
                                JOIN product_obat p ON od.product_id = p.id
                                WHERE user_id = '${user_id}' AND o.status = 1;`
            const resultDetails = await asyncQuery(getDetails)

            res.status(200).send({ result, resultDetails: resultDetails[0] })
        } catch (err) {
            console.log(err)
            res.status(400).send(err)
        }
    },
    CartKimia: async (req, res) => {
        console.log('body', req.body)
        try {
            //check status order user
            const checkOrder = `SELECT order_number from orders WHERE user_id = '${req.body[0].user_id}' AND status = 1`
            const result = await asyncQuery(checkOrder)
            console.log('result', result)


            const order_number = result.length ? result[0].order_number : Date.now()
            const order_racik_id = Date.now() - 123123123
            console.log(order_number)
            if (!result.length) {
                //  masukan data ke order

                const insertOrders = `INSERT INTO orders (order_number, user_id, status) VALUES
                                    ('${order_number}', '${req.body[0].user_id}', 1)`
                const resultInsert = await asyncQuery(insertOrders)
            }

            req.body.forEach(async (item) => {
                //insert
                try {
                    const insertDetails = `INSERT INTO order_details (order_number, qty, total, product_id, satuan, order_racik_id) VALUES
                        ('${order_number}', '${item.total}', '${item.total_harga}', '${item.obat}', '${item.satuan}', '${order_racik_id}')`
                    const resultDetails = await asyncQuery(insertDetails)
                } catch (error) {
                    res.status(500).send(error)
                }

            })

            const checkRacikID = `SELECT order_racik_id from order_details WHERE order_number = '${order_racik_id}'`
            const resultID = await asyncQuery(checkRacikID)

            //send response
            res.status(200).send('kimia succes')
        } catch (err) {
            console.log(err)
            res.status(500).send(err)
        }
    },
    getCartKimia: async (req, res) => {
        try {
            const query = `select od.id, od.order_number, od.qty, sum(od.total) as total, ok.nama_kimia, s.satuan, od.order_racik_id
            from order_details od
            Join obat_kimia ok on od.product_id = ok.id
            Join satuan s on od.satuan = s.id
            JOIN orders o on od.order_number = o.order_number
            WHERE od.order_racik_id is not null and o.status = 1
            group by order_racik_id;`
            const result = await asyncQuery(query)
            console.log('ini', result)

            res.status(200).send(result)
        } catch (err) {
            console.log(err)
            res.status(500).send(err)
        }
    },
    deleteCartKimia: async (req, res) => {
        const id = parseInt(req.params.id)
        try {
            const deleteCart = `DELETE FROM order_details WHERE id = '${id}' AND
                                satuan > 1`
            const result = await asyncQuery(deleteCart)

            res.status(200).send('delete succes')

        } catch (err) {
            console.log(err)
            res.status(500).send(err)
        }
    }
}
