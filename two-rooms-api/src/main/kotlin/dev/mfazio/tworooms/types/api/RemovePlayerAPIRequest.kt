package dev.mfazio.tworooms.types.api

data class RemovePlayerAPIRequest(
    val gameCode: String,
    val uid: String,
    val token: String
)