export const uploadFileHandler = async (req, res) => res.status(200).json(req.file.filename);
