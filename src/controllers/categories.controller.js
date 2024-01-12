import Categories from '../models/Categories.model.js'
import Subcategories from '../models/Subcategories.model.js'
import Transactions from '../models/Transactions.model.js'
import { errorLog } from '../service/logger.service.js'

const categoriesController = {

    getCategories: async (req, res) => {

        const userId = req.session.user._id

        try {
            const categories = await Categories.find({ userId }).exec()
            res.json(categories)
        } catch (err) {
            errorLog.error(err)
            res.status(500).json({ error: 'Internal server error' })
        }

    },
    getCategoryById: async (req, res) => {

        req.session.user._id
        const { id } = req.params

        try {
            const category = await Categories.find({ userId, _id: id }).exec()
            res.json(category)
        } catch (err) {
            errorLog.error(err)
            res.status(500).json({ error: 'Internal server error' })
        }

    },
    createCategory: (req, res) => {

        const userId = req.session.user._id

        const { name } = req.body

        if (name) {

            const category = {
                name,
                userId,
            }

            const newCategory = new Categories(category)

            newCategory.save()
                .then(async () => {

                    res.status(201).json({ message: "Category created successfully" })
                })
                .catch(err => {
                    errorLog.error(err)
                    return res.status(400).json({ error: "The category could not be created" })
                })
        } else {
            return res.status(400).json({ message: "Information is missing" })
        }

    },
    modifyCategory: async (req, res) => {

        const { id } = req.params
        const { name } = req.body.name

        try {

            if (name) {
                const category = { name }
                const oldCategory = await Categories.findeOne({ _id: id })
                await Categories.findOneAndUpdate({ _id: id },
                    {
                        $set: { ...category }
                    }
                )

                await Transactions.updateMany({ userId: req.session.user._id, categoryName: oldCategory.name }, { categoryName: req.body.name })

                await Subcategories.updateMany({ userId: req.session.user._id, categoryName: oldCategory.name }, { categoryName: req.body.name })

                res.json({ message: "Subcategory updated successfully" })
            }

        } catch (err) {
            errorLog.error(err)
            return res.status(500).json({ error: 'Internal server error' })
        }

    },
    deleteCategory: async (req, res) => {

        const { id } = req.params
        const { name } = req.query

        try {

            const subcategoriesCount = await Subcategories.countDocuments({ categoryName: name })

            if (subcategoriesCount) {
                return res.status(400).json({ message: "The category has related subcategories. Delete them first to delete the category" })
            }

            const transactionsCount = await Transactions.countDocuments({ categoryName: name })

            if (transactionsCount) {
                return res.status(400).json({ message: "The category has related transactions. Delete them first to delete the category" })
            }

            try {

                await Categories.deleteOne({ _id: id })

                res.json({ message: "Category deleted successfully" })

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

export default categoriesController