package dev.mfazio.tworooms.types

data class JoinGameRequest(
    val uid: String? = null,
    val gameCode: String,
    val playerName: String
)