// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract YameteKudasai is ERC721, ERC721URIStorage {
    uint256 EMI = 0;
    uint256 HANA = 1;
    uint256 MANA = 2;
    uint256 MIKU = 3;
    uint256 YUI = 4;

    constructor() ERC721("Yamete Kudasai", "YMT") {
        _mint(msg.sender, EMI);
        _setTokenURI(EMI, "/metadata/characters/0");

        _mint(msg.sender, HANA);
        _setTokenURI(HANA, "/metadata/characters/1");

        _mint(msg.sender, MANA);
        _setTokenURI(MANA, "/metadata/characters/2");

        _mint(msg.sender, MIKU);
        _setTokenURI(MIKU, "/metadata/characters/3");

        _mint(msg.sender, YUI);
        _setTokenURI(YUI, "/metadata/characters/4");
    }

    function _baseURI() internal pure override returns (string memory) {
        return "https://yamete.nftinity.xyz";
    }

    function _burn(uint256 tokenId) internal virtual override(ERC721,ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }
}
