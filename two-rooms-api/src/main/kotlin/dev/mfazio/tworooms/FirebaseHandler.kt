package dev.mfazio.tworooms

import com.google.auth.oauth2.GoogleCredentials
import com.google.firebase.FirebaseApp
import com.google.firebase.FirebaseOptions
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.FirebaseToken
import com.google.firebase.auth.UserRecord
import dev.mfazio.tworooms.restclient.FirebaseRestClient
import dev.mfazio.tworooms.types.results.CreateGameResult
import dev.mfazio.tworooms.types.FirebaseResponse
import dev.mfazio.tworooms.types.TwoRoomsGame
import dev.mfazio.tworooms.types.TwoRoomsRole
import dev.mfazio.tworooms.types.results.JoinGameResult

object FirebaseHandler {
    private const val claimGameCode = "gameCode"
    private const val claimUserType = "userType"
    private const val gameOwnerUserType = "TwoRoomsGameOwner"
    private const val playerUserType = "TwoRoomsPlayer"

    private val restClient: FirebaseRestClient

    init {
        val serviceAccountStream =
            FirebaseHandler::class.java.classLoader.getResourceAsStream("tworooms-66ba8-firebase-adminsdk-8v62g-e713bc883d.json")

        val credentials = GoogleCredentials.fromStream(serviceAccountStream)

        val options = FirebaseOptions.Builder()
            .setCredentials(credentials)
            .setDatabaseUrl("https://tworooms-66ba8.firebaseio.com")
            .build()

        FirebaseApp.initializeApp(options)

        restClient = FirebaseRestClient(credentials, "games")
    }

    fun createUser(name: String): UserRecord {
        val createRequest = UserRecord.CreateRequest()
            .setDisplayName(name)
            .setDisabled(false)

        return FirebaseAuth.getInstance().createUser(createRequest)
    }

    fun createCustomToken(uid: String, gameCode: String, isGameOwner: Boolean) =
        FirebaseAuth.getInstance().createCustomToken(
            uid, mapOf(
                claimUserType to if (isGameOwner) gameOwnerUserType else playerUserType,
                claimGameCode to gameCode
            )
        )

    fun createGame(name: String, roles: List<TwoRoomsRole>): FirebaseResponse<CreateGameResult> {
        val userRecord = createUser(name)
        val (gameCode, fuelError) = this.restClient.createGame(userRecord, roles)

        val token: String? = if (gameCode != null && fuelError == null) {
            createCustomToken(userRecord.uid, gameCode, true)
        } else ""

        return FirebaseResponse(
            CreateGameResult(gameCode, token),
            fuelError?.message
        )
    }

    fun joinGame(gameCode: String, name: String): FirebaseResponse<JoinGameResult> {
        val userRecord = createUser(name)
        val (result, fuelError) = this.restClient.joinGame(userRecord, gameCode)

        val token: String? = if (result != null && fuelError == null) {
            createCustomToken(userRecord.uid, gameCode, false)
        } else ""

        return FirebaseResponse(
            JoinGameResult(gameCode, token),
            fuelError?.message
        )
    }

    fun addRandomPlayers(gameCode: String, count: Int? = null): FirebaseResponse<String> {
        val (result, fuelError) = this.restClient.addMultipleRandomPlayers(gameCode, count)

        return FirebaseResponse(
            result,
            fuelError?.message
        )
    }

    fun removePlayer(gameCode: String, uidToRemove: String, token: String): FirebaseResponse<String> {
        if (token.isBlank()) {
            return FirebaseResponse(null, "Access token is required.")
        }

        val firebaseToken: FirebaseToken? = FirebaseAuth.getInstance().verifyIdToken(token)

        val tokenUID = firebaseToken?.uid

        val tokenClaims = firebaseToken?.claims

        //TODO: This really hasn't be tested...
        val errorMessage: String? = when {
            tokenClaims == null -> "The entered token cannot be verified."
            !tokenClaims.containsKey("userType") ||
                !tokenClaims.containsKey("user_id") -> "The entered token is invalid."
            uidToRemove == tokenUID && tokenClaims["userType"] == gameOwnerUserType ->
                "Game creators cannot be removed from their own game."
            uidToRemove != tokenUID && tokenClaims["userType"] == playerUserType ->
                "Only game owners can remove other players."
            else -> null
        }

        if (errorMessage == null) {
            val (result, fuelError) = this.restClient.removePlayer(gameCode, uidToRemove)

            return FirebaseResponse(
                result,
                fuelError?.message
            )
        }

        return FirebaseResponse(null, errorMessage)
    }

    fun startGame(gameCode: String, token: String): FirebaseResponse<String> {
        if (token.isBlank()) {
            return FirebaseResponse(null, "Access token is required.")
        }

        val currentGameResponse = this.findFullGame(gameCode)

        if (currentGameResponse.error != null || currentGameResponse.data == null) {
            return FirebaseResponse(null, currentGameResponse.error)
        }

        val currentGame: TwoRoomsGame = currentGameResponse.data

        val firebaseToken: FirebaseToken? = FirebaseAuth.getInstance().verifyIdToken(token)

        val tokenUID = firebaseToken?.uid

        val tokenClaims = firebaseToken?.claims

        //TODO: This really hasn't be tested...
        val errorMessage: String? = when {
            tokenClaims == null -> "The entered token cannot be verified."
            !tokenClaims.containsKey("userType") ||
                !tokenClaims.containsKey("user_id") -> "The entered token is invalid."
            tokenClaims["userType"] != gameOwnerUserType || tokenUID != currentGame.ownerUID ->
                "Only game owners can start a game."
            else -> null
        }

        if (errorMessage == null) {
            val (result, fuelError) = this.restClient.startGame(currentGame)

            return FirebaseResponse(
                result,
                fuelError?.message
            )
        }

        return FirebaseResponse(null, errorMessage)
    }

    fun findGame(gameCode: String): FirebaseResponse<TwoRoomsGame> {
        val findGameResponse = this.restClient.findGame(gameCode)

        return FirebaseResponse(
            TwoRoomsGame.fromFirebaseDocuments(findGameResponse.data),
            findGameResponse.error?.message
        )
    }

    fun findFullGame(gameCode: String): FirebaseResponse<TwoRoomsGame> {
        val findGameResponse = this.restClient.findGame(gameCode)
        val getPlayersResponse = this.restClient.getPlayersForGame(gameCode)

        return FirebaseResponse(
            TwoRoomsGame.fromFirebaseDocuments(findGameResponse.data, getPlayersResponse.data),
            findGameResponse.error?.message
        )
    }
}

fun main() {

}