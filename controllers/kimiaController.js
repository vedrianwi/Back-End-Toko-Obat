// import helper untuk query
const { generateQuery, asyncQuery } = require('../helper/queryHelp')

module.exports = {
    getProductKimia: async (req, res) => {
        const query = `SELECT * FROM kimia`
        try {
            const result = await asyncQuery(query)
            console.log(result)
            res.status(200).send(result)
        } catch (err) {
            console.log(err)
            res.status(500).send(err)
        }
    },
    categoryKimia: async (req, res) => {
        const params = req.params.category
        console.log(params)
        try {
            const query = `SELECT o.id, o.nama_kimia, o.harga, s.satuan, o.stock, o.netto_perbotol, jk.jenis_kimia as jenis, o.jenis_kimia
            FROM obat_kimia o
            JOIN satuan s on o.satuan = s.id
            JOIN jenis_kimia jk on o.jenis_kimia = jk.id
            WHERE o.jenis_kimia = '${params}';`

            const result = await asyncQuery(query)
            console.log(result)
            res.status(200).send(result)
        } catch (err) {
            console.log(err)
            res.status(500).send(err)
        }
    },
    addProductKimia: async (req, res) => {
        console.log('body', req.body)
        const { nama, satuan, takaran, harga, jenis_kimia } = req.body
        try {
            const query = `INSERT INTO obat_kimia ( nama, satuan, takaran,harga,jenis_kimia)
                            VALUES ('${nama}', '${satuan}', '${takaran}', '${harga}', '${jenis_kimia}')`

            const result = await asyncQuery(query)
            res.status(200).send(result)

        } catch (err) {
            console.log(err)
            res.status(500).send(err)
        }
    },
    editProduct: async (req, res) => {
        const id = parseInt(req.params.id)
        const {stock} = req.body
        try {
            // check apakah product ada didatabase
            const checkProduct = `SELECT * FROM obat_kimia WHERE id=${id}`
            const check = await asyncQuery(checkProduct)
            if (check.length === 0) return res.status(400).send('product doesn\'t exist.')

            let botolNow = check[0].stock
            console.log('ini', botolNow)
            let totalNew = (stock - botolNow)*check[0].netto_perbotol
            console.log(totalNew)

            // edit product
            const query = `UPDATE obat_kimia SET stock = '${stock}', total_ml = '${check[0].total_ml + totalNew}' WHERE id=${id}`
            const result = await asyncQuery(query)

            // send response
            res.status(200).send(result)

        } catch (err) {
            console.log(err)
            res.status(500).send(err)
        }
    },
    deleteProduct : async (req, res) => {
        const id = parseInt(req.params.id)
        try { 
             // check apakah product ada didatabase
             const checkProduct = `SELECT * FROM obat_kimia WHERE id=${id}`
             const check = await asyncQuery(checkProduct)
             if (check.length === 0) return res.status(400).send('product doesn\'t exist.')

            // hapus product dari database
            const query = `DELETE FROM obat_kimia WHERE id=${id}`
            const result = await asyncQuery(query)

            res.status(200).send(result)

        } catch (err) {
            console.log(err)
            res.status(500).send(err)
        }
    },
}