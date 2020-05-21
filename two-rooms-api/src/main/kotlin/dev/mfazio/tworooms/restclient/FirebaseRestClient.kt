package dev.mfazio.tworooms.restclient

import com.github.kittinunf.fuel.*
import com.github.kittinunf.fuel.core.FuelError
import com.github.kittinunf.result.Result
import com.github.salomonbrys.kotson.fromJson
import com.google.auth.oauth2.AccessToken
import com.google.auth.oauth2.GoogleCredentials
import com.google.firebase.auth.UserRecord
import com.google.gson.Gson
import com.google.gson.GsonBuilder
import dev.mfazio.tworooms.restclient.types.*
import dev.mfazio.tworooms.types.*
import java.util.*
import kotlin.math.floor
import kotlin.random.Random

class FirebaseRestClient(credentials: GoogleCredentials, collectionId: String) {

    private val scoped: GoogleCredentials = credentials.createScoped("https://www.googleapis.com/auth/datastore")
    private var accessToken: AccessToken

    init {
        //TODO: How often do I need to do this?
        this.accessToken = scoped.refreshAccessToken()
    }

    private val baseAPIUrl =
        "https://firestore.googleapis.com/v1/projects/tworooms-66ba8/databases/(default)/documents/$collectionId"

    fun findGame(gameCode: String): FirebaseRestResponse<FirebaseDocument> {
        checkAccessToken()
        val (request, response, result) = "$baseAPIUrl/$gameCode"
            .httpGet()
            .header("Authorization", "Bearer ${accessToken.tokenValue}")
            .responseString()
        val (responseString, error) = result

        return FirebaseRestResponse(
            if (responseString != null) firebaseDocumentGson.fromJson<FirebaseDocument>(responseString) else null,
            error
        )
    }

    fun getPlayersForGame(gameCode: String): FirebaseRestResponse<List<FirebaseDocument>> {
        checkAccessToken()
        val (request, response, result) = "$baseAPIUrl/$gameCode/players"
            .httpGet()
            .header("Authorization", "Bearer ${accessToken.tokenValue}")
            .responseString()
        val (responseString, error) = result
        val documentsList = firebaseDocumentGson.fromJson<FirebaseDocumentList>(responseString ?: "")

        return FirebaseRestResponse(
            documentsList.documents,
            error
        )
    }

    fun createGame(user: UserRecord, roles: List<TwoRoomsRole>): FirebaseRestResponse<String> {
        checkAccessToken()
        //TODO: Wrap this in a transaction - https://cloud.google.com/firestore/docs/reference/rest/#rest-resource:-v1.projects.databases.documents
        var gameCode: String = ""
        do {
            gameCode = TwoRoomsGame.generateGameCode()
            val existingGameResponse = findGame(gameCode)
        } while (existingGameResponse.data != null)

        val body = Gson().toJson(
            FirebaseDocument(
                fields = mapOf(
                    "gameCode" to StringValueObject(gameCode),
                    "ownerUID" to StringValueObject(user.uid),
                    "status" to StringValueObject(GameStatus.Created.name),
                    "roles" to ArrayValueObject(ValueObjectArray(roles.map { StringValueObject(it.name) }))
                )
            )
        )

        val (request, response, result) = "$baseAPIUrl?documentId=$gameCode"
            .httpPost()
            .header("Authorization", "Bearer ${accessToken.tokenValue}")
            .body(body)
            .responseString()

        val (responseString, error) = result

        if (error == null) {
            val (addUserResponse, addUserError) = addUserToGame(gameCode, user)

            //TODO: Do something with the result?

            return FirebaseRestResponse(
                gameCode,
                addUserError
            )
        }

        return FirebaseRestResponse(
            gameCode,
            error
        )
    }

    fun joinGame(user: UserRecord, gameCode: String): FirebaseRestResponse<String?> {
        checkAccessToken()
        val existingGame = findGame(gameCode)

        return if (existingGame.wasSuccessful()) {
            val (result, fuelError) = addUserToGame(gameCode, user)

            FirebaseRestResponse(
                result,
                fuelError
            )
        } else {
            FirebaseRestResponse(
                "Game not found",
                existingGame.error
            )
        }
    }

    fun addUserToGame(gameCode: String, user: UserRecord): Result<String, FuelError> =
        addUserToGame(gameCode, user.displayName, user.uid)

