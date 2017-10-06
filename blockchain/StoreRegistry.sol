pragma solidity ^0.4.15;
// Interfaces of contract manager

import "./Store.sol";

contract StoreRegistry{
  /// @dev mapping/dictionary of sha256(GooglePlaceId) => contract address
  mapping (bytes32 => address) public registry;
  /// @dev the owner of this contract
  address public owner;

  event LogStoreCreated(address indexed store_address);
  event LogStoreChanged(address indexed old_store_address, address indexed new_store_address);
  event LogOwnershipTransferred(address indexed old_owner, address indexed new_owner);

  modifier onlyOwner() {
      require(msg.sender == owner);
      _;
  }

/*
 * Public Function
 */

  /// @dev constructor that sets initial owner
  function StoreRegistry()
    public{
      // Set the contract creator as the owner
      owner = msg.sender;
 }

  /// @dev add a new Store address into the registry
  /// @param _placeID is the unique ID provided by GoogleMap API
  function addStore(string _placeID){
    // make sure the store doesn't already exist
    require(registry[sha256(_placeID)] == address(0));
    // create a new store contract
    Store newStore = new Store(_placeID);
    // add the hash => address pair to our registry
    registry[sha256(_placeID)] = address(newStore);
    // log the event
    LogStoreCreated(address(newStore));
  }

  /// @dev getter function for store contract address query
  function getStoreAddress(string _placeID)
    public
    constant
    returns (address) {
  
    return registry[sha256(_placeID)];
  }

  /// @dev only current owner could transfer ownership to a new owner
  function transferOwnership(address newOwner) onlyOwner {
     if (newOwner != address(0)) {
         owner = newOwner;
         LogOwnershipTransferred(msg.sender, owner);
     }
  }
}
