package dev.mfazio.tworooms

import com.google.auth.oauth2.AccessToken
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
import kotlin.random.Random

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

    fun removePlayer(gameCode: String, uid: String, token: String): FirebaseResponse<String> {
        //TODO: Validate the user

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
            tokenClaims["user_id"] == tokenUID && tokenClaims["userType"] == gameOwnerUserType ->
                "Game creators cannot be removed from their own game."
            tokenClaims["user_id"] != tokenUID && tokenClaims["userType"] == playerUserType ->
                "Only game owners can remove other players."
            else -> null
        }

        if (errorMessage == null) {
            val (result, fuelError) = this.restClient.removePlayer(gameCode, uid)

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
    /*val response = FirebaseHandler.createGame("Michael", TwoRoomsRole.values().filter { it != TwoRoomsRole.Rival })

    println(response)*/
/*
    val response = FirebaseHandler.joinGame("VFUEPH", "New Player #2")

    println(response)*/

    val response = FirebaseHandler.removePlayer(
        "VFUEPH",
        "2zoxPWBhVbbrFv98Y7e5GPZRvRy1",
        "eyJhbGciOiJSUzI1NiIsImtpZCI6ImZjMmM4YmIyNmE3OGM0M2JkODYzNzA1YjNkNzkyMWI0ZTY0MjVkNTQiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiUG9zdG1hbi1GYXoiLCJ1c2VyVHlwZSI6IlR3b1Jvb21zR2FtZU93bmVyIiwiZ2FtZUNvZGUiOiJVT1JOWVEiLCJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vdHdvcm9vbXMtNjZiYTgiLCJhdWQiOiJ0d29yb29tcy02NmJhOCIsImF1dGhfdGltZSI6MTU4ODk4MTUzNiwidXNlcl9pZCI6Ild6RGtzdUlxejFoSHV3bXpHYlAzUkh2UUVMaDEiLCJzdWIiOiJXekRrc3VJcXoxaEh1d216R2JQM1JIdlFFTGgxIiwiaWF0IjoxNTg4OTkxNDM2LCJleHAiOjE1ODg5OTUwMzYsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnt9LCJzaWduX2luX3Byb3ZpZGVyIjoiY3VzdG9tIn19.A4_VYOxoeE1tUB2-xPhwVjxAqzbCbp4vm4lxN5hhINCMA-KgVQ2YFfG6tu1Wf1tTjJBHN5sqTAzS4KxnL5f4lTtz66i5Fj-d4hjY7Vngl8cOGeUEUKvFXQfIE0omlDvReveOuB4bGRn23HdE4RTIBslODPJ0YfLE8cux0oUk2D4h4neEQP0NtzsxD4BF3yjexfBQRf9XFpz3YHrR0ipvEerhIEIdpLBiniyzwK8d-QbUduZsXQ3EC5gnK3mZZZU0EVudMDuyIHLINJ_rZ3UT-i9R-usCvRxDx04IuWGoMonnBsuy7FUjFOYY-5UPd7FUcWMfiE8BMUWRXxeEbTpG3A"
    )

    println(response)
}