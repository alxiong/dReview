pragma solidity ^0.4.17;

contract Store {
  
  string public placeID;
  uint256 public overallScore;
  uint256 public totalScore;
  uint256 public totalReviewAmount;

  event LogReviewAdded(address indexed uploader, string comment, uint256 score, uint256 time);

  function Store(string _placeID) public {
    placeID = _placeID;
  }

  function addReview(string _comment, uint256 _score) public {
    totalReviewAmount = totalReviewAmount + 1;
    totalScore = totalScore + _score;
    overallScore = totalScore/totalReviewAmount;
    LogReviewAdded(msg.sender, _comment, _score, block.timestamp);
  }
}

contract StoreRegistry{
  mapping (bytes32 => address) public registry;

  event LogStoreCreated(address indexed store_address);
  
  function addStore(string _placeID) public {
    require(registry[sha256(_placeID)] == 0x0);
    Store newStore = new Store(_placeID);
    registry[sha256(_placeID)] = address(newStore);
    LogStoreCreated(address(newStore));
  }

  function getStoreAddress(string _placeID)
    public constant
    returns (address){
      return registry[sha256(_placeID)]; 
  }

  function storeExist(string _placeID)
    public constant
    returns (bool){
      if (registry[sha256(_placeID)] == 0x0){
        return false;
      } else {
        return true;
      }
  }
}
