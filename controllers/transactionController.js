const { generateQuery, asyncQuery } = require('../helper/queryHelp')


module.exports = {
    addPayment : async(req, res) => {
        const on = parseInt(req.params.on)
        req.body.status = 1
        console.log('stat', req.body.status)
        const {type, total, order_number, user_id} = req.body
        try {
            const query = `INSERT INTO transactions (payment_type, order_number, user_id, total, status_payment)
            VALUES ('${type}', '${order_number}', '${user_id}', '${total}', 1)`
            const result = await asyncQuery(query)
            
            const getHistory = `select t.id, t.order_number,pt.type_payment,  t.total, ps.status_payment, t.bukti_transfer
            FROM transactions t 
            JOIN payment_types pt ON t.payment_type = pt.id
            JOIN payment_status ps ON t.status_payment = ps.id; `

            const resultHistory = await asyncQuery(getHistory)

            const update = `UPDATE orders SET status = 3 WHERE order_number = '${order_number}'`
            const resultUpdate = await asyncQuery(update)
            res.status(200).send(resultHistory)
            
        } catch (err) {
            console.log(err)
            res.status(500).send(err)
        }
    },
    uploadReceipt: async (req, res) => {
        const id = parseInt(req.params.id)
		console.log("file :", req.file);
		if (req.file === undefined) {
			res.status(400).send("no transaction receipt.");
			return;
		}
		const filename = `images/${req.file.filename}`;
		console.log("filename : ", filename);
		try {
			const addrecord = `UPDATE transactions SET bukti_transfer = 'receipt/${req.file.filename}' WHERE id = ${id}`;
			const result = await asyncQuery(addrecord)

			res.status(200).send(result);
		} catch (err) {
			console.log(err);
			res.status(500).send(err);
		}
    },
    approvePayment: async (req, res) => {
        const id = parseInt(req.params.id)
        console.log(req.body)
        const {order_number} = req.body
        try {
            const approve = `UPDATE transactions SET status_payment = 2 WHERE id = ${id}`
            const result = await asyncQuery(approve)

            const update = `UPDATE orders SET status = 4 WHERE order_number = ${req.body[0].order_number}`
            const updateDone = await asyncQuery(update)
            
            const getData = `SELECT qty, product_id from order_details WHERE order_number = ${req.body[0].order_number}`
            const resultData = await asyncQuery(getData)


            resultData.forEach(async (item) => {
                const checkUpdate = `select t.id, t.order_number,pt.type_payment,  t.total, ps.status_payment,  od.qty, t.bukti_transfer, od.order_racik_id, od.satuan
                FROM transactions t 
                JOIN payment_types pt ON t.payment_type = pt.id
                JOIN payment_status ps ON t.status_payment = ps.id
                JOIN order_details od ON t.order_number = od.order_number
                WHERE od.order_racik_id is null and od.satuan = 2
                group by t.order_number;`
                const resultCheck = await asyncQuery(checkUpdate)
            
                console.log('check', resultCheck)
                if (resultCheck.length >= 1) {
    
                    const update = `UPDATE product_obat SET stock = (stock - ${item.qty}) WHERE id = ${item.product_id}`
                    const resultUpdate = await asyncQuery(update)
    
                } else {
                    // body yang harus di dapat netto perbotol
                            const updateKimia = `UPDATE obat_kimia SET total_ml = (total_ml - ${item.qty}) WHERE id = ${item.product_id}`
                            const resultKimia = await asyncQuery(updateKimia)

                            const getKimia = `SELECT * FROM obat_kimia WHERE id = ${item.product_id} `
                            const select = await asyncQuery(getKimia)
                            console.log('nih', select[0])

                            let total_ml = select[0].total_ml
                            console.log('total', total_ml)
                            let botol_baru = total_ml/select[0].netto_perbotol
                            console.log('botol baru', botol_baru)
                            let updateStock = Math.floor(botol_baru)
                            console.log('update', updateStock)
                            let sisaStock = botol_baru - updateStock
                            console.log('sisa', sisaStock)
                            let newSisa = Math.floor(sisaStock * select[0].netto_perbotol)
                            console.log('sisa ml', newSisa)

                            const updateNewStock = `UPDATE obat_kimia SET stock = '${updateStock}', sisa_stock = '${newSisa}' WHERE id = '${item.product_id}'`
                            const resultNewStock = await asyncQuery(updateNewStock)

                            const getNewData = `SELECT * FROM obat_kimia`
                            const resultNewData = await asyncQuery(getNewData)
                            console.log('fina;l',resultNewData)
                        }
                    })
                    res.status(200).send('Payment and update Succes')

        } catch (err) {
            console.log(err)
            res.status(500).console.log(err)
        }
    },
    rejectPayment : async(req, res) => {
        const id = parseInt(req.params.id)
        try {
            const reject = `UPDATE transactions SET status_payment = 3 WHERE id = ${id}`
            const result = await asyncQuery(reject)

            const rejectOrder = `UPDATE orders SET status = 5 WHERE id = ${id}`
            const resultOrder = await asyncQuery(rejectOrder)
            res.status(200).send("Payment Rejected!")
        } catch(err) {
            console.log(err)
            res.status(500).console.log(err)
        }
    }

}