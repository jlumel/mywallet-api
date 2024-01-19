import Subcategories from '../models/Subcategories.model.js'
import Transactions from '../models/Transactions.model.js'
import { errorLog } from '../service/logger.service.js'

const subcategoriesController = {

    getSubcategories: async (req, res) => {

        const userId = req.session.user._id

        try {
            const subcategories = await Subcategories.find({ userId })
            res.json(subcategories)
        } catch (err) {
            errorLog.error(err)
            res.status(500).json({ error: 'Internal server error' })
        }

    },
    getSubcategoryById: async (req, res) => {

        const userId = req.session.user._id
        const { id } = req.params

        try {
            const subcategory = await Subcategories.find({ userId, _id: id })
            res.json(subcategory)
        } catch (err) {
            errorLog.error(err)
            res.status(500).json({ error: 'Internal server error' })
        }


    },
    createSubcategory: (req, res) => {

        const userId = req.session.user._id

        const { name, categoryName } = req.body

        if (name && categoryName) {

            const subcategory = {
                name,
                categoryName,
                userId,
            }

            const newSubcategory = new Subcategories(subcategory)

            newSubcategory.save()
                .then(() => {

                    res.status(201).json({ message: "Subcategory created successfully" })
                })
                .catch(err => {
                    errorLog.error(err)
                    return res.status(400).json({ error: "The Subcategory could not be created" })
                })
        } else {
            return res.status(400).json({ message: "Information is missing" })
        }
    },
    modifySubcategory: async (req, res) => {

        const { id } = req.params

        try {
            const subcategory = {}
            for (const key in req.body) {
                if (req.body[key]) {
                    subcategory[key] = req.body[key]
                }
            }

            const oldSubcategory = await Subcategories.findOne({ _id: id })
            await Subcategories.findOneAndUpdate({ _id: id },
                {
                    $set: { ...subcategory }
                }
            )
            try {
                if (req.body.name) {
                    await Transactions.updateMany({ userId: req.session.user._id, name: oldSubcategory.name }, { name: req.body.name })
                }
                if (req.body.categoryName) {
                    await Transactions.updateMany({ userId: req.session.user._id, categoryName: oldSubcategory.categoryName }, { categoryName: req.body.categoryName })
                }
            } catch (err) {
                errorLog.error(err)
            }



            res.json({ message: "Subcategory updated successfully" })

        } catch (err) {
            errorLog.error(err)
            return res.status(500).json({ error: 'Internal server error' })
        }

    },
    deleteSubcategory: async (req, res) => {

        const { id } = req.params
        const { name } = req.query

        try {
            const count = await Transactions.countDocuments({ subcategoryName: name })
            if (count) {
                return res.status(400).json({ message: "The subcategory has related transactions. Delete them first to delete the subcategory" })
            }

            try {
                await Subcategories.deleteOne({ _id: id })

                res.json({ message: "Subcategory deleted successfully" })

            } catch (err) {
                errorLog.error(err)
                return res.status(500).json({ error: 'Internal server error' })
            }

        } catch (err) {
            errorLog.error(err)
            return res.status(500).json({ error: 'Internal server error' })
        }

    }
}

export default subcategoriesController