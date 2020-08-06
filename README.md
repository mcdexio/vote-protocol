# vote-protocol

[![Build Status](https://travis-ci.org/mcdexio/vote-protocol.svg?branch=master)](https://travis-ci.org/mcdexio/vote-protocol)
[![Coverage Status](https://coveralls.io/repos/github/mcdexio/vote-protocol/badge.svg?branch=master)](https://coveralls.io/github/mcdexio/vote-protocol?branch=master)

A simple smart contract which only records everyone’s voting on each proposal.

## Design

This design document was proposed [here](https://forum.mcdex.io/t/a-lightweight-voting-system-for-mcdex/89).

This voting smart contract has no admin privilege. It is only used to record the vote(for/against) of the community members on the blockchain. Because the voting smart contract is simple enough and can not change anything of MCDEX directly, we could audit it by the community only.

A proposal has the following on-chain metadata:

```
id: auto-increment unique id
proposal link: the forum link of the proposal
active time: [begin block, end block] for voting
```

The smart contract has the following public functions:

```
propose(link, begin, end): Create a new proposal, need a proposal privilege
vote(id, for/against): Vote for/against the proposal with id
```

The smart contract has the following events:

```
Proposal(id, link, begin, end): The new proposal is created.
Vote(address, id, for): Someone changes his/her vote on the proposal.
```

The backend system can use the events to trace the voting.

However, anyone can verify the voting result by reading this contract’s data from block-chain. Nobody can cheat on voting.
