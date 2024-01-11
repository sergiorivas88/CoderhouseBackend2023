import errorList from "../utils/errorList.js";

export default (error, req, res, next) => {
    switch (error.code) {
        case errorList.BAD_REQUEST_ERROR:
        case errorList.INVALID_PARAMS_ERROR:
            res.status(400).json({ status: 'error', message: error.message });
            break;
        case errorList.DATA_BASE_ERROR:
        case errorList.ROUTING_ERROR:
            res.status(500).json({ status: 'error', message: error.message });
            break;
        default:
            res.status(500).json({ status: 'error', message: 'Error desconocido' });
            break;
    }
    req.logger.fatal(error, error.code)
}