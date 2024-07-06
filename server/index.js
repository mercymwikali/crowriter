require('dotenv').config()
const express=require('express');
const app=express();
const {logger}=require('./middleware/logger');
const errorHandler=require('./middleware/errorHandler');
const cookieParser=require('cookie-parser');
const cors=require('cors');
const corsOptions=require('./config/corsOptions');
const port=process.env.PORT || 5000;


app.use(logger);

app.use(cors(corsOptions));

app.use(express.json());


app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));


// app.get("/",(req,res)=>
// {
//     res.send("welcome to crowwriter")
// })


//testing server running
app.get("/", (req, res)=>{
    res.send("welcome to crowwriter");
    });

const ordersRouter=require('./routes/orderRoutes');
app.use('/orders',ordersRouter);


const authRouter=require('./routes/authRoutes');
app.use('/auth',authRouter);

const userRouter=require('./routes/userRoutes');
app.use('/users',userRouter);

const bidsRouter=require('./routes/bidsRoutes');
app.use('/bids',bidsRouter);

const submissionsRouter=require('./routes/submissionsRoutes');
app.use('/uploads',submissionsRouter);

const finesRouter=require('./routes/fineRoutes');
app.use('/fines',finesRouter);

const reviewsRouter=require('./routes/ratingRoutes');
app.use('/reviews',reviewsRouter);

const invoiceRouter=require('./routes/invoiceRoutes');
app.use('/invoice',invoiceRouter);

const paymentRouter=require('./routes/paymentRoutes');
app.use('/payments',paymentRouter);

app.use(errorHandler);

app.listen(port,()=>
{
    console.log(`listening on port ${port}`)
})