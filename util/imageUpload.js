const fs = require('fs');

const imageUpload = file => {

    let fileName;

    fileName = Date.now().toString();
    fs.writeFile(`./uploads/images/${fileName}`, file, {encoding: 'buffer'},
        (err) => {
            if (err) {
                console.log(err);
            }
            console.log('file succesfuly uploaded');
        });

    return fileName;
};

module.exports = imageUpload;