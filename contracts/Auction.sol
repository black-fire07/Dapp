pragma solidity ^0.8.0;

import "./Yuvan.sol";

contract Auction{
    Yuvan public yuvan;
    auction[] public auctions;
    
    mapping(uint=>address) public beneficiaryr;
    constructor(Yuvan _yuvan) {
        yuvan = _yuvan;
    }
    
    event HighestBidInc(address bidder,uint amount);
    event AuctinEnded(address high,uint amount);
    
    bool st = false;
    struct auction {
        uint id;
        uint256 startPrice;
        address owner;
        bool active;
        bool finalized;
    }
    
    mapping(uint=>mapping(address=>uint)) public pendingReturns;
    
    mapping(uint=>address) public highBidder;
    mapping(uint=>uint) public highestBid;
    
    function gethigh(uint id) public view returns(uint){
        return highestBid[id];
    }

    function gethighB(uint id) public view returns(address){
        return highBidder[id];
    }

    function start(uint _price,uint _id) public returns(bool){
        auction memory newAuction;
        newAuction.id = _id;
        newAuction.startPrice = _price;
        newAuction.owner = msg.sender;
        newAuction.active = true;
        newAuction.finalized = false;
        auctions.push(newAuction);
        return true;
    }

    function bid(uint _id,uint _val) public {
        auction memory myAuction = auctions[_id];
        if(myAuction.owner == msg.sender) revert();
        if(!myAuction.active) revert();
        if(_val <= highestBid[_id]){
            revert("lower bid");
        }
        yuvan.approve(address(this), _val);
        yuvan.transferFrom( msg.sender,address(this), _val);
        pendingReturns[_id][highBidder[_id]] += highestBid[_id];
        highBidder[_id] = msg.sender;
        highestBid[_id] = _val;
        
        
        emit HighestBidInc(msg.sender,_val);
    }
    
    function withdraw(uint _retid) public {
        
        require(msg.sender!=highBidder[_retid]);
        require(pendingReturns[_retid][msg.sender] > 0);
        uint amount = pendingReturns[_retid][msg.sender];
        pendingReturns[_retid][msg.sender] = 0;
        yuvan.transfer(msg.sender, amount);
    }
    
    function auctionEnd(uint _id) public {
        auction memory myAuction = auctions[_id];
        require(msg.sender == myAuction.owner,"wa");
        // nft.transfer(highBidder, _tokenId);
        yuvan.transfer(msg.sender, highestBid[_id]);
        myAuction.active = false;
        highestBid[_id] = 0;
        myAuction.finalized = true;
        emit AuctinEnded(highBidder[_id],highestBid[_id]);
    }
}