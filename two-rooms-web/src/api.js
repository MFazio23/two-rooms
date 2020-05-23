const {auth, logInWithToken} = require('./firebase')

const axios = require('axios').default

const baseURL = "http://localhost:7071/api/"

export async function joinGame(gameCode, name) {
    try {
        const result = await axios.post(`${baseURL}joinGame`, {name, gameCode})
        const data = result.data.data

        await logInWithToken(data.token)

        return data
    } catch (ex) {
        console.error(ex)
        return {
            "error": `An exception occurred when trying to join the game [${gameCode}].`
        }
    }
}

export async function createGame(name, roles) {
    try {
        const result = await axios.post(`${baseURL}createGame`, {name, roles})
        const data = result.data.data

        await logInWithToken(data.token)

        return data
    } catch (ex) {
        console.error(ex)
        return {
            "error": "An exception occurred when trying to create a game."
        }
    }
}

export async function startGame(gameCode) {
    try {
        const token = await auth().currentUser.getIdToken();
        const result = await axios.post(`${baseURL}startGame`, {gameCode, token})

        return result.data.data
    } catch (ex) {
        console.error(ex)
        return {
            "error": ex?.response?.data?.message || "An exception occurred when trying to remove a user from the game."
        }
    }
}

export async function removePlayer(gameCode, uid) {
    try {
        const token = await auth().currentUser.getIdToken();
        const result = await axios.post(`${baseURL}removePlayer`, {
            gameCode: gameCode,
            uid: uid || auth().currentUser.uid,
            token: token
        })
        return result.data.data
    } catch (ex) {
        console.error(ex)
        return {
            "error": ex?.response?.data?.message || "An exception occurred when trying to remove a user from the game."
        }
    }
}

export async function startRound(gameCode, roundNumber) {
    try {
        const token = await auth().currentUser.getIdToken();
        const result = await axios.post(`${baseURL}startRound`, {gameCode, token, roundNumber})

        return result.data.data
    } catch (ex) {
        console.error(ex)
        return {
            "error": ex?.response?.data?.message || "An exception occurred when trying to start a round."
        }
    }
}

export async function nextRound(gameCode, roundNumber) {
    try {
        const token = await auth().currentUser.getIdToken();
        const result = await axios.post(`${baseURL}nextRound`, {gameCode, token, roundNumber})

        return result.data.data
    } catch (ex) {
        console.error(ex)
        return {
            "error": ex?.response?.data?.message || "An exception occurred when trying to continue to the next round."
        }
    }
}

export async function endGame(gameCode) {
    try {
        const token = await auth().currentUser.getIdToken();
        const result = await axios.post(`${baseURL}endGame`, {gameCode, token})

        return result.data.data
    } catch (ex) {
        console.error(ex)
        return {
            "error": ex?.response?.data?.message || "An exception occurred when trying to end a game."
        }
    }
}

export async function selectWinners(gameCode, winners) {
    try {
        const token = await auth().currentUser.getIdToken();
        const result = await axios.post(`${baseURL}pickWinners`, {gameCode, token, winners})

        return result.data.data
    } catch (ex) {
        console.error(ex)
        return {
            "error": ex?.response?.data?.message || "An exception occurred when trying to pick game winners."
        }
    }
}
