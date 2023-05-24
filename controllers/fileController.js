const {s3} = require('../config/aws')
const { AWS_BUCKET_NAME } = process.env;

exports.createFile = async (req, res) => {
    res.status(200).send({message: "File uploaded successfully", file: req.file.key});
}

exports.downloadFile = async (req, res) => {
    const key = req.params.key;

    const params = {
        Bucket: AWS_BUCKET_NAME,
        Key: key
    };

    try {
        const headCode = await s3.headObject(params).promise();

        res.setHeader('Content-Length', headCode.ContentLength);
        res.setHeader('Content-Type', headCode.ContentType);
        res.setHeader('Content-Disposition', 'attachment');

        const stream = s3.getObject(params).createReadStream();
        stream.pipe(res);
    } catch (error) {
        res.status(400).send({message: 'Error downloading file: ' + error.message});
    }
}

exports.deleteFile = async (req, res) => {
    try {
        const key = req.params.key;

        const params = {
            Bucket: AWS_BUCKET_NAME,
            Key: key
        };

        s3.deleteObject(params, function(err, data) {
            if (err) res.status(400).send({message: 'Error deleting file'})
            else res.status(202).send({})
        });
    } catch (error) {
        console.log(error);
        return res.status(400).send({message: 'Something went wrong!'});
    }
}