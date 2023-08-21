import mongoose from "mongoose";

const productsCollection = "Products";

const productsSchema = new mongoose.Schema({
    icon: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    rank:{
        type: String,
        required: true,
    },
    pattack: {
        type: Number,
        required: true,
    },
    mattack: {
        type: Number,
        required: true,
    },
    atkspd: {
        type: Number,
        required: true,
    },
    critical: {
        type: Number,
        required: true,
    },
    soulshots: {
        type: String,
        required: true,
    },
    spiritshots: {
        type: String,
        required: true,
    },
    weight: {
        type: Number,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
});

const productsModel = mongoose.model(productsCollection, productsSchema);

export default productsModel;