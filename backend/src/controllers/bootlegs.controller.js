import { createBootleg, importBootlegs, previewBootlegImport } from "../services/bootlegs.service.js";

export const createBootlegHandler = async (req, res) => res.json(await createBootleg(req.body));
export const previewBootlegImportHandler = async (req, res) => res.status(200).json(await previewBootlegImport(req.file));
export const importBootlegsHandler = async (req, res) => res.status(200).json(await importBootlegs(req.body));
