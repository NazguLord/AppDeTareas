import moment from "moment";

export const getCurrentTimestamp = () => moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");
