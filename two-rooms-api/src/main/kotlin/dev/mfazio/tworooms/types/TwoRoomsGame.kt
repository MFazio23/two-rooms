package dev.mfazio.tworooms.types

import dev.mfazio.tworooms.restclient.types.ArrayValueObject
import dev.mfazio.tworooms.restclient.types.FirebaseDocument
import dev.mfazio.tworooms.restclient.types.StringValueObject
import kotlinx.serialization.Serializable

@Serializable
data class TwoRoomsGame(
    val gameCode: String,
    val status: GameStatus = GameStatus.Unknown,
    val ownerUID: String,
    val roles: List<TwoRoomsRole> = emptyList(),
    val players: List<TwoRoomsPlayer?> = emptyList()
) {
    companion object {
        fun fromFirebaseDocuments(
            gameDocument: FirebaseDocument?,
            playerDocuments: List<FirebaseDocument?>? = emptyList()
        ) = gameDocument?.fields?.let { fields ->
            TwoRoomsGame(
                (fields["gameCode"] as? StringValueObject)?.stringValue ?: "N/A",
                GameStatus.valueOfOrDefault((fields["status"] as? StringValueObject)?.stringValue),
                (fields["ownerUID"] as? StringValueObject)?.stringValue ?: "N/A",
                TwoRoomsRole.fromArrayValueObject(fields["roles"] as? ArrayValueObject),
                playerDocuments?.map { TwoRoomsPlayer.fromFirebaseDocument(it) } ?: emptyList()
            )
        }

        fun generateGameCode() = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
            .map { it }
            .shuffled()
            .joinToString("")
            .take(6)
    }
}