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
    let snapshotId;
    let mcb;
    let voteBox;
    const u1 = accounts[4];
    const u2 = accounts[5];
    const u3 = accounts[6];

    beforeEach(async () => {
        snapshotId = await createEVMSnapshot();
        mcb = await TestToken.new("MCB", "Test MCB");
        voteBox = await VoteBox.new(mcb.address);
    });

    afterEach(async function () {
        await restoreEVMSnapshot(snapshotId);
    });

    async function defaultActiveBlock() {
        const beginBlock = 1 /* next block */ + (await web3.eth.getBlockNumber());
        const endBlock = beginBlock + 172800; // 30 day for 15s/block
        return { beginBlock, endBlock };
    }

    describe("propose", async () => {
        it("insufficient mcb", async () => {
            try {
                const { beginBlock, endBlock } = await defaultActiveBlock();
                await voteBox.propose("https://", beginBlock, endBlock, { from: u1 });
                throw null;
            } catch (error) {
                assert.ok(error.message.includes("proposal privilege required"));
            }  
        });

        it("insufficient mcb", async () => {
            await mcb.mint(u1, '19999' + '999999999999999999');
            try {
                const { beginBlock, endBlock } = await defaultActiveBlock();
                await voteBox.propose("https://", beginBlock, endBlock, { from: u1 });
                throw null;
            } catch (error) {
                assert.ok(error.message.includes("proposal privilege required"));
            }  
        });

        describe("with proposal privilege", async () => {
            beforeEach(async () => {
                await mcb.mint(u1, toWad('20000'));
            });
        
            it("normal", async () => {
                const { beginBlock, endBlock } = await defaultActiveBlock();
                assert.equal(await voteBox.totalProposals(), 0);

                await voteBox.propose("https://", beginBlock, endBlock, { from: u1 });
                assert.equal(await voteBox.totalProposals(), 1);
                const meta0 = await voteBox.proposals(0);
                assert.equal(meta0.link, "https://");
                assert.equal(meta0.beginBlock, beginBlock);
                assert.equal(meta0.endBlock, endBlock);

                await voteBox.propose("https://", beginBlock + 1, endBlock, { from: u1 });
                assert.equal(await voteBox.totalProposals(), 2);
                const meta1 = await voteBox.proposals(1);
                assert.equal(meta1.link, "https://");
                assert.equal(meta1.beginBlock, beginBlock + 1);
                assert.equal(meta1.endBlock, endBlock);
            });

            it("wrong link", async () => {
                try {
                    const { beginBlock, endBlock } = await defaultActiveBlock();
                    await voteBox.propose("", beginBlock, endBlock, { from: u1 });
                    throw null;
                } catch (error) {
                    assert.ok(error.message.includes("empty link"));
                }
            });

            it("wrong time", async () => {
                try {
                    const { beginBlock, endBlock } = await defaultActiveBlock();
                    await voteBox.propose("https://", beginBlock - 1, endBlock, { from: u1 });
                    throw null;
                } catch (error) {
                    assert.ok(error.message.includes("old proposal"));
                }
                try {
                    const { beginBlock } = await defaultActiveBlock();
                    await voteBox.propose("https://", beginBlock, beginBlock, { from: u1 });
                    throw null;
                } catch (error) {
                    assert.ok(error.message.includes("period is too short"));
                }
            });
        }); // with with proposal privilege
    }); // propose

    describe("vote", async () => {
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
    }); // vote
});
