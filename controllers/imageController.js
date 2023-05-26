const {uploader} = require('cloudinary').v2;

exports.createImage = async (req, res) => {
    try {
        const imageIds = req.files?.map(f => f.filename);

        return res.status(200).send({
            urls: imageIds
        })
    } catch (e) {
        console.log(e);
        return res.status(400).send({message: 'Something went wrong'});
    }
};

exports.deleteImage = async (req, res) => {
    try {
        const imageId = req.body.id;
        await uploader.destroy(imageId) 
        return res.status(200).send({});
    } catch (e) {
        console.log(e);
        return res.status(400).send({message: 'Something went wrong'})
    }
};