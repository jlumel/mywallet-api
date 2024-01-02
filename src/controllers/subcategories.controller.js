import Subcategories from '../models/Subcategories.model.js'
import Transactions from '../models/Transactions.model.js'
import { logger } from '../service/logger.service.js'

const subCategoriesController = {

    getSubCategories: async (req, res) => {

        const userId = req.session.user._id

        try {
            const subcategories = await Subcategories.find({ userId }).exec()
            res.json(subcategories)
        } catch (err) {
            res.status(500).json({ error: 'Internal server error' })
        }

    },
    getSubCategoryById: async (req, res) => {

        const userId = req.session.user._id
        const { id } = req.params

        try {
            const subCategory = await Subcategories.find({ userId, _id: id }).exec()
            res.json(subCategory)
        } catch (err) {
            res.status(500).json({ error: 'Internal server error' })
        }


    },
    createSubCategory: (req, res) => {

        const userId = req.session.user._id

        const { name } = req.body

        if (name) {

            const subCategory = {
                name,
                userId,
            }

            const newSubCategory = new Subcategories(subCategory)

            newSubCategory.save()
                .then(() => {

                    res.status(201).json({ message: "Subcategory created successfully" })
                })
                .catch(err => {
                    return res.status(400).json({ error: "The Subcategory could not be created" })
                })
        } else {
            return res.status(400).json({ message: "Information is missing" })
        }

    },
    modifySubCategory: async (req, res) => {

        const { id } = req.params

        try {
            const subCategory = {}
            for (const key in req.body) {
                subCategory[key] = req.body[key]
            }

            const oldSubcategory = await Subcategories.findOne({ _id: id })
            await Subcategories.findOneAndUpdate({ _id: id },
                {
                    $set: { ...subCategory }
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
                logger.info("No related transactions")
            }



            res.json({ message: "Subcategory updated successfully" })

        } catch (err) {
            return res.status(500).json({ error: 'Internal server error' })
        }

    },
    deleteSubCategory: async (req, res) => {

        const { id } = req.params
        const { name } = req.body

        try {
            const count = await Transactions.countDocuments({ subCategoryName: name })
            if (count) {
                return res.status(400).json({ message: "The subcategory has related transactions. Delete them first to delete the subcategory" })
            }

            try {
                await Subcategories.deleteOne({ _id: id })

                res.json({ message: "Subcategory deleted successfully" })

            } catch (err) {
                return res.status(500).json({ error: 'Internal server error' })
            }

        } catch (err) {
            return res.status(500).json({ error: 'Internal server error' })
        }

    }
}

export default subCategoriesController