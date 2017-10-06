pragma solidity ^0.4.15;

contract Store {

  string public placeID;
  uint256 public overallScore;
  uint256 public totalScore;
  uint256 public totalReviewAmount;
  /// @param list of Review items
  Review[] public reviews;

  /// @param creation_blockstamp: current time when review is uploaded. Recorded for future retrival filter.
  struct Review {
    string comment;
    uint256 score;
    address uploader;
    uint256 creation_blockstamp;
  }

  event LogReviewAdded(address indexed uploader, string comment, uint256 score);

  modifier validScore(uint256 _score) {
    require(_score >= 0 && _score <= 100);
    _;
  }

  /*
   * Public Function
   */

   /// @dev constructor
   function Store(string _placeID) public {
     placeID = _placeID;
   }

   /// @dev add a new review
   function addReview(string _comment, uint256 _score)
      public
      validScore(_score){
        reviews.push(Review({
          comment:_comment,
          score:_score,
          uploader:msg.sender,
          creation_blockstamp: block.timestamp
          }));

        totalReviewAmount = totalReviewAmount + 1;
        totalScore = totalScore + _score;
        overallScore = totalScore / totalReviewAmount;
        LogReviewAdded(msg.sender, _comment ,_score);
     }
}
