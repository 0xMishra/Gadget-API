import { Router } from "express";
import {
  createNewGadget,
  getAllGadgets,
  getAuthToken,
  removeGadget,
  selfDestruct,
  updateGadget,
} from "../handlers/gadget";
import { authenticate } from "../middlewares/auth";

const router = Router();

router.get("/gadgets/auth", getAuthToken);

router
  .route("/gadgets")
  .get(authenticate, getAllGadgets)
  .post(authenticate, createNewGadget);

router
  .route("/gadgets/:id")
  .delete(authenticate, removeGadget)
  .patch(authenticate, updateGadget);

router.post("/gadgets/:id/self-destruct", authenticate, selfDestruct);

export default router;
