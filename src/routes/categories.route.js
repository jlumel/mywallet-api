import categoriesController from '../controllers/categories.controller.js'

const Categories = router => {
    router.get('/categories', (req, res) => {
        categoriesController.getCategories(req, res)
    }),
    router.get('/categories/:id', (req, res) => {
        categoriesController.getCategoryById(req, res)
    }),
    router.post('/categories', (req, res) => {
        categoriesController.createCategory(req, res)
    }),
    router.put('/categories/:id', (req, res) => {
        categoriesController.modifyCategory(req, res)
    }),
    router.delete('/categories/:id', (req, res) => {
        categoriesController.deleteCategory(req, res)
    })
}

export default Categories