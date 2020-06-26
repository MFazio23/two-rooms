package dev.mfazio.tworooms.types.api

import kotlinx.serialization.Serializable

@Serializable
data class AddRandomPlayersAPIRequest(
    val gameCode: String,
    val count: Int? = null
)