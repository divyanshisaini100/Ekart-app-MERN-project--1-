import CartModel from "../models/CartModel.js";

export const addToCart = async function(req, res){
    try{
        const productid = req.params.id;
        const userid = req.user._id;

        const { selectedColor, selectedSize, quantity } = req.body;

        if (!Number.isInteger(quantity) || quantity < 1) {
            return res.status(400).json({
                message: "Quantity must be at least 1"
            });
        }

        const itemExisting = await CartModel.findOne({userid, productid, selectedColor: selectedColor  || "", selectedSize: selectedSize || ""});

        if (itemExisting) {
            itemExisting.quantity += quantity;

            await itemExisting.save();

            return res.status(200).json({
                message: "Quantity increased successfully!",
                cartItem: itemExisting
            });
        }
        const item = await CartModel.create({
            userid,
            productid,
            selectedColor: selectedColor || "",  //why (|| "") ???
            selectedSize: selectedSize || "",
            quantity
        });
        
        return res.status(201).json({message: "new item added to cart!", cartItem: item});
        

    }catch(err){
        console.log(err.message);
        return res.status(400).json({message: "Failed to add product to cart", error: err.message});
    }
    
}

export const updateCart = async function(req, res){

    try {
        const userid = req.user._id;
        const cartItemId = req.params.id;
        const { quantity } = req.body;

        if (quantity < 1) {
            return res.status(400).json({
                message: "Quantity must be at least 1"
            });
        }

        const cartItem = await CartModel.findOne({
            _id: cartItemId,
            userid
        });

        if (!cartItem) {
            return res.status(404).json({
                message: "Cart item not found"
            });
        }

        cartItem.quantity = quantity;

        await cartItem.save();

        return res.status(200).json({
            message: "Cart quantity updated",
            cartItem
        });

    } catch (err) {

        console.log(err.message);

        return res.status(500).json({
            message: "Unable to update cart",
            error: err.message
        });
    }
};

export const removeFromCart = async function(req, res) {

    try {

        const userid = req.user._id;
        const cartItemId = req.params.id;

        const cartItem = await CartModel.findOneAndDelete({
            _id: cartItemId,
            userid
        });

        if (!cartItem) {
            return res.status(404).json({
                message: "Cart item not found"
            });
        }

        return res.status(200).json({
            message: "Product removed from cart"
        });

    } catch (err) {

        console.log(err.message);

        return res.status(500).json({
            message: "Unable to remove product from cart",
            error: err.message
        });
    }
};

export const getCart = async function(req, res){

try{
    const userid = req.user._id;

    const cart = await CartModel.find({userid});
    
    return res.status(200).json({cart})

}catch(err){
    console.log(err.message);
    return res.status(400).json({message: "cart not found"})
}};
