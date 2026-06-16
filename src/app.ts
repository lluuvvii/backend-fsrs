import express from "express";
import cors from "cors";
import cardRoutes from "./routes/card.routes";
import userRoutes from "./routes/user.routes";
import reviewRoutes from "./routes/review.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_, res) => {
  res.json({
    message: "FSRS API Running",
  });
});

app.use("/cards", cardRoutes);
app.use("/users", userRoutes);
app.use("/reviews", reviewRoutes);

export default app;