import User from '../models/UserModels.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const getUsers = async (req, res) => {
  try {
    // get data user except password
    const data = await User.findAll({
      attributes: { exclude: ['password'] },
    });
    res.status(200).json(data);
  } catch (error) {
    res.json({ message: error.message });
  }
};

export const register = async (req, res) => {
  const { name, email, password, confPassword } = req.body;
  if (password !== confPassword)
    return res.status(400).json('Password dan Confirm Password tidak cocok');

  // hashpassword and create user
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);

  try {
    await User.create({
      name: name,
      email: email,
      password: hash,
    });
    res.json('Register berhasil');
  } catch (error) {
    res.json(error);
  }
};

export const login = async (req, res) => {
  try {
    // chcek email
    const user = await User.findAll({
      where: {
        email: req.body.email,
      },
    });

    // compare password
    const match = bcrypt.compareSync(req.body.password, user[0].password);
    if (!match) return res.status(400).json({ msg: 'Password Salah' });

    // kalau benar set token pada id, email, name
    const userId = user[0].id;
    const name = user[0].name;
    const email = user[0].email;
    const accessToken = jwt.sign({ userId, name, email }, 'jwt_access_token', {
      expiresIn: '20s',
    });
    const refreshToken = jwt.sign(
      { userId, name, email },
      'jwt_refresh_token',
      {
        expiresIn: '1d',
      }
    );

    // update refresh_token pada database dengan refreshToken
    await User.update(
      { refresh_token: refreshToken },
      {
        where: {
          id: userId,
        },
      }
    );

    // set cookie untuk dikirimkan pada browser
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.json({ accessToken });
  } catch (error) {
    res.status(404).json({ msg: 'Email tidak ditemukan' });
  }
};

export const logout = async (req, res) => {
  // ambil cookie dari browser
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(204);

  // get data colom refresh_token pada database
  const user = await User.findAll({
    where: {
      refresh_token: refreshToken,
    },
  });
  if (!user[0]) return res.sendStatus(204);

  // set refresh_token menjadi null berdasarkan id
  const userId = user[0].id;
  await User.update(
    { refresh_token: null },
    {
      where: {
        id: userId,
      },
    }
  );

  // hapus cookie pada browser
  res.clearCookie('refreshToken');
  return res.sendStatus(200);
};
