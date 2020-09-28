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
    },
    getHistoryRacik : async(req, res) => {
        try {
            const query = `select od.id, od.order_number, group_concat(od.qty) as qty, od.total, od.satuan, group_concat(s.satuan) as satuan, group_concat(p.nama_kimia) as nama_kimia, ts.status_order
            from order_details od
            JOIN table_status ts  ON od.order_number = ts.order_number
            JOIN obat_kimia p ON od.product_id = p.id
            JOIN satuan s ON od.satuan = s.id
            GROUP BY od.order_number
            HAVING od.satuan >= 1;`
            const result = await asyncQuery(query)
            res.status(200).send(result)
        } catch(err) {
            console.log(err)
        }
    },
    getHistoryJadi : async(req, res) => {
        try {
            const query = `select od.id, od.order_number, group_concat(od.qty) as qty, od.total, od.satuan, group_concat(s.satuan) as satuan, group_concat(p.nama_kimia) as nama_kimia, ts.status_order
            from order_details od
            JOIN table_status ts  ON od.order_number = ts.order_number
            JOIN obat_kimia p ON od.product_id = p.id
            JOIN satuan s ON od.satuan = s.id
            GROUP BY od.order_number
            HAVING od.satuan >= 1;`
            const result = await asyncQuery(query)
            res.status(200).send(result)
        } catch(err) {
            console.log(err)
        }
    }
}
