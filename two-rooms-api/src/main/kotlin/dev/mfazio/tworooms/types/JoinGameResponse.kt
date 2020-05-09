package dev.mfazio.tworooms.types

data class JoinGameResponse(
    val uid: String,
    val gameCode: String,
    val playerName: String,
    val token: String
)