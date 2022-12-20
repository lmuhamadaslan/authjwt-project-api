import User from '../models/UserModels.js';
import jwt, { decode } from 'jsonwebtoken';

export const refreshToken = async (req, res) => {
  try {
    // get cookie from browser
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(401);

    // get user berdasarkan refresh_token
    const user = await User.findAll({
      where: {
        refresh_token: refreshToken,
      },
    });
    if (!user[0]) return res.sendStatus(403);

    // melakukan verify cookie dan decoded
    jwt.verify(refreshToken, 'jwt_refresh_token', (err, decoded) => {
      if (err) return res.sendStatus(403);

      // get id, name, email dan set accessToken
      const userId = user[0].id;
      const name = user[0].name;
      const email = user[0].email;
      const accessToken = jwt.sign(
        { userId, name, email },
        'jwt_access_token',
        {
          expiresIn: '15s',
        }
      );
      res.json({ accessToken });
    });
  } catch (error) {
    console.log(error)
  }
};
