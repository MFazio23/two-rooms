package dev.mfazio.tworooms.types.api

data class AddRandomPlayersAPIRequest(
    val gameCode: String,
    val count: Int? = null
)