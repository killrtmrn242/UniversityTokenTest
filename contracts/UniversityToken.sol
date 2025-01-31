// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract UniversityToken is ERC20 {
    address public owner;
    mapping(address => uint256) public lastTransactionTimestamps;

    constructor(uint256 initialSupply) ERC20("UniversityGroupToken", "UGT") {
        _mint(msg.sender, initialSupply * 10 ** decimals());
        owner = msg.sender;
    }

    function transfer(address recipient, uint256 amount) public override returns (bool) {
        // Вызываем родительскую функцию transfer
        bool success = super.transfer(recipient, amount);

        // Обновляем временную метку для отправителя и получателя
        lastTransactionTimestamps[msg.sender] = block.timestamp;
        lastTransactionTimestamps[recipient] = block.timestamp;

        return success;
    }

    function getLastTransactionTimestamp(address account) public view returns (string memory) {
        uint256 timestamp = lastTransactionTimestamps[account];
        require(timestamp != 0, "No transactions found");
        return _convertTimestampToDateTime(timestamp);
    }

    function getTransactionSender(address account) public view returns (address) {
        require(balanceOf(account) > 0, "No tokens held by this account");
        return account;
    }

    function _convertTimestampToDateTime(uint256 timestamp) internal pure returns (string memory) {
        // Проверяем, что временная метка корректна
        require(timestamp > 0, "Invalid timestamp");

        // Преобразуем временную метку в дату
        uint256 year = 1970 + timestamp / 31536000; // Количество секунд в году (365 дней)
        uint256 month = (timestamp % 31536000) / 2678400 + 1; // Количество секунд в месяце (30 дней)
        uint256 day = (timestamp % 2678400) / 86400 + 1; // Количество секунд в дне

        // Преобразуем числа в строки
        return string(abi.encodePacked(
            _uint2str(day), "/", 
            _uint2str(month), "/", 
            _uint2str(year)
        ));
    }

    function _uint2str(uint256 _i) internal pure returns (string memory) {
        if (_i == 0) {
            return "0";
        }
        uint256 j = _i;
        uint256 len;
        while (j != 0) {
            len++;
            j /= 10;
        }
        bytes memory bstr = new bytes(len);
        uint256 k = len - 1;
        while (_i != 0) {
            bstr[k--] = bytes1(uint8(48 + _i % 10));
            _i /= 10;
        }
        return string(bstr);
    }
}