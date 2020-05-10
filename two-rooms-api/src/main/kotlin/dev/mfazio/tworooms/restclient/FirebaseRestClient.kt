package dev.mfazio.tworooms.restclient

import com.github.kittinunf.fuel.core.FuelError
import com.github.kittinunf.fuel.httpDelete
import com.github.kittinunf.fuel.httpGet
import com.github.kittinunf.fuel.httpPost
import com.github.kittinunf.result.Result
import com.github.salomonbrys.kotson.fromJson
import com.google.auth.oauth2.AccessToken
import com.google.auth.oauth2.GoogleCredentials
import com.google.firebase.auth.UserRecord
import com.google.gson.Gson
import com.google.gson.GsonBuilder
import dev.mfazio.tworooms.restclient.types.*
import dev.mfazio.tworooms.types.GameStatus
import dev.mfazio.tworooms.types.TwoRoomsGame
import dev.mfazio.tworooms.types.TwoRoomsRole
import java.util.*

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
            if (responseString != null) firebaseDocumentGson.fromJson<FirebaseDocument>(responseString ?: "") else null,
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
        val documentsList = firebaseDocumentGson.fromJson<Map<String, List<FirebaseDocument>>>(responseString ?: "")

        return FirebaseRestResponse(
            documentsList.values.first(),
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

    fun addUserToGame(gameCode: String, user: UserRecord): Result<String, FuelError> {
        checkAccessToken()
        val body = Gson().toJson(
            FirebaseDocument(
                fields = mapOf(
                    "name" to StringValueObject(user.displayName),
                    "uid" to StringValueObject(user.uid)
                )
            )
        )

        val (request, response, result) = "$baseAPIUrl/$gameCode/players?documentId=${user.uid}"
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

    private fun checkAccessToken() {
        if(this.accessToken.expirationTime?.before(Date()) != false) {
            this.accessToken = scoped.refreshAccessToken()
        }
    }

    companion object {
        private val firebaseDocumentGson = GsonBuilder()
            .registerTypeAdapter(ValueObject::class.java, ValueObjectDeserializer())
            .create()
    }
}