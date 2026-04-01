import { getAudioFormatos, getAudioGeneros, getAudioTipos, getAudios, updateAudio } from "../services/audios.service.js";

export const listAudioFormatos = async (req, res) => res.status(200).json(await getAudioFormatos());
export const listAudioTipos = async (req, res) => res.status(200).json(await getAudioTipos());
export const listAudioGeneros = async (req, res) => res.status(200).json(await getAudioGeneros());
export const listAudios = async (req, res) => res.json(await getAudios());
export const updateAudioHandler = async (req, res) => res.status(200).json(await updateAudio(req.params.id, req.body));
