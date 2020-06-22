package dev.mfazio.tworooms.types.api

import kotlinx.serialization.Serializable

@Serializable
data class CreateGameAPIRequest(
    val name: String,
    val roles: Map<String, Boolean>
)