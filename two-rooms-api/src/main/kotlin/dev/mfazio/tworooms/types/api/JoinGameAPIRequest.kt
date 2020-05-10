package dev.mfazio.tworooms.types.api

data class JoinGameAPIRequest(
    val name: String,
    val gameCode: String
)