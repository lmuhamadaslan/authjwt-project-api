import { Sequelize } from "sequelize";

const sequelize = new Sequelize("auth_db", "root", "", {
    host: "localhost",
    dialect: "mysql",
    logging: false
})

try {
    await sequelize.authenticate()
    console.log("Connection has been established successfully.")
} catch (error) {
    console.log("cannot connet to database.", error)
}

export default sequelize