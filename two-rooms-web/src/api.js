const { auth, logInWithToken } = require('./firebase')

const axios = require('axios').default

const baseURL = "http://localhost:7071/api/"

export async function joinGame(gameCode, name) {
    try {
        const result = await axios.post(`${baseURL}joinGame`, {name, gameCode})
        const data =  result.data.data

        await logInWithToken(data.token)

        return data
    } catch(ex) {
        console.error(ex)
        return {
            "error": `An exception occurred when trying to join the game [${gameCode}].`
        }
    }
}

export async function createGame(name, roles) {
    try {
        const result = await axios.post(`${baseURL}createGame`, {name, roles})
        const data =  result.data.data

        await logInWithToken(data.token)

        return data
    } catch(ex) {
        console.error(ex)
        return {
            "error": "An exception occurred when trying to create a game."
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
        const data =  result.data.data

        return data
    } catch(ex) {
        console.error(ex)
        return {
            "error": "An exception occurred when trying to remove a user from the game."
        }
    }
}
