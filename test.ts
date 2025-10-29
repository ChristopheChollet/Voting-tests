import { expect } from "chai";
import { ethers } from "hardhat";

// Enregistrement des électeurs
describe("Voting", function () {
  let votingContract;
  let owner;
  let voter1;
  let voter2;

  beforeEach(async function () {
    [owner, voter1, voter2] = await ethers.getSigners();
    const VotingFactory = await ethers.getContractFactory("Voting");
    votingContract = await VotingFactory.deploy();
    await votingContract.deployed();
    console.log("Contrat déployé à :", votingContract.address); // Debug
  });

  it("Le propriétaire peut enregistrer un électeur", async function () {
    await votingContract.connect(owner).registerVoter(voter1.address);
    const voterInfo = await votingContract.voters(voter1.address);
    expect(voterInfo.isRegistered).to.equal(true);
  });

  it("Un électeur non enregistré ne peut pas voter", async function () {
    await votingContract.connect(owner).startProposalsRegistration();
    await votingContract.connect(owner).endProposalsRegistration();
    await votingContract.connect(owner).startVotingSession();
    await expect(votingContract.connect(voter1).vote(0)).to.be.revertedWith("Vous netes pas enregistre.");
  });

  it("Un électeur enregistré peut soumettre une proposition", async function () {
    await votingContract.connect(owner).registerVoter(voter1.address);
    await votingContract.connect(owner).startProposalsRegistration();
    await votingContract.connect(voter1).submitProposal("Proposition de test");
    const proposal = await votingContract.proposals(0);
    expect(proposal.description).to.equal("Proposition de test");
  });

  
  it("Le propriétaire peut clôturer le vote (à finir)", async function () {
    await votingContract.connect(owner).startProposalsRegistration();
    await votingContract.connect(owner).endProposalsRegistration();
    await votingContract.connect(owner).startVotingSession();
    await votingContract.connect(owner).endVotingSession();
    
  });
});
