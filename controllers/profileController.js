const { asyncQuery, generateQuery } = require('../helper/queryHelp')

module.exports = {
    getProfile : async (req, res) => {
        const id = parseInt(req.params.id)
        try {
            const query = `SELECT * FROM profile WHERE user_id = ${id}`
            const result = await asyncQuery(query)

            res.status(200).send(result[0])
        } catch (err) {
            console.log(err)
            res.status(500).send(err)
        }
    },
    editProfile : async (req, res) => {
        const id = parseInt(req.params.id)
        try {
            const checkUser = `select * from profile where user_id = ${id}`
            const user = await asyncQuery(checkUser)

            if (user.length === 0) {
                return res.status(400).send('user doesn\'t exist.')
            }

            const edit = `update profile set ${generateQuery(req.body)} where user_id = ${id}`
            const info = await asyncQuery(edit)

            res.status(200).send(info)
        } catch (err) {
            console.log(err)
            res.status(500).send(err)
        }
    },
    upload : async (req, res) => {
        const id = parseInt(req.params.id)

        console.log('file : ', req.file)
        if (req.file === undefined) {
            return res.status(400).send('no image.')
        }

        try {
            const img = `update profile set image = 'images/${req.file.filename}' where user_id = ${id}`
            const result = await asyncQuery(img)

            res.status(200).send(result)
        } catch (err) {
            console.log(err)
            res.status(500).send(err)
        }
    }
}