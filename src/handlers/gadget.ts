import { Request, Response } from "express";
import { db } from "../lib/db";
import { faker } from "@faker-js/faker";
import { GadgetStatus } from "@prisma/client";
import { updateGadgetInfo, UpdateGadgetInfo } from "../schemas/gadget";
import jwt from "jsonwebtoken";

function generateRandomProb(): number {
  return Math.floor(1 + Math.random() * 100);
}

export async function getAllGadgets(req: Request, res: Response) {
  try {
    const status: string = req.query["status"] as string;

    if (status) {
      let newStatus: GadgetStatus;

      switch (status?.trim()) {
        case "Available":
          newStatus = GadgetStatus.Available;
          break;
        case "Deployed":
          newStatus = GadgetStatus.Deployed;
          break;
        case "Destroyed":
          newStatus = GadgetStatus.Destroyed;
          break;
        case "Decommissioned":
          newStatus = GadgetStatus.Decommissioned;
          break;
        default:
          newStatus = GadgetStatus.Available;
          break;
      }

      let gadgets = await db.gadget.findMany({ where: { status: newStatus } });

      res.status(200).json({
        gadgets,
      });
      return;
    }

    const gadgets = await db.gadget.findMany({});

    gadgets.map(
      (g) =>
        g.name +
        " - " +
        generateRandomProb().toString() +
        "% success probability",
    );

    res.status(200).json({ gadgets: gadgets });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "internal server error",
    });
  }
}

export async function createNewGadget(req: Request, res: Response) {
  try {
    const randomName = faker.person;
    const newGadget = await db.gadget.create({
      data: {
        name: "The " + randomName.firstName(),
        status: GadgetStatus.Available,
      },
    });

    if (!newGadget) {
      res
        .status(500)
        .json({ message: "error while creating a new gadget, try again" });
      return;
    }

    res
      .status(201)
      .json({ message: "gadget created successfully", gadget: newGadget });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "internal server error",
    });
  }
}

export async function removeGadget(req: Request, res: Response) {
  try {
    const gadgetId = req.params["id"];

    let gadget = await db.gadget.findUnique({ where: { id: gadgetId } });

    if (!gadget) {
      res.status(404).json({ message: "no gadget with this id present" });
      return;
    }

    await db.gadget.update({
      where: { id: gadgetId },
      data: { status: GadgetStatus.Decommissioned },
    });

    res.status(200).json({ message: "gadget deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "internal server error",
    });
  }
}

export async function updateGadget(req: Request, res: Response) {
  try {
    const gadgetId = req.params["id"];

    let gadget = await db.gadget.findUnique({ where: { id: gadgetId } });

    if (!gadget) {
      res.status(404).json({ message: "no gadget with this id present" });
      return;
    }

    let { name, status }: UpdateGadgetInfo = req.body;

    const parsedInput = updateGadgetInfo.safeParse({
      name,
      status: status || "Available",
    });

    if (!parsedInput.success) {
      const errorMsg = parsedInput.error.errors[0].message;
      res.status(400).json({ message: `${errorMsg}` });
      return;
    }

    let newStatus: GadgetStatus;

    switch (status?.trim()) {
      case "Available":
        newStatus = GadgetStatus.Available;
        break;
      case "Deployed":
        newStatus = GadgetStatus.Deployed;
        break;
      case "Destroyed":
        newStatus = GadgetStatus.Destroyed;
        break;
      case "Decommissioned":
        newStatus = GadgetStatus.Decommissioned;
        break;
      default:
        newStatus = GadgetStatus.Available;
        break;
    }

    let updatedGadget = await db.gadget.update({
      where: { id: gadgetId },
      data: { name: name, status: newStatus || GadgetStatus.Available },
    });

    res.status(200).json({
      message: "gadget updated successfully",
      updatedGadget: updatedGadget,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "internal server error",
    });
  }
}

function generateRandomCode() {
  return Math.floor(Math.random() * 9999 + 1000);
}

export async function selfDestruct(req: Request, res: Response) {
  try {
    const gadgetId = req.params["id"];

    let gadget = await db.gadget.findUnique({ where: { id: gadgetId } });

    if (!gadget) {
      res.status(404).json({ message: "no gadget with this id present" });
      return;
    }

    await db.gadget.update({
      where: { id: gadgetId },
      data: { status: GadgetStatus.Destroyed },
    });

    res.status(200).json({
      message: "self destruct sequence started",
      code: generateRandomCode(),
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "internal server error",
    });
  }
}

export async function getAuthToken(req: Request, res: Response) {
  try {
    const token = jwt.sign({ title: "auth" }, process.env.JWT_SECRET!);

    res.status(200).json({
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "internal server error",
    });
  }
}
