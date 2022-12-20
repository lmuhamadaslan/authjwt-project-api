import express from 'express'
import { refreshToken } from '../controllers/RefreshToken.js'
import { getUsers, login, logout, register } from '../controllers/UserController.js'
import { verifyToken } from '../middleware/VerifyToken.js'

const router = express.Router()

// membuat endpoint
router.get("/users", verifyToken, getUsers)
router.post("/register", register)
router.post("/login", login)
router.get('/token', refreshToken)
router.delete("/logout", logout)

export default router