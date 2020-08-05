const assert = require('assert');
const BigNumber = require('bignumber.js');
const {
    toWad,
    fromWad,
    createEVMSnapshot,
    restoreEVMSnapshot
} = require('./funcs');

const TestToken = artifacts.require('test/TestToken.sol');
const VoteBox = artifacts.require('VoteBox.sol');

contract('votebox', accounts => {
    let mcb;
    let voteBox;

    const u1 = accounts[4];
    const u2 = accounts[5];
    const u3 = accounts[6];

    let snapshotId;

    beforeEach(async () => {
        snapshotId = await createEVMSnapshot();
        mcb = await TestToken.new("MCB", "Test MCB");
        voteBox = await VoteBox.new(mcb.address);
    });

    afterEach(async function () {
        await restoreEVMSnapshot(snapshotId);
    });

    // describe("create proposal", async () => {
    //     it("indexPrice", async () => {
    //         await priceFeeder.setPrice(0);
    //         try {
    //             await amm.indexPrice();
    //             throw null;
    //         } catch (error) {
    //             assert.ok(error.message.includes("dangerous index price"));
    //         }
    //     });
    // });

    it("vote before create", async () => {
        try {
            await voteBox.vote(0, 0);
            throw null;
        } catch (error) {
            assert.ok(error.message.includes("invalid id"));
        }
    });

    // describe("create proposal", async () => {
    //     it("indexPrice", async () => {
// invalid data
// out of time
    //     });
    // });
});