    fun addMultipleRandomPlayers(gameCode: String, playerCount: Int? = null): Result<String, FuelError> {
        val count = playerCount ?: Random.nextInt(4, 12)

        val results = (1..count).map { _ ->
                val name = ((65..90) + (97..122))
                    .map { it.toChar().toString() }
                    .shuffled()
                    .take(Random.nextInt(4, 12))
                    .joinToString("")

                val result = addUserToGame(gameCode, name, UUID.randomUUID().toString())

            if(result.component2() != null) return result

            result
        }

        return results.last()
    }

    private fun addUserToGame(gameCode: String, name: String, uid: String): Result<String, FuelError> {
        checkAccessToken()
        val body = Gson().toJson(
            FirebaseDocument(
                fields = mapOf(
                    "name" to StringValueObject(name),
                    "uid" to StringValueObject(uid)
                )
            )
        )

        val (request, response, result) = "$baseAPIUrl/$gameCode/players?documentId=${uid}"
            .httpPost()
            .header("Authorization", "Bearer ${accessToken.tokenValue}")
            .body(body)
            .responseString()

        return result
    }

    fun removePlayer(gameCode: String, uid: String): Result<String, FuelError> {
        checkAccessToken()
        val (request, response, result) = "$baseAPIUrl/$gameCode/players/${uid}"
            .httpDelete()
            .header("Authorization", "Bearer ${accessToken.tokenValue}")
            .responseString()

        return result
    }

    fun startGame(game: TwoRoomsGame): Result<String, FuelError> {
        checkAccessToken()
        val distributedPlayers = distributeTeams(game)

        distributedPlayers.forEach { player ->
            val body = Gson().toJson(
                FirebaseDocument(
                    fields = mapOf(
                        "name" to StringValueObject(player.name),
                        "uid" to StringValueObject(player.uid),
                        "team" to StringValueObject(player.team?.name),
                        "role" to StringValueObject(player.role?.name)
                    )
                )
            )

            val (request, response, result) =
                "$baseAPIUrl/${game.gameCode}/players/${player.uid}"
                    .httpPatch()
                    .body(body)
                    .header("Authorization", "Bearer ${accessToken.tokenValue}")
                    .responseString()

            val (resultString, fuelError) = result

            if (fuelError != null) {
                return result
            }
        }

        //TODO: Make this all a single transaction.
        val body = Gson().toJson(
            FirebaseDocument(fields = mapOf("status" to StringValueObject(GameStatus.Started.name)))
        )

        val (request, response, result) = "$baseAPIUrl/${game.gameCode}?updateMask.fieldPaths=status"
            .httpPatch()
            .body(body)
            .header("Authorization", "Bearer ${accessToken.tokenValue}")
            .responseString()

        return result
    }

    fun cancelGame(gameCode: String): FirebaseResponse<String> {

    }

    private fun updateGameStatus()

    private fun checkAccessToken() {
        if (this.accessToken.expirationTime?.before(Date()) != false) {
            this.accessToken = scoped.refreshAccessToken()
        }
    }

    private fun distributeTeams(game: TwoRoomsGame): List<TwoRoomsPlayer> =
        game.players.filterNotNull().shuffled().let { allPlayers ->
            val gambler =
                (if (allPlayers.count() % 2 != 0) allPlayers.first() else null)?.copy(
                    team = TwoRoomsTeam.Gray,
                    role = TwoRoomsRole.Gambler
                )

            val notRequiredRoles = game.roles.filter { !it.isRequired }

            val updatedPlayers = allPlayers
                .filter { it != gambler }
                .mapIndexed { ind, player ->
                    val roleInd = floor(ind / 2.0).toInt() - 1
                    player.copy(
                        team = if (ind % 2 == 0) TwoRoomsTeam.Blue else TwoRoomsTeam.Red,
                        role = when {
                            ind == 0 -> TwoRoomsRole.President
                            ind == 1 -> TwoRoomsRole.Bomber
                            roleInd < notRequiredRoles.count() -> notRequiredRoles[roleInd]
                            else -> if (ind % 2 == 0) TwoRoomsRole.BlueTeam else TwoRoomsRole.RedTeam
                        }
                    )
                }

            (updatedPlayers + gambler).filterNotNull()
        }

    companion object {
        private val firebaseDocumentGson = GsonBuilder()
            .registerTypeAdapter(ValueObject::class.java, ValueObjectDeserializer())
            .create()
    }
}