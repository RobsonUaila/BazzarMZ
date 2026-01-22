module.exports = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, {
            abortEarly: false
        });

        if (error) {
            return res.status(400).json({

                erro: 'Dados invalidos',
                detalhes: error.details.map(d => d.message)
            });
        }
        next();

    };
};