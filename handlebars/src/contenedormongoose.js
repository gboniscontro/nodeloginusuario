const mongoose = require('mongoose')

class ContenedorMensaje {
    constructor() {
        const uriClient = 'mongodb://127.0.0.1:27017/test'
        //const uriCloud = "mongodb+srv://sersenlinea:sersenlinea@cluster0.amioq.mongodb.net/?retryWrites=true&w=majority"
        mongoose.connect(uriClient)
            .then(db => console.log('conectados a la base de datos'))
            .catch(err => console.log(err))
        this.Mensajes = require('./mensajes')

    }
    async getAll() {
        const msjs  = await this.Mensajes.find({})
        return msjs
    }


    async save(message) {
        const msjsavemodel = new  this.Mensajes(message)
        let msjsave  = await msjsavemodel.save()
    }


}
module.exports = { ContenedorMensaje }