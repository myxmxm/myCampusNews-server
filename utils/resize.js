'use strict';
const sharp = require('sharp');

const makeThumbnail = async (file, avatarName) => {
  return await sharp(file)
     .resize(160, 160)
     .toFile('./avatar/'+avatarName);
};

module.exports = {
  makeThumbnail,
};