const express = require('express')
const router = express.Router();
const controller = require('../controllers/tasks')
const {validationResult, body} = require('express-validator')

router.get('/', ( req, res) => {
    controller.getAllTasks(req,res);
})

router.get('/:id', ( req, res) => {
    controller.getOneTask(req,res);
})

router.post('/', (req, res) => {
    controller.createTask(req, res);
})

/* que infromações são necessarias*/
router.put('/:id', (req, res) => {
    controller.updateTask(req, res)
})

// router.put('/:id/workers/:id', (req, res) => {
//     controller.updateTaskTime(req, res)
// })

router.delete('/:id', (req, res) => {
    controller.deleteTask(req, res)
})

// router.delete('/:id/workers/:id', (req, res) => {
//     controller.deletetaskTime(req, res)
// })

module.exports = router