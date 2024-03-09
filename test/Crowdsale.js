const { expect } = require("chai");
const { ethers } = require("hardhat");

const tokens = (n) => {
    return ethers.utils.parseUnits(n.toString(), 'ether')
}
const ether = tokens

describe ("Crowdsale", () => {
    let crowdsale, deployer, user1, transaction
    beforeEach( async () => {

        const Crowdsale = await ethers.getContractFactory("Crowdsale")
        const Token = await ethers.getContractFactory("Token")

        accounts = await ethers.getSigners()
        deployer = accounts[0]
        user1 = accounts[1]

        token = await Token.deploy('Ease V1', 'ESE', '1000000')

        crowdsale = await Crowdsale.deploy(token.address, ether(1), 1000000)

        transaction = await token.connect(deployer).transfer(crowdsale.address, tokens(1000000))
        await transaction.wait()
    })
describe("deployment", async () =>{
    it("sends tokens to the crowdsale contract", async () => {
        expect(await token.balanceOf(crowdsale.address)).to.equal(tokens(1000000))
    })
    
    it("returns token address", async () =>  {
        expect(await crowdsale.token()).to.equal(token.address)
    })
    it("returns token price", async () =>  {
        expect(await crowdsale.price()).to.equal(ether(1))
    })

})
describe("Buying tokens", () => {
    let amount = tokens(10)
    let transaction, result
    describe("Success", () =>{
        beforeEach( async () => {
            transaction = await crowdsale.connect(user1).buyTokens(amount, { value: ether(10) })
            result = await transaction.wait() 
        })
    
        it("transfers tokens", async () =>  {
            expect(await token.balanceOf(crowdsale.address)).to.equal(tokens(999990))
            expect(await token.balanceOf(user1.address)).to.equal(amount)
        })
        it("updates contracts ether balance", async () =>  [
            expect(await ethers.provider.getBalance(crowdsale.address)).to.equal(amount)
        ])
        it("updates tokens sold", async () =>  [
            expect(await crowdsale.tokensSold()).to.equal(amount)
        ])
        it("emits a buy event", async () =>  [
            await expect(transaction).to.emit(crowdsale,'Buy').withArgs(amount, user1.address)
        ])

})

describe("failure", () => {
    it("rejects insufficient eth", async () => {
        await expect(crowdsale.connect(user1).buyTokens(tokens(10), { value: 0 })).to.be.reverted
    })

})
})
describe("sending eth", () => {
    let transaction, result
    let amount = ether(10)
    beforeEach( async () => {
        transaction = await user1.sendTransaction({ to: crowdsale.address, value: amount })
        result = await transaction.wait()
    })
    it("updates contract eth balance", async () => {
        expect(await ethers.provider.getBalance(crowdsale.address)).to.equal(amount)
    })
    it("updates user token balance", async () => {
        expect(await token.balanceOf(user1.address)).to.equal(amount)
    })
})
})