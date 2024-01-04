import subcategoriesController from '../controllers/subcategories.controller.js'

const Subcategories = router => {
    router.get('/subcategories', (req, res) => {
        subcategoriesController.getSubcategories(req, res)
    })
    router.get('/subcategories/:id', (req, res) => {
        subcategoriesController.getSubcategoryById(req, res)
    })
    router.post('/subcategories', (req, res) => {
        subcategoriesController.createSubcategory(req, res)
    })
    router.put('/subcategories/:id', (req, res) => {
        subcategoriesController.modifySubcategory(req, res)
    })
    router.delete('/subcategories/:id', (req, res) => {
        subcategoriesController.deleteSubcategory(req, res)
    })
}

export default Subcategories