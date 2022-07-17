const { normalize, denormalize, schema } = require('normalizr');
class Normal {
    apply(dataobject) {
        const messages = JSON.parse(JSON.stringify(dataobject));//esto muy importante porque el formato no es como json requerido
        const author = new schema.Entity('author')
        const messageSchema = new schema.Entity('mensaje', {
            author: author,
        }, { idAttribute: '_id' })
        const post = new schema.Entity('post', {
            messages: [messageSchema],
        })
        const temp = { id: 'mensajes', messages }
        return normalize(temp, post);
    }
}
module.exports = Normal