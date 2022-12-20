import jwt from 'jsonwebtoken'

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if(token == null) return res.sendStatus(401);
    jwt.verify(token, "jwt_access_token", (err, decoded) => {
        if(err) return res.sendStatus(403)
        req.email = decoded.email
        next()
    })
}