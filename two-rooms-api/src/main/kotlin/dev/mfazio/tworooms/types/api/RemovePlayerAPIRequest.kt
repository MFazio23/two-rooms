package dev.mfazio.tworooms.types.api

import kotlinx.serialization.Serializable

@Serializable
data class RemovePlayerAPIRequest(
    val gameCode: String,
    val uid: String,
    val token: String
)