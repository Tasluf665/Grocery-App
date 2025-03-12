export default function (err, req, res, next) {
    // Set a 500 Internal Server Error status code and send a generic error message.
    res.status(500).send("Something failed");
};