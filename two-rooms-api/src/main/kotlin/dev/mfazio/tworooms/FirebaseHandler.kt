package dev.mfazio.tworooms

import com.google.auth.oauth2.AccessToken
import com.google.auth.oauth2.GoogleCredentials
import com.google.firebase.FirebaseApp
import com.google.firebase.FirebaseOptions
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.UserRecord
import dev.mfazio.tworooms.restclient.FirebaseRestClient
import dev.mfazio.tworooms.types.CreateGameResult
import dev.mfazio.tworooms.types.FirebaseResponse
import dev.mfazio.tworooms.types.TwoRoomsGame
import dev.mfazio.tworooms.types.TwoRoomsRole

object FirebaseHandler {
    private const val claimGameCode = "gameCode"
    private const val claimUserType = "userType"
    private const val gameOwnerUserType = "TwoRoomsGameOwner"
    private const val playerUserType = "TwoRoomsPlayer"

    private val adminToken: AccessToken?

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

        val scoped = credentials.createScoped("https://www.googleapis.com/auth/datastore")

        //TODO: How often do I need to do this?
        adminToken = scoped.refreshAccessToken()

        restClient = FirebaseRestClient("games", adminToken)
/*
        with(FirebaseAuth.getInstance()) {
            adminToken = this.createCustomToken(adminUID)
            this.setCustomUserClaims(adminUID, mapOf(claimUserType to adminUserType))
        }*/
    }

    fun getUser(uid: String) = FirebaseAuth.getInstance().getUser(uid)

    /*fun getOrCreateUser(joinGameRequest: JoinGameRequest): UserRecord =
        (joinGameRequest.uid?.let { uid -> getUser(uid) } ?: createUser(joinGameRequest.playerName)).apply {
            FirebaseAuth.getInstance().setCustomUserClaims(
                this.uid,
                mapOf("gameCode" to joinGameRequest.gameCode)
            )
        }*/

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
    val response = FirebaseHandler.createGame(
        "Michael",
        listOf(
            TwoRoomsRole.President,
            TwoRoomsRole.Bomber,
            TwoRoomsRole.Gambler,
            TwoRoomsRole.Clown,
            TwoRoomsRole.Rival,
            TwoRoomsRole.Angel,
            TwoRoomsRole.Demon
        )
    )

    println(response)

    val game = FirebaseHandler.findFullGame(response.data?.gameCode ?: "")

    println(game)
}