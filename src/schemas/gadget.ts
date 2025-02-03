import { z } from "zod";

const updateGadgetInfo = z.object({
  name: z
    .string()
    .trim()
    .min(5, { message: "name should at least 5 characters long" }),
  status: z
    .enum(["available", "deployed", "destroyed", "decommissioned"])
    .optional(),
});

type UpdateGadgetInfo = z.infer<typeof updateGadgetInfo>;

export { updateGadgetInfo, UpdateGadgetInfo };
