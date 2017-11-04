pragma solidity ^0.4.15;

contract Store {

  string public placeID;
  uint256 public overallScore;
  uint256 public totalScore;
  uint256 public totalReviewAmount;
  Review[] public all_reviews;
  mapping (address => Review) user_reviews;
  
  // @param all_votes recorded votes from each address on each comment, to prevent from duplicate voting 
  mapping (address => mapping (uint256 => bool) ) all_votes;
  
  /// @param creation_blockstamp: current time when review is uploaded. Recorded for future retrival filter.
  struct Review {
    string comment;
    uint256 score;
    address uploader;
    uint256 upvote;
    uint256 downvote;
    uint256 creation_blockstamp;
  }

  event LogVoteAdded(address indexed voter, uint256 indexed review_index, bool is_upvote);

  modifier validScore(uint256 _score) {
    require(_score >= 0 && _score <= 100);
    _;
  }

  modifier validVote(address _voter, uint256 _review_index) { 
    require(all_votes[_voter][_review_index] == false);
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
   /// @param _uploader as a parameter because msg.sender would be the address of infura node.
   function addReview(string _comment, uint256 _score, address _uploader)
      public
      validScore(_score){
        
        // if reviewed before, update the score from this user
        if (user_reviews[_uploader].creation_blockstamp != 0){
          // totalReviewAmount doesn't change, update totalScore and overallScore
          totalScore = totalScore + _score - user_reviews[_uploader].score;
          overallScore = totalScore / totalReviewAmount;
        }
        else{
          totalReviewAmount = totalReviewAmount + 1;
          totalScore = totalScore + _score;
          overallScore = totalScore / totalReviewAmount;   
        }
        
        Review memory new_review;
        new_review.comment = _comment;
        new_review.score = _score;
        new_review.uploader = _uploader;
        new_review.upvote = 0;
        new_review.downvote = 0;
        new_review.creation_blockstamp = block.timestamp;
        
        all_reviews.push(new_review);

        user_reviews[_uploader].comment = _comment;
        user_reviews[_uploader].score = _score;
        user_reviews[_uploader].creation_blockstamp = block.timestamp;
     }

     function voteReview (uint256 _review_index, bool _is_upvote, address _voter) 
        public
        validVote(_voter, _review_index) {
          // Mark as voted
          all_votes[_voter][_review_index] = true;
          
          if (_is_upvote){
            all_reviews[_review_index].upvote += 1;  
          }
          else{
            all_reviews[_review_index].downvote += 1;   
          }

        LogVoteAdded(_voter, _review_index, _is_upvote);
     }
     
}
