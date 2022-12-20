import {Sequelize} from 'sequelize'
import sequelize from '../config/Database.js'

const {DataTypes} = Sequelize

const User = sequelize.define('users', {
    name: {
        type: DataTypes.STRING,
        allowNull:false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    refresh_token: {
        type: DataTypes.TEXT
    }
},
{
    freezeTableName: true,
    timestamps: false
})

await User.sync()

export default User
