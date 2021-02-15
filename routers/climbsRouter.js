const express = require('express')
const router = express.Router()
const authMiddleware = require('../config/authMiddleware')
const climbsCtrl = require('../controllers/climbsController')

// - - - public routes - - -
router.post('/:id', climbsCtrl.create)

// - - - private routes - - -
router.post('/', authMiddleware.checkAuth, climbsCtrl.create)

module.exports = router