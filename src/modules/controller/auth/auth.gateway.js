const { query } = require("../../../utils/mysql");
const {generateToken} = require("../../../config/jwt");
const {validatePassword} = require("../../../utils/functios");

const login = async(user) => {
    const {username, password} = user;
    if(!username || !password) throw Error("Missing Fields");
    const sql = `SELECT * FROM User WHERE username=? AND status=1`;
    const exist = await query(sql, [username]);
    if(
        await validatePassword(password, exist[0].password)
    )
    return generateToken({
        id: exist[0].id,
        username: exist[0].username,
        role: exist[0].rol_fk,
        isLogged: true
    })
    throw Error('Password missmatch');
}

module.exports = {
    login
};