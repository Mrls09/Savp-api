const { query } = require("../../../utils/mysql");
const { sendEmail, sendEmailRenta } = require("../auth/emailServer");
const { changeStatusProceso, findByIdItem } = require("../item/item.gateway");
const { findByIdUser } = require("../user/user.gateway");

const findAll = async () => {
    const sql = `SELECT * FROM Renta`;
    return await query(sql, []);
}

const findRentasUser = async (idUser) => {
    if (Number.isNaN(idUser)) throw Error("Wrong type");
    if (!idUser) throw Error("Missing Fields");
    const sql = `
    SELECT * FROM renta WHERE user_fk=?
`;

    const respuesta = await query(sql, [idUser]);
    console.log(respuesta.length, "hola");
    return respuesta.length === 0 ? true : false;
}

const findAllByUser = async (idUser) => {
    if (Number.isNaN(idUser)) throw Error("Wrong type");
    if (!idUser) throw Error("Missing Fields");
    const sql = `
    SELECT R.*, I.*, P.titulo AS producto_titulo, P.imagen AS producto_imagen
    FROM Renta R
    JOIN Item I ON R.item_fk = I.id
    JOIN Producto P ON I.producto_fk = P.id
    WHERE R.user_fk = ?
`;
    return await query(sql, [idUser]);
}
const findById = async (id) => {
    if (Number.isNaN(id)) throw Error("Wrong type");
    if (!id) throw Error("Missing Fields");
    const sql = `SELECT * FROM Renta WHERE id = ? `;
    return await query(sql, [id]);
}
const save = async (renta) => {
    if (!renta.userId || !renta.itemId || !renta.cajeroId) throw Error("Missing fields");
    if (!await findRentasUser(renta.userId)) throw Error("Renta activa");
    const sql = `INSERT INTO Renta (user_fk, item_fk,fecha, cajero_id, fecha_entrega) VALUES(?,?,?,?,?)`;
    const userData = await findByIdUser(renta.userId);
    const itemData = await findByIdItem(renta.itemId);
    const { username } = userData[0];
    const { descripcion, titulo, item_desc, plataforma } = itemData[0];
    console.log(userData, itemData, renta);
    await changeStatusProceso(renta.itemId);
    let fecha = new Date();

    await sendEmailRenta(username, { descripcion, titulo, item_desc, plataforma });
    const { insertedId } = await query(sql, [
        renta.userId,
        renta.itemId,
        fecha,
        renta.cajeroId,
        new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }).split('/').reverse().join('-')
    ]);
    return { ...renta, id: insertedId };
}


const remove = async (id) => {
    if (Number.isNaN(id)) throw Error("Wrong TYpe");
    if (!id) throw Error("Missing fields");
    const sql = `DELETE FROM Renta WHERE id=?`;
    await query(sql, []);
    return { idDeleted: id };
}
module.exports = {
    findAll,
    findAllByUser,
    findById,
    save,
    remove
};