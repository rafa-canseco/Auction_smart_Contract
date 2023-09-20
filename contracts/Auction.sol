// SPDX-License-Identifier: MIT

pragma solidity 0.8.19;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract Auction {
    // STATE VARIABLES
    address private owner;
    address private highestBidder;
    uint256 private previousBid;
    uint256 public startTime;
    uint256 public stopTime;
    uint256 private currentBid;
    bool public auctionLive;
    IERC721 private auctionItem;
    uint256 private auctionTokenId;

    struct Winner {
    address winnerAddress;
    uint256 winningBid;
}

    Winner[] public previousWinners;


    mapping(address => uint256) public bids;
    mapping(address => bool) private hasBid;
    address[] private bidders;

    // MODIFIERS
    modifier onlyOwner(){
        require(msg.sender == owner, "Not the owner");
        _;
    }

    // EVENTS
    event AuctionStarted(uint256 officialStart);
    event AuctionEnded(uint officialStop);
    event BidPlaced(uint256 currentBid, address bidder);
    event Withdraw(address account, uint256 amount);

    // CONSTRUCTOR
    constructor() {
        owner = msg.sender;
        auctionLive = false;
    }

    // SETTERS
    function setStartAuctionTime(uint256 _startTime) public onlyOwner {
        startTime = _startTime;
    }

    function setStopAuctionTime(uint256 _stopTime) public onlyOwner {
        stopTime = _stopTime;
    }

    function setAndTransferAuctionItem(IERC721 _auctionItem, uint256 _tokenId) public onlyOwner {
        auctionItem = _auctionItem;
        auctionTokenId = _tokenId;
        _auctionItem.transferFrom(msg.sender, address(this), _tokenId);
    }

    // START AUCTION
    function startAuction () public onlyOwner {
        require(auctionItem.ownerOf(auctionTokenId) == address(this), "Auction contract does not own the NFT");
        require(address(auctionItem) != address(0), "Auction item not set");
        require(startTime > block.timestamp, "Start time is not after the current time");
        require(stopTime > startTime, "Stop time is not set after start time");

        auctionLive = true;
        emit AuctionStarted(block.timestamp);
    }

    // STOP AUCTION
 function stopAuction() public onlyOwner {
    require(block.timestamp > stopTime, "Auction is still live");

    // Transfer the NFT to highest bidder
    auctionItem.transferFrom(address(this), highestBidder, auctionTokenId);

    // Store the winner and winning bid
    Winner memory newWinner = Winner({
        winnerAddress: highestBidder,
        winningBid: bids[highestBidder]
    });
    previousWinners.push(newWinner);


    resetAuction();
}


    function resetAuction() internal {
        startTime = 0;
        stopTime = 0;
        auctionItem = IERC721(address(0));  // Reset NFT reference
        auctionTokenId = 0;
        currentBid = 0;
        previousBid = 0;
        highestBidder = address(0);

        for (uint i = 0; i < bidders.length; i++) {
            bids[bidders[i]] = 0;
            hasBid[bidders[i]] = false;
        }
        delete bidders;
        auctionLive = false;
    }

    function bid() public payable {
        require(auctionLive, "Auction is not live");
        require(msg.value > currentBid, "Bid not high enough");

        if(!hasBid[msg.sender]) {
            bidders.push(msg.sender);
            hasBid[msg.sender] = true;
        }

        address previousBidder = highestBidder;
        previousBid = currentBid;
        
        currentBid = msg.value;
        highestBidder = msg.sender;

        bids[msg.sender] += msg.value;

        if (previousBidder != address(0) && previousBidder != msg.sender) {
            payable(previousBidder).transfer(previousBid);
        }

        emit BidPlaced(currentBid, msg.sender);
    }

    function withdraw() public {
        require(!auctionLive, "Auction is still live");
        uint256 amount = bids[msg.sender];
        require(amount > 0, "No funds to withdraw");

        bids[msg.sender] = 0;

        payable(msg.sender).transfer(amount);

        emit Withdraw(msg.sender, amount);
    }

    function ownerWithdraw(uint256 _amount) public onlyOwner {
        require(!auctionLive, "Wait until the auction has ended before withdrawing");
        require(_amount <= address(this).balance, "Amount to withdraw too high");

        payable(owner).transfer(_amount);
        emit Withdraw(msg.sender, _amount);
    }

    function transferOwnership(address newOwner) public onlyOwner {
        owner = newOwner;
    }

    // GETTERS
    function getCurrentBid() public view returns(uint256) {
        return currentBid;
    }

    function getContractBalance() public view returns(uint256) {
        return address(this).balance;
    }

    function getOwner() public view returns(address) {
        return owner;
    }

    function getWinner() public view onlyOwner returns(address, uint256) {
        require(!auctionLive, "Auction is still live");
        require(highestBidder != address(0), "Winner is NOT set");
        return (highestBidder, bids[highestBidder]);
    }
        function getAuctionItem() public view returns(IERC721) {
        return auctionItem;
    }

    function getNftId() public view returns(uint256) {
        return auctionTokenId;
    }
    
    function getStartTime() public view returns(uint256) {
        return startTime;
    }

    function getStopTime() public view returns(uint256) {
        return stopTime;
    }

    function getBidOf(address _bidder) public view returns(uint256) {
        return bids[_bidder];
    }
    function getWinnerByIndex(uint256 index) public view returns(address, uint256) {
    require(index < previousWinners.length, "Index out of bounds");
    Winner memory winnerData = previousWinners[index];
    return (winnerData.winnerAddress, winnerData.winningBid);
}
    function getTotalWinners() public view returns(uint256) {
    return previousWinners.length;
}

}
