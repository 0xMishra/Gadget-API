import { config } from "dotenv";
import express from "express";
import gadgetRouter from "./routes/gadget";

config();

const app = express();
app.use(express.json());

app.use("/api/v1", gadgetRouter);

app.get("/", (req, res) => {
  res.send("gadgets inventory");
});

app.listen(process.env.PORT, () =>
  console.log(`server is running on PORT:${process.env.PORT}`),
);
