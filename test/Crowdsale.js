const { expect } = require("chai");
const { ethers } = require("hardhat");

const tokens = (n) => {
    return ethers.utils.parseUnits(n.toString(), 'ether')
}

describe ("Crowdsale", () => {
    let crowdsale
    beforeEach( async () => {
        const Crowdsale = await ethers.getContractFactory("Crowdsale")
        crowdsale = await Crowdsale.deploy()
    })
describe("deployment", async () =>{
    it("has a name", async () =>  {
        
        expect(await crowdsale.name()).to.equal("Crowdsale")
    })
})
})