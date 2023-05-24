const Documentation = require("../model/documentation");

exports.getAllDocumentations = async (req, res) => {
    try{
        const documentations = await Documentation.find({}).sort({date: 'desc'}).select('_id version')
        res.status(200).send(documentations)
    } catch (err) {
        console.error(err)
        res.status(404).send({})
    }
    
};

exports.createDocumentation = async (req, res) => {
    try {
        const { version, text, images } = req.body;

        const documentation = await Documentation.create({
            version,
            author: req.user._id,
            images,
            text,
        });
    
        res.status(201).send(documentation);
    } catch (err) {
        console.log(err);
        res.status(402).send({})
    }
};

exports.getDocumentationById = async (req, res) => {
    try {
        const documentation = await Documentation.findById( req.params.id ).populate('author')
        if (!documentation) { 
            return res.status(404).send({message: "Documentation does not exist"});
        }

        res.status(200).send(documentation)
    } catch (e) {
        console.log(e)
        if (e.name === 'CastError') {
            return res.status(404).send({message: 'Invalid ID'});
        }
        return res.status(400).send({message: "Something went wrong"})
    }
    
};

exports.getLatest = async (req, res) => {
    try {
        const latestDocumentation = await Documentation
            .findOne()
            .sort({ date: -1 })
            .exec();

        if (!latestDocumentation) {
            return res.status(404).send({message: 'No documentations found'});
        }

        res.status(200).send(latestDocumentation);
    } catch (err) {
        return rest.status(400).send({message: 'Something went wrong'});
    }
}

exports.updateDocumentation = async (req, res) => {
    try {
        const { version, text, images } = req.body;
        
        const rID = req.params.id;
        const documentation = await Documentation.findById( rID )
        if (!documentation) {
            return res.status(404).send({message: 'Documentation does not exist'});
        }
        
        if (!documentation.author.equals(req.user._id) && req.user !== 'admin') {
            return res.status(403).send({message: 'Only original posters can edit their documentations'});
        }

        documentation.version = version ?? documentation.version;
        documentation.text = text ?? documentation.text;
        documentation.images = images ?? documentation.images;

        await documentation.save()
        return res.status(201).json(documentation);
    } catch (e) {
        console.log(e)
        res.status(400).send({message: "Something went wrong"})
    }
    
};

exports.deleteDocumentation = async (req, res) => {
    try {
        const documentation = await Documentation.findById( req.params.id )

        if (!documentation.author.equals(req.user._id) && req.user.role !== 'admin')
            return res.status(403).send({message: 'Only original posters can delete their documentations'})
            
        await documentation.remove();
        return res.status(202).send({})
    } catch (e) {
        console.log(e)
        res.status(400).send({message: "Something went wrong"})
    }
    
};