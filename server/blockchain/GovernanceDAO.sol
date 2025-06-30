// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/governance/Governor.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorCountingSimple.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotes.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotesQuorumFraction.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorTimelockControl.sol";
import "@openzeppelin/contracts/governance/TimelockController.sol";
import "./HKTSecurityToken.sol";

/**
 * @title HKTGovernanceDAO
 * @dev DAO governance contract for HKT platform decisions
 * Allows HKT token holders to propose and vote on platform changes
 */
contract HKTGovernanceDAO is
    Governor,
    GovernorCountingSimple,
    GovernorVotes,
    GovernorVotesQuorumFraction,
    GovernorTimelockControl
{
    HKTSecurityToken public hktToken;
    
    enum ProposalType {
        PropertyAcquisition,    // Propose buying new property
        PropertySale,          // Propose selling existing property
        FeeChange,             // Change platform fees
        PolicyUpdate,          // Update platform policies
        TreasuryAction,        // Treasury management actions
        ContractUpgrade        // Smart contract upgrades
    }
    
    struct ProposalDetails {
        ProposalType proposalType;
        string title;
        string description;
        uint256 requestedAmount;   // For treasury actions
        address targetContract;    // For contract upgrades
        bytes executionData;       // Encoded function call data
        string[] votingOptions;    // For complex voting scenarios
    }
    
    mapping(uint256 => ProposalDetails) public proposalDetails;
    mapping(uint256 => mapping(address => bool)) public hasVoted;
    mapping(ProposalType => uint256) public minimumQuorum;
    
    // Voting parameters
    uint256 public constant VOTING_DELAY = 1 days;      // 1 day before voting starts
    uint256 public constant VOTING_PERIOD = 7 days;     // 7 days voting period
    uint256 public constant PROPOSAL_THRESHOLD = 100000 * 10**18; // 100k HKT to propose
    
    event ProposalCreatedWithDetails(
        uint256 indexed proposalId,
        address indexed proposer,
        ProposalType proposalType,
        string title,
        string description
    );
    
    event VoteCastWithReason(
        uint256 indexed proposalId,
        address indexed voter,
        uint8 support,
        uint256 weight,
        string reason
    );

    constructor(
        HKTSecurityToken _hktToken,
        TimelockController _timelock
    )
        Governor("HKT Governance DAO")
        GovernorVotes(IVotes(address(_hktToken)))
        GovernorVotesQuorumFraction(10) // 10% quorum required
        GovernorTimelockControl(_timelock)
    {
        hktToken = _hktToken;
        
        // Set minimum quorum for different proposal types
        minimumQuorum[ProposalType.PropertyAcquisition] = 15; // 15%
        minimumQuorum[ProposalType.PropertySale] = 20;        // 20%
        minimumQuorum[ProposalType.FeeChange] = 10;           // 10%
        minimumQuorum[ProposalType.PolicyUpdate] = 10;        // 10%
        minimumQuorum[ProposalType.TreasuryAction] = 15;      // 15%
        minimumQuorum[ProposalType.ContractUpgrade] = 25;     // 25%
    }

    /**
     * @dev Create a detailed governance proposal
     */
    function proposeWithDetails(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        string memory description,
        ProposalType proposalType,
        string memory title,
        uint256 requestedAmount,
        address targetContract,
        bytes memory executionData,
        string[] memory votingOptions
    ) public returns (uint256) {
        require(
            hktToken.balanceOf(msg.sender) >= PROPOSAL_THRESHOLD,
            "Insufficient HKT tokens to propose"
        );
        require(
            hktToken.kycVerified(msg.sender),
            "Proposer must be KYC verified"
        );

        uint256 proposalId = propose(targets, values, calldatas, description);
        
        proposalDetails[proposalId] = ProposalDetails({
            proposalType: proposalType,
            title: title,
            description: description,
            requestedAmount: requestedAmount,
            targetContract: targetContract,
            executionData: executionData,
            votingOptions: votingOptions
        });

        emit ProposalCreatedWithDetails(
            proposalId,
            msg.sender,
            proposalType,
            title,
            description
        );

        return proposalId;
    }

    /**
     * @dev Cast vote with reason and additional validation
     */
    function castVoteWithReasonAndParams(
        uint256 proposalId,
        uint8 support,
        string calldata reason,
        bytes memory params
    ) public returns (uint256) {
        require(
            hktToken.kycVerified(msg.sender),
            "Voter must be KYC verified"
        );
        require(!hasVoted[proposalId][msg.sender], "Already voted");

        uint256 weight = castVoteWithReason(proposalId, support, reason);
        hasVoted[proposalId][msg.sender] = true;

        emit VoteCastWithReason(proposalId, msg.sender, support, weight, reason);
        return weight;
    }

    /**
     * @dev Get proposal details including custom fields
     */
    function getProposalDetails(uint256 proposalId) 
        external 
        view 
        returns (ProposalDetails memory) 
    {
        return proposalDetails[proposalId];
    }

    /**
     * @dev Check if address can vote on proposal
     */
    function canVote(address voter, uint256 proposalId) 
        external 
        view 
        returns (bool) 
    {
        if (!hktToken.kycVerified(voter)) return false;
        if (hasVoted[proposalId][voter]) return false;
        if (getVotes(voter, proposalSnapshot(proposalId)) == 0) return false;
        
        ProposalState state = state(proposalId);
        return state == ProposalState.Active;
    }

    /**
     * @dev Get voting power of address at proposal snapshot
     */
    function getVotingPower(address voter, uint256 proposalId) 
        external 
        view 
        returns (uint256) 
    {
        return getVotes(voter, proposalSnapshot(proposalId));
    }

    /**
     * @dev Check if quorum is met for specific proposal type
     */
    function isQuorumReached(uint256 proposalId) public view returns (bool) {
        ProposalDetails memory details = proposalDetails[proposalId];
        uint256 requiredQuorum = minimumQuorum[details.proposalType];
        
        return quorum(proposalSnapshot(proposalId)) >= 
               (hktToken.totalSupply() * requiredQuorum) / 100;
    }

    // Override required functions
    function votingDelay() public pure override returns (uint256) {
        return VOTING_DELAY;
    }

    function votingPeriod() public pure override returns (uint256) {
        return VOTING_PERIOD;
    }

    function proposalThreshold() public pure override returns (uint256) {
        return PROPOSAL_THRESHOLD;
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(Governor, GovernorTimelockControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function state(uint256 proposalId)
        public
        view
        override(Governor, GovernorTimelockControl)
        returns (ProposalState)
    {
        return super.state(proposalId);
    }

    function propose(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        string memory description
    ) public override(Governor) returns (uint256) {
        return super.propose(targets, values, calldatas, description);
    }

    function _execute(
        uint256 proposalId,
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        bytes32 descriptionHash
    ) internal override(Governor, GovernorTimelockControl) {
        super._execute(proposalId, targets, values, calldatas, descriptionHash);
    }

    function _cancel(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        bytes32 descriptionHash
    ) internal override(Governor, GovernorTimelockControl) returns (uint256) {
        return super._cancel(targets, values, calldatas, descriptionHash);
    }

    function _executor()
        internal
        view
        override(Governor, GovernorTimelockControl)
        returns (address)
    {
        return super._executor();
    }
}