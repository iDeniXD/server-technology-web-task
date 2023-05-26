const Release = require("../model/release");

const {uploader} = require('cloudinary').v2;

const {s3} = require('../config/aws')
const { AWS_BUCKET_NAME } = process.env;

exports.getAllReleases = async (req, res) => {
    try{
        const releases = await Release.find({}).sort({date: 'desc'}).populate('author')
        res.status(200).send(releases)
    } catch (err) {
        console.error(err)
        res.status(400).send({message: 'Something went wrong'})
    }
    
};

exports.createRelease = async (req, res) => {
    try {
        const { version, description, changelog, images, file, documentation } = req.body;

        const release = await Release.create({
            version,
            description,
            author: req.user._id,
            changelog,
            images,
            file,
            documentation
        });
    
        res.status(201).send(release);
    } catch (err) {
        console.log(err);
        res.status(400).send({message: 'Something went wrong'})
    }
};

exports.getReleaseById = async (req, res) => {
    try {
        const release = await Release.findById( req.params.id ).populate('author')
        if (!release) { 
            return res.status(404).send({message: "Release does not exist"}); 
        }

        res.status(200).send(release)
    } catch (e) {
        console.log(e);
        if (e.name === 'CastError') {
            return res.status(404).send({message: 'Invalid ID'});
        }
        res.status(400).send({message: "Something went wrong"});
    }
    
};

exports.getLatest = async (req, res) => {
    try {
        const latestRelease = await Release
            .findOne()
            .sort({ date: -1 })
            .exec();

        if (!latestRelease) {
            return res.status(404).send({message: 'No releases found'});
        }

        return res.status(200).send(latestRelease);
    } catch (err) {
        return res.status(400).send({message: 'Something went wrong'})
    }
}

exports.updateRelease = async (req, res) => {
    try {
        const { version, description, changelog, images, file, documentation } = req.body;
        
        const rID = req.params.id;
        const release = await Release.findById( rID )
        if (!release) {
            return res.status(404).send({message: 'Release does not exist'});
        }
        
        if (!release.author.equals(req.user._id) && req.user.role !== 'admin') 
            return res.status(403).send({message: 'Only original posters can edit their releases'});

        release.version = version ?? release.version;
        release.description = description ?? release.description;
        release.changelog = changelog ?? release.changelog;
        release.images = images ?? release.images;
        release.file = file ?? release.file;
        release.documentation = documentation ?? release.documentation;

        await release.save()
        return res.status(201).send(release);
    } catch (e) {
        console.log(e)
        return res.status(400).send({message: "Something went wrong"})
    }
    
};

exports.deleteRelease = async (req, res) => {
    try {
        const release = await Release.findById( req.params.id )

        if (!release.author.equals(req.user._id) && req.user.role !== 'admin')
            return res.status(403).send({message: 'Only original posters can delete their releases'})
            
        // Delete images
        const {images, file} = release;
        await Promise.all(images.map(image => uploader.destroy(image)))

        // Delete file
        const params = {
            Bucket: AWS_BUCKET_NAME,
            Key: file
        };
        s3.deleteObject(params, () => {});

        await release.remove();
        return res.status(200).send({});
        
    } catch (e) {
        console.log(e)
        return res.status(400).send({message: "Something went wrong"})
    }
    
};