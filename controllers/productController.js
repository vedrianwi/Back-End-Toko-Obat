// import helper untuk query
const {generateQuery, asyncQuery} = require('../helper/queryHelp')

module.exports = {
    getProduct : async (req, res) => {
        const query = `SELECT * FROM obat_jadi`
        try {   
            const result = await asyncQuery(query)
            console.log(result)
            res.status(200).send(result)
        } catch (err) {
            console.log(err)
            res.status(500).send(err)
        }
    },
    addProduct : async (req,res) => {
        console.log('body', req.body)
        const {nama, image, deskripsi, komposisi, dosis, aturan_pakai, harga, stock} = req.body

        try {
            const query = `INSERT INTO product_obat ( nama, image, deskripsi, komposisi, dosis, aturan_pakai, harga, stock)
                            VALUES ('${nama}', '${image}', '${deskripsi}', '${komposisi}', '${dosis}', '${aturan_pakai}', '${harga}', '${stock}')`
            
            const result = await asyncQuery(query)
            res.status(200).send(result)

        } catch (err) {
            console.log(err)
            res.status(500).send(err)
        }
    },
    editProduct : async (req, res) => {
        const id = parseInt(req.params.id)
        console.log('body', req.body)
        try {
            // check apakah product ada didatabase
            const checkProduct = `SELECT * FROM obat_jadi WHERE id=${id}`
            const check = await asyncQuery(checkProduct)
            if (check.length === 0) return res.status(400).send('product doesn\'t exist.')

            // edit product
            const query = `UPDATE obat_jadi SET ${generateQuery(req.body)} WHERE id=${id}`
            const result =  await asyncQuery(query)

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
             const checkProduct = `SELECT * FROM product_obat WHERE id=${id}`
             const check = await asyncQuery(checkProduct)
             if (check.length === 0) return res.status(400).send('product doesn\'t exist.')

            // hapus product dari database
            const query = `DELETE FROM obat_jadi WHERE id=${id}`
            const result = await asyncQuery(query)

            res.status(200).send(result)

        } catch (err) {
            console.log(err)
            res.status(500).send(err)
        }
    },
    categoryProduct : async(req, res) => {
        const params = req.params.category
        console.log(params)
        try {
            const query = `SELECT * FROM obat_jadi WHERE category = '${params}'`
            const result = await asyncQuery(query)
            console.log(result)

            res.status(200).send(result)
        } catch (err) {
            console.log(err)
            res.status(500).send(err)
        }
    },
    getProductByID : async(req, res) => {
        try {
            const id = req.query.id
            console.log("query",id)
            const query = `SELECT * FROM obat_jadi WHERE id = ${req.query.id}`
            console.log(id)

            const result = await asyncQuery(query)

            res.status(200).send(result)
        } catch(err){
            console.log(err)
            res.status(500).send(err)
        }
    },
}
