import subCategoriesController from '../controllers/subcategories.controller.js'

const SubCategories = router => {
    router.get('/subcategories', (req, res) => {
        subCategoriesController.getSubCategories(req, res)
    }),
    router.get('/subcategories/:id', (req, res) => {
        subCategoriesController.getSubCategoryById(req, res)
    }),
    router.post('/subcategories', (req, res) => {
        subCategoriesController.createSubCategory(req, res)
    }),
    router.put('/subcategories/:id', (req, res) => {
        subCategoriesController.modifySubCategory(req, res)
    }),
    router.delete('/subcategories/:id', (req, res) => {
        subCategoriesController.deleteSubCategory(req, res)
    })
}

export default SubCategories