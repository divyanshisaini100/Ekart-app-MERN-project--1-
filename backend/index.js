import express from "express"
import mongoose from "mongoose" 
import dotenv from "dotenv"
import UserRoutes from "./routes/UserRoutes.js"
import ProductRoutes from "./routes/ProductRoutes.js"
import WishlistRoutes from "./routes/WishlistRoutes.js"
import CartRoutes from "./routes/CartRoutes.js"
import PaymentRoutes from "./routes/PaymentRoutes.js"
import cookieParser from "cookie-parser"
import cors from "cors"


dotenv.config() 

let port  = 8084



const connectDB = async function(){
    try{
        const conn  = await mongoose.connect(process.env.dbURL) 
        console.log("DB connected")
    }catch(err){
        console.log(err.message)
    }
}
await connectDB()



const app = express()

app.use(cookieParser())

app.use(cors({
    // ✅ Whitelist BOTH variations of your Codespaces frontend domain explicitly
    origin: [
        "https://scaling-goldfish-7rvj4rvrxg42wq9r-5173.app.github.dev",
        "https://scaling-goldfish-7rvj4rvrxg42wq9r-5173.app.github.dev/"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"], // 🟢 Explicitly allow OPTIONS preflight requests
    credentials: true, // 🔓 Necessary to allow secure JWT cookie exchanges
    allowedHeaders: ["Content-Type", "Authorization"] // Allow JSON headers to pass through
}));

app.use(express.json())

app.use("/user", UserRoutes)
app.use("/products", ProductRoutes)
app.use("/wishlist", WishlistRoutes)
app.use("/cart", CartRoutes);
app.use("/payment", PaymentRoutes);

app.listen(port, '0.0.0.0', ()=>
   console.log(`Server is running at ${port}`)
)
