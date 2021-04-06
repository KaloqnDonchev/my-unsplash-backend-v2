;
const chai = require("chai");
const {expect} = chai;
const {usersManagementService} = require("../services");
const {isNullAny, filterObjectOrArrayObjsProps, getTimeMinuteBeforeNow} = require("../utils");
const {users} = require("./test-services");


describe("usersManagementService", () => {

    it("should verify user email and put recheck info", (done) => {
        users.nonVerifiedUser()
            .then((nonVerifiedUser) => {
                expect(nonVerifiedUser).to.not.be.null;

                let args = {
                    userId: nonVerifiedUser.id,
                    token: nonVerifiedUser.emailVerifyToken,
                    recheckId: "re_ms3HAQPSjyMRHsmKfjwhHJNPFMq1ghouykb95teN61cVZ2kxj",
                    pubEncrKey: "4rXZh5YEJ11GXNP37CUdaASTYEobKumXfVUmboUPtohfnfGik",
                    recheckToken: "abcec8e0-3a30-11eb-b940-4389f8374847",
                    keysDataId: "0x3c1750792962efcd653a9647d8fe8fc7a3cf7af896528a5ebc155bf292fce3a7",
                };

                let expectedUser = {
                    id: nonVerifiedUser.id,
                    username: nonVerifiedUser.username,
                    recheckId: args.recheckId,
                    isActive: true,
                    createdAt: nonVerifiedUser.createdAt,
                };

                usersManagementService.verifyUserEmailAndPutRecheckInfo(args)
                    .then((user) => {
                        expect(user).to.not.be.null;
                        expect(new Date(user.updatedAt)).to.be.greaterThan(getTimeMinuteBeforeNow());

                        user = filterObjectOrArrayObjsProps(user, 'updatedAt');

                        expect(user).to.deep.equal(expectedUser);

                        done();
                    })
                    .catch((error) => done(error));
            })
            .catch((error) => done(error));
    });

    it("should return a user with all info", (done) => {
        users.verifiedUserWithInfo()
            .then((verifiedUserWithInfo) => {

                let expectedInfo = {...verifiedUserWithInfo};
                //TODO change all deletes for obj properties to {propForDelete, ...newObjResult}=oldObj
                delete expectedInfo.emailVerifiedAt;
                delete expectedInfo.pubEncrKey;
                delete expectedInfo.recheckToken;
                delete expectedInfo.keysDataId;
                delete expectedInfo.loginAttempts;
                delete expectedInfo.password;
                delete expectedInfo.returnChallenge;
                if (isNullAny(expectedInfo.avatar)) {
                    delete expectedInfo.avatar;
                }

                usersManagementService.getUserWithAllInfo(verifiedUserWithInfo.id)
                    .then((user) => {
                        if (isNullAny(expectedInfo.avatar)) {
                            user = filterObjectOrArrayObjsProps(user, "avatar");
                        }
                        expect(user).to.deep.equal(expectedInfo);
                        done();
                    })
                    .catch((error) => done(error));
            })
            .catch((error) => done(error));
    });

    it("should create a new user", (done) => {
        let expectedResult = {userId: 3};

        let args = {
            "firstName": "Johny",
            "lastName": "Doe",
            "title": "mr.",
            "dateOfBirth": "2020-11-31T22:00:00.000Z",
            "jobPosition": "CFO",
            "phone": "+35989424432355",
            "email": "test3@example.com",
            "street": "Studentska 8",
            "city": "Ruse",
            "zipCode": "7000",
            "state": "Ruse",
            "country": "Bulgaria",
            "avatar": null,
            "organizationName": "ReCheck B.V",
            "dateOfRegistration": "2020-11-31T22:00:00.000Z",
            "orgStreet": "Studentska 18",
            "orgCity": "Ruse",
            "orgState": "Ruse",
            "orgZipCode": "7000",
            "orgCountry": "Bulgaria",
            "organizationType": "Endowment Fund",
            "strategy": "Investor",
            "userType": "investor",
            "username": "test999",
            "password": "secretPass3",
            "passwordConfirmation": "secretPass3",
            "terms": true,
        };

        usersManagementService.registerUser(args)
            .then((result) => {
                expect(result.returnChallenge).to.not.be.null;

                result = filterObjectOrArrayObjsProps(result, 'returnChallenge');

                expect(result).to.deep.equal(expectedResult);
                done();
            })
            .catch((error) => done(error));
    });

    it("should login user and return JWT token and ReCheck info", (done) => {
        users.verifiedUser()
            .then(verifiedUser => {
                let expectedTokenAndKeysDataId = {
                    userId: verifiedUser.id,
                    recheckId: verifiedUser.recheckId,
                    pubEncrKey: verifiedUser.pubEncrKey,
                    recheckToken: verifiedUser.recheckToken,
                    keysDataId: verifiedUser.keysDataId,
                };

                let args = {
                    username: verifiedUser.username,
                    password: "testPass1",
                };

                usersManagementService.loginUser(args)
                    .then((tokenAndKeysDataId) => {
                        expect(tokenAndKeysDataId.token).to.not.be.null;

                        tokenAndKeysDataId = filterObjectOrArrayObjsProps(tokenAndKeysDataId, 'token');

                        expect(tokenAndKeysDataId).to.deep.equal(expectedTokenAndKeysDataId);
                        done();
                    })
                    .catch((error) => done(error));
            })
            .catch((error) => done(error));
    });

    it("should update user's ReCheck info", (done) => {
        users.nonVerifiedUser()
            .then(nonVerifiedUser => {
                let expectedUser = {
                    id: nonVerifiedUser.id,
                    username: nonVerifiedUser.username,
                    isActive: nonVerifiedUser.isActive,
                    recheckId: null,
                    createdAt: nonVerifiedUser.createdAt,
                };

                let args = {
                    returnChallenge: nonVerifiedUser.returnChallenge,
                    recheckToken: "dd5a07d0-3a2e-11eb-b940-4389f8374847",
                };

                usersManagementService.updateRecheckInfo(args)
                    .then((user) => {
                        expect(new Date(user.updatedAt)).to.be.greaterThan(getTimeMinuteBeforeNow());

                        user = filterObjectOrArrayObjsProps(user, 'updatedAt');

                        expect(user).to.deep.equal(expectedUser);
                        done();
                    })
                    .catch((error) => done(error));
            })
            .catch((error) => done(error));
    });

    it("should get user's ReCheck token", (done) => {
        users.verifiedUser()
            .then(verifiedUser => {
                let expectedRecheckToken = verifiedUser.recheckToken;

                let args = {
                    userId: verifiedUser.id,
                    returnChallenge: verifiedUser.returnChallenge,
                    emailVerifyToken: null,
                };

                usersManagementService.getRecheckToken(args)
                    .then((recheckToken) => {
                        expect(recheckToken).to.equal(expectedRecheckToken);
                        done();
                    })
                    .catch((error) => done(error));
            })
            .catch((error) => done(error));
    });

    it("should update user's credentials", (done) => {
        users.verifiedUser()
            .then(verifiedUser => {
                let expectedUser = {
                    id: verifiedUser.id,
                    username: verifiedUser.username,
                    isActive: verifiedUser.isActive,
                    recheckId: verifiedUser.recheckId,
                    createdAt: verifiedUser.createdAt,
                };

                let args = {
                    keysDataId: "0x999750792962efcd653a9647d8fe8fc7a3cf7af896528a5ebc155bf292fce3a7",
                };

                usersManagementService.updateUser(args, verifiedUser.id)
                    .then((updatedUser) => {
                        expect(new Date(updatedUser.updatedAt)).to.be.greaterThan(getTimeMinuteBeforeNow());

                        updatedUser = filterObjectOrArrayObjsProps(updatedUser, 'updatedAt');

                        expect(updatedUser).to.deep.equal(expectedUser);
                        done();
                    })
                    .catch((error) => done(error));
            })
            .catch((error) => done(error));
    });
});