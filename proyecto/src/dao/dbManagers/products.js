import productsModel from "../models/products.js";

export default class Products {
    async getAll() {
        return await productsModel.find({}).lean();
    }
    async getById(id) {
        return await productsModel.find({ _id: id });
    }
    async save(data) {
        const respuesta = productsModel.create(data);
        return respuesta;
    }
    update = async (id, data) => {
        const respuesta = productsModel.findByIdAndUpdate(id, data);
        return respuesta;
    };
    delete = async (id, data) => {
        const respuesta = productsModel.findByIdAndDelete(id);
        return respuesta;
    };
}