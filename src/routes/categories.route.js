import categoriesController from '../controllers/categories.controller.js'
import requireAuth from '../middleware/requireAuth.js'

const Categories = router => {

    router.get('/categories', requireAuth, categoriesController.getCategories)

    router.get('/categories/:id', requireAuth, categoriesController.getCategoryById)

    router.post('/categories', requireAuth, categoriesController.createCategory)

    router.put('/categories/:id', requireAuth, categoriesController.modifyCategory)

    router.delete('/categories/:id', requireAuth, categoriesController.deleteCategory)
}

export default Categories