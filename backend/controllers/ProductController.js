import ProductModel from "../models/ProductModel.js"


export const createProduct = async function(req, res) {

    try {

        const {
            name_,
            price,
            description,
            colors,
            sizes,
            images,
            inventory,
            manufacturer,
            category,
            discount
        } = req.body;

        const newProduct = await ProductModel.create({
            name_: name_.trim(),
            price,
            description: description?.trim(),
            colors,
            sizes,
            images,
            inventory,
            manufacturer,
            category,
            discount
        });

        return res.status(201).json({
            message: "Product successfully created!",
            product: newProduct
        });

    } catch(err) {

        console.log(err.message);

        return res.status(500).json({
            message: "Internal Server Error",
            error: err.message
        });
    }
}

export const getProducts = async function(req, res){

    try {
        const products = await ProductModel.find()
        
        return res.status(201).json({products})

    }catch(err){
        console.log(err.message)
        return res.status(500).json({message: "Internal server error", error: err.message})
    }    
} 

export const getProductById = async function(req, res){
    try{
        const id = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid product ID'
            })
        }
        const product = await ProductModel.findById(id);
        if(!product){
            return res.status(404).json({message: "Product not found"})
        } 
        return res.status(200).json({product})
    }catch(err){
        console.log(err.message)
        return res.status(500).json({message:"Internal Server Error", error: err.message})
    }
}

export  const updateProduct = async function(req, res){

    try {
            const id = req.params.id;
            const updates = req.body;

            const product = await ProductModel.findById(id);

            if (!product) {
                return res.status(404).json({
                    message: "Product not found"
                });
            }

            const allowedFields = ["name_", "price", "description", "colors", "sizes", "images", "inventory", "manufacturer", "category", "discount"];

            for (const key of allowedFields) {
                if (updates[key] !== undefined) {
                    product[key] = updates[key];
                }
            }

            await product.save();

                return res.status(200).json({
                message: "Product successfully updated",
                product
            });

     }catch(err) {

        console.log(err.message);
        res.status(500).json({message: "Internal Server Error", error: err.message})

     }    
}

export const deleteProduct = async function(req, res){
     try {
            const id = req.params.id;

            const product = await ProductModel.findByIdAndDelete(id);

            if (!product) {
                return res.status(404).json({
                    message: "Product not found"
                });
            }

            return res.status(200).json({
                message: "Product successfully deleted",
                product
            });

        } catch(err) {
            console.log(err.message);

            return res.status(500).json({
                message: "Internal Server Error",
                error: err.message
            });
        }     
}

export const productsByCat = async function(req, res) {
       try{

        const cat = req.query.category;
        const filteredProducts = await ProductModel.find({category: cat})

        //find() returning no documents is not an error in MongoDB. It returns []

        if (filteredProducts.length === 0) { //for array -> need length to check --> Boolean([]) // true
            return res.status(404).json({ message: "No products found" });
        }

        return res.status(200).json({
            products: filteredProducts
        });

       }catch(err){
           console.log(err.message);
           return res.status(400).json({message: "Unable to fetch products"})

       }  
} 
export const searchProducts = async function(req, res) {

    try {

        const search = req.query.search;

        
        if (!search || search.trim() === "") {
            return res.status(400).json({
                message: "Search query is required"
            });
        }

        
        const products = await ProductModel.find({
            name_: {
                $regex: search.trim(),
                $options: "i"
            }
        });

        
        if (products.length === 0) {
            return res.status(404).json({
                message: "No products found"
            });
        }

        
        return res.status(200).json({
            products
        });

    } catch(err) {

        console.log(err.message);

        return res.status(500).json({
            message: "Unable to search products"
        });

    }

}