'use strict';
const sharp = require('sharp');
// use sharp to create a png thumbnail of 160x160px 
const makeThumbnail = async (file, avatarName) => {
  return await sharp(file)
     .resize(160, 160)
     .toFile('./avatar/'+avatarName);
};

module.exports = {
  makeThumbnail,
};