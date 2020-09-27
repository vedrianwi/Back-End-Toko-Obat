const { generateQuery, asyncQuery } = require('../helper/queryHelp')

module.exports = {
    getHistory: async (req, res) => {
        try {
            const query = `select t.id, t.order_number,pt.type_payment,  t.total, ps.status_payment,  od.qty, t.bukti_transfer, od.product_id
            FROM transactions t 
            JOIN payment_types pt ON t.payment_type = pt.id
            JOIN payment_status ps ON t.status_payment = ps.id
            JOIN order_details od ON t.order_number = od.order_number
            GROUP BY order_number;`

            const result = await asyncQuery(query)
            res.status(200).send(result)
        } catch (err) {
            console.log(err)
        }
    },
    getStock: async (req, res) => {
        try {
            const query = `select ok.id, ok.nama_kimia, jk.jenis_kimia, ok.harga, s.satuan, 
            ok.stock, ok.netto_perbotol, ok.total_ml, ok.sisa_stock
            from obat_kimia ok 
            join jenis_kimia jk ON ok.jenis_kimia = jk.id
            join satuan s on ok.satuan = s.id;`
            const result = await asyncQuery(query)
            console.log('ini', result)
            res.status(200).send(result)
        } catch (err) {
            console.log(err)
            res.status(500).send(err)
        }
    }
}
