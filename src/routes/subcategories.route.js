import subcategoriesController from '../controllers/subcategories.controller.js'
import requireAuth from '../middleware/requireAuth.js'

const Subcategories = router => {

    router.get('/subcategories', requireAuth, subcategoriesController.getSubcategories)

    router.get('/subcategories/:id', requireAuth, subcategoriesController.getSubcategoryById)

    router.post('/subcategories', requireAuth, subcategoriesController.createSubcategory)

    router.put('/subcategories/:id', requireAuth, subcategoriesController.modifySubcategory)

    router.delete('/subcategories/:id', requireAuth, subcategoriesController.deleteSubcategory)
}

export default Subcategories