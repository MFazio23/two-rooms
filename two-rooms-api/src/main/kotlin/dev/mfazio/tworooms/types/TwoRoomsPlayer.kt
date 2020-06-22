package dev.mfazio.tworooms.types

import dev.mfazio.tworooms.restclient.types.FirebaseDocument
import dev.mfazio.tworooms.restclient.types.StringValueObject
import kotlinx.serialization.Serializable

@Serializable
data class TwoRoomsPlayer(
    val uid: String,
    val name: String,
    val team: TwoRoomsTeam? = null,
    val role: TwoRoomsRole? = null
) {
    companion object {
        fun fromFirebaseDocument(document: FirebaseDocument?) = document?.fields?.let { fields ->
            TwoRoomsPlayer(
                (fields["uid"] as? StringValueObject)?.stringValue ?: "N/A",
                (fields["name"] as? StringValueObject)?.stringValue ?: "N/A",
                TwoRoomsTeam.valueOfOrDefault((fields["team"] as? StringValueObject)?.stringValue),
                TwoRoomsRole.valueOfOrDefault((fields["role"] as? StringValueObject)?.stringValue ?: "N/A")
            )
        }
    }
}