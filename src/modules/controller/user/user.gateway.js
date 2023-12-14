const { query } = require('../../../utils/mysql');
const { hashPassword } = require("../../../utils/functios");

const findAll = async() => {
    const sql = "SELECT * FROM User";
    return await query(sql, []);
}

const findById = async(id) => {
    if(Number.isNaN(id)) throw Error("Wrong Type");
    if(!id) throw Error("Missing fields");
    const sql = `SELECT * FROM User WHERE id = ?`;
    return await query(sql, [id]);
}

// Define el ID del rol de cajero
const ID_ROL_CAJERO = 2; // Puedes ajustar este valor según tus necesidades

// Modifica la función `save` en tu gateway
const save = async (user) => {
    if (!user.username || !user.password || !user.status || !user.roleId) {
      throw Error("Missing fields");
    }
  
    const sql = `INSERT INTO User (username, password, status, rol_fk) VALUES(?,?,?,?)`;
    const hashPass = await hashPassword(user.password);
    const { insertId } = await query(sql, [user.username, hashPass, 1, user.roleId]);
  
    // Obtener dinámicamente el ID del cajero por defecto
    const cajeroSql = `SELECT id FROM User WHERE rol_fk = ? LIMIT 1`;
    const cajeroResult = await query(cajeroSql, [user.roleId]);
    const idCajeroPorDefecto = cajeroResult[0].id;
  
    // Insertar un registro en la tabla Carrito para el nuevo usuario
    const carritoSql = `INSERT INTO Carrito (user_fk, item_fk, cantidad, fecha_agregado) VALUES (?, 0, 0, NOW())`;
    await query(carritoSql, [insertId]);
  
    // Insertar un registro en la tabla Renta para el nuevo usuario
    const rentaSql = `INSERT INTO Renta (user_fk, fecha, item_fk, cajero_id) VALUES (?, NOW(), 0, ?)`;
    await query(rentaSql, [insertId, idCajeroPorDefecto]);
  
    delete user.password;
    return { ...user, id: insertId };
  };
  


  
const update = async(user, id) => {
    if(Number.isNaN(id)) throw Error("Wrong Type");
    if(!id) throw Error("Missing fields");
    if(!user.username || !user.password || !user.status || !user.roleId) throw Error("Missing fields");
    const sql = `UPDATE User SET username=?, password=?, status=?, rol_fk WHERE id=?`;
    const hashPass = await hashPassword(user.password);
    await query(sql, [
        user.username,
        hashPass,
        user.status,
        user.roleId,
        id
    ]);
    return {...user, id:id}
}
const remove = async(id) => {
    if(Number.isNaN(id)) throw Error("Wrong Type");
    if(!id) throw Error("Missing fields");
    const sql = `DELETE FROM User WHERE id=?`;
    await query(sql, []);
    return {idDeleted: id};
}
module.exports = {
    findAll,
    findById,
    save,
    update,
    remove
};