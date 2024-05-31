const { expect } = require("chai");
const { ethers } = require("hardhat");

const tokens = (n) => {
    return ethers.utils.parseUnits(n.toString(), 'ether')
}
const ether = tokens

describe ("Crowdsale", () => {
    let crowdsale, deployer, user1, transaction, token
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
        console.log(token.address)
        console.log(crowdsale.address)
        console.log(tokens(10))
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
describe("updating price", () => {
    beforeEach( async () => {
        let transaction, result
        let price = ether(2)
        transaction = await crowdsale.connect(deployer).setPrice(ether(2))
        result = await transaction.wait()
    })
    describe("success", () => {
    it('updates the price', async () => {
        expect(await crowdsale.price()).to.equal(tokens(2))
    })
})
    describe("failure", ()=> {
        let price = ether(2)
    it('prevents non-owner from updating price', async () => {
        await expect(crowdsale.connect(user1).setPrice(price)).to.be.reverted
    })
})
})
describe("finalise the sale", () => {
    let transaction, result
    let amount = tokens(10)
    let value = ether(10)

    describe("success", () => {
        beforeEach( async () => {
            transaction = await crowdsale.connect(user1).buyTokens(amount, { value: value })
            result = await transaction.wait()

            transaction = await crowdsale.connect(deployer).finalise()
            result = await transaction.wait()
        })
        it('transfer remaining tokens to owner', async () => {
            expect(await token.balanceOf(crowdsale.address)).to.equal(tokens(0))
            expect(await token.balanceOf(deployer.address)).to.equal(tokens(999990))
        })
        it('transfers ETH balance', async () => {
            expect(await ethers.provider.getBalance(crowdsale.address)).to.equal(tokens(0))
        })
        it('emits finalised event', async () => {
            await expect(transaction).to.emit(crowdsale, "Finalise").withArgs(amount, value)
        })
    })
    describe("failure", ()=> {
        it('prevents a non-owner from finalising', async () => {
            await expect(crowdsale.connect(user1).finalise()).to.be.reverted
        })
    })
})
})