import SubCategories from '../models/Subcategories.model.js'
import Transactions from '../models/Transactions.model.js'

const subCategoriesController = {

    getSubCategories: async (req, res) => {

        const userId = req.session.user._id

        try {
            const subCategories = await SubCategories.find({ userId }).exec()
            res.json(subCategories)
        } catch (err) {
            res.status(500).json({ error: 'Internal server error' })
        }

    },
    getSubCategoryById: async (req, res) => {

        const userId = req.session.user._id
        const { id } = req.params

        try {
            const subCategory = await SubCategories.find({ userId, _id: id }).exec()
            res.json(subCategory)
        } catch (err) {
            res.status(500).json({ error: 'Internal server error' })
        }


    },
    createSubCategory: (req, res) => {

        const userId = req.session.user._id

        const { name } = req.body

        if (name) {

            const category = {
                name,
                userId,
            }

            const newSubCategory = new SubCategories(category)

            newSubCategory.save()
                .then(async () => {

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
        const { name } = req.body.name

        try {

            if (name) {
                const subCategory = { name }
                const oldSubcategory = await SubCategories.findOne({ _id: id })
                await SubCategories.findOneAndUpdate({ _id: id },
                    {
                        $set: { ...subCategory }
                    }
                )

                await Transactions.updateMany({ userId: req.session.user._id, subCategoryName: oldSubcategory.name }, { subCategoryName: req.body.name })

                res.json({ message: "Subcategory updated successfully" })
            }

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
                await SubCategories.deleteOne({ _id: id })

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