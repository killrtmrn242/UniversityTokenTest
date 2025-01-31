const UniversityToken = artifacts.require("UniversityToken");

module.exports = function (deployer) {
  deployer.deploy(UniversityToken);
};
